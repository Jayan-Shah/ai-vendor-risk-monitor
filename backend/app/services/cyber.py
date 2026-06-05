import os
import aiohttp
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from app.schemas import CyberRecon, RiskFinding

# Force load .env from the root backend folder
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

CENSYS_TOKEN = os.getenv("CENSYS_TOKEN")

# --- 1. THE CENSYS ENGINE (V3) ---
async def check_censys_ports(ip: str) -> list:
    """Queries Censys V3 and extracts host metadata even if services are hidden."""
    if not CENSYS_TOKEN or not ip:
        return []

    url = f"https://api.platform.censys.io/v3/global/asset/host/{ip}"
    headers = {"Accept": "application/json", "Authorization": f"Bearer {CENSYS_TOKEN}"}
    
    open_ports = []
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, headers=headers, timeout=15) as res:
                if res.status == 200:
                    data = await res.json()
                    result = data.get("result", {})
                    resource = result.get("resource", {})
                    
                    # 1. Grab Services (Ports)
                    services = resource.get("services", [])
                    for s in services:
                        port = s.get("port")
                        name = s.get("service_name", "unknown")
                        if port and port not in [80, 443]:
                            open_ports.append({"ip": ip, "port": port, "service": name})
                    
                    # 2. LOG LOUDLY: Even if 0 ports, report the infrastructure details
                    asn_info = resource.get("autonomous_system", {}).get("name", "Unknown ISP")
                    location = resource.get("location", {}).get("country", "Unknown")
                    print(f"[DEBUG] Censys identified {ip} as {asn_info} in {location}.")
                    
                else:
                    print(f"[DEBUG] Censys Error {res.status}")
        except Exception as e:
            print(f"[DEBUG] Censys Exception: {e}")
            
    return open_ports

# --- 2. THE SUBDOMAIN ENGINE ---
async def enumerate_subdomains(domain: str) -> list:
    """Scrapes crt.sh to find subdomains, with enhanced timeout/error handling."""
    url = f"https://crt.sh/?q=%.{domain}&output=json"
    subdomains = set()
    
    # Increase timeout to 25 seconds because crt.sh is notoriously slow
    timeout = aiohttp.ClientTimeout(total=25) 
    
    async with aiohttp.ClientSession(timeout=timeout) as session:
        try:
            async with session.get(url) as res:
                if res.status == 200:
                    try:
                        data = await res.json()
                        for entry in data:
                            name = entry.get('name_value', '').lower()
                            # Clean up wildcard certs and filter by actual domain
                            for sub in name.split('\n'):
                                if '*' not in sub and sub.endswith(domain):
                                    subdomains.add(sub)
                    except Exception:
                        print("[DEBUG] crt.sh returned non-JSON. Likely an HTML error page due to high server load.")
                else:
                    print(f"[DEBUG] Subdomain Scan Failed: crt.sh returned HTTP {res.status}")
                    
        except asyncio.TimeoutError:
            print("[DEBUG] Subdomain Scan Failed: crt.sh API timed out after 25 seconds.")
        except Exception as e:
            # Using !r ensures the actual exception type is printed even if the message is empty
            print(f"[DEBUG] Subdomain Scan Failed: {e!r}")
            
    return list(subdomains)[:15]

# --- 3. BASE DNS & GEO SCANS ---
async def check_email_security(domain: str) -> dict:
    results = {"spf_found": False, "dmarc_found": False, "dmarc_reject": False}
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"https://dns.google/resolve?name={domain}&type=TXT") as res:
                if res.status == 200:
                    for answer in (await res.json()).get("Answer", []):
                        if "v=spf1" in answer.get("data", ""): results["spf_found"] = True
            async with session.get(f"https://dns.google/resolve?name=_dmarc.{domain}&type=TXT") as res:
                if res.status == 200:
                    for answer in (await res.json()).get("Answer", []):
                        if "v=DMARC1" in answer.get("data", ""):
                            results["dmarc_found"] = True
                            if "p=reject" in answer.get("data", "") or "p=quarantine" in answer.get("data", ""): 
                                results["dmarc_reject"] = True
        except: pass
    return results

async def get_forced_ipv4(domain: str) -> str:
    """Explicitly queries Google DNS for the 'A' record (IPv4) to avoid Censys IPv6 blind spots."""
    async with aiohttp.ClientSession() as session:
        try:
            # type=1 specifically requests IPv4 addresses
            async with session.get(f"https://dns.google/resolve?name={domain}&type=1", timeout=10) as res:
                if res.status == 200:
                    data = await res.json()
                    answers = data.get("Answer", [])
                    if answers:
                        return answers[0].get("data") # Return the first IPv4 found
        except Exception as e:
            print(f"[DEBUG] Failed to force IPv4: {e}")
    return domain # Fallback to domain if it fails

async def check_hosting_geo(domain: str) -> dict:
    """Resolves ISP and Geo-location using the forced IPv4 address."""
    # 1. Force the IPv4 extraction first
    target_ip = await get_forced_ipv4(domain)
    
    # 2. Look up the ISP details using that specific IPv4
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"http://ip-api.com/json/{target_ip}?fields=65535") as res:
                if res.status == 200:
                    data = await res.json()
                    ip = data.get("query", target_ip)
                    
                    if ":" in ip:
                        print(f"[DEBUG] WARNING: Still resolved to IPv6 ({ip}). Censys data will be limited.")
                        
                    return {
                        "ip": ip, 
                        "country": data.get("country", "Unknown Location"), 
                        "isp": data.get("isp", "Unknown Provider"),
                        "status": "IPv6" if ":" in ip else "IPv4"
                    }
        except Exception as e:
            print(f"[DEBUG] Geo Resolution Failed: {e}")
            
    return {"ip": target_ip, "country": "Unknown Location", "isp": "Unknown Provider"}

# --- 4. MASTER ORCHESTRATOR ---
async def run_cyber_recon(domain: str, vendor_name: str = "", send_log_callback=None) -> dict:
    """Coalesces all cyber modules into a single, highly detailed findings report."""
    if send_log_callback: 
        await send_log_callback(f"[RECON] Initiating Deep Infrastructure Scan for {domain}...")

    # 1. Resolve IP and Get Cloud Metadata (Now forces IPv4)
    geo = await check_hosting_geo(domain)
    target_ip = geo.get("ip")
    isp = geo.get("isp", "Unknown Provider")
    country = geo.get("country", "Unknown Location")

    # 2. Fire Engines
    results = await asyncio.gather(
        check_email_security(domain),
        check_censys_ports(target_ip),
        enumerate_subdomains(domain)
    )
    email_sec, open_ports, subdomains = results
    
    # 3. THE "EVERY DETAIL" LOGGING
    if send_log_callback:
        # A. Infrastructure Identity (Always Show This)
        await send_log_callback(f"[DEEP-INTEL] Target resolved to {target_ip} ({isp}) in {country}.")
        
        # B. Subdomains
        await send_log_callback(f"[DEEP-INTEL] Discovered {len(subdomains)} active subdomains.")
        
        # C. Port Results
        if open_ports:
            port_list = ", ".join([str(p['port']) for p in open_ports])
            await send_log_callback(f"[ALERT] Censys detected exposed ports: {port_list}")
        else:
            await send_log_callback(f"[DEEP-INTEL] Censys scan of {isp} node complete. No non-standard ports visible.")

    # 4. Findings Generation for AI Risk Scoring
    findings = []
    
    # Port Vulnerabilities
    for p in open_ports:
        is_critical = p['port'] in [22, 3389, 2082, 2083, 2086, 2087, 27017, 5432]
        findings.append(RiskFinding(
            severity="Critical" if is_critical else "Medium",
            category="Infrastructure",
            title=f"Exposed {p['service'].upper()} (Port {p['port']})",
            description=f"Publicly accessible {p['service']} found on {p['ip']}."
        ).model_dump())

    # Email Vulnerabilities
    if not email_sec['dmarc_reject']:
        findings.append(RiskFinding(
            severity="High",
            category="Cyber",
            title="Weak Email Spoofing Policy",
            description=f"DMARC 'reject' or 'quarantine' policy missing for {domain}."
        ).model_dump())

    return {
        "email_security": email_sec,
        "cloud_hosting": geo,
        "subdomains": subdomains,
        "open_ports": open_ports,
        "findings": findings
    }