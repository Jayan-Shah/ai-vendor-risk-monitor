import aiohttp
import asyncio
import os
from app.schemas import IdentityRecon, RiskFinding

async def check_hibp_breaches(domain: str) -> list:
    """
    Fetches the public (free) list of all major data breaches from HaveIBeenPwned
    and cross-references it with the target domain.
    """
    url = "https://haveibeenpwned.com/api/v3/breaches"
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, timeout=10) as res:
                if res.status == 200:
                    breaches = await res.json()
                    # Filter breaches where the domain matches our target
                    vendor_breaches = [
                        {
                            "name": b.get("Name"),
                            "date": b.get("BreachDate"),
                            "compromised_data": b.get("DataClasses", []),
                            "description": b.get("Description", "")[:200] + "..." # Truncate HTML
                        }
                        for b in breaches if domain.lower() in str(b.get("Domain", "")).lower()
                    ]
                    return vendor_breaches
        except Exception as e:
            return [{"error": "HIBP query failed", "details": str(e)}]
    return []

async def check_github_leaks(domain: str) -> dict:
    """
    Uses the GitHub Search API to find exposed secrets related to the domain.
    Requires a GitHub Personal Access Token (GITHUB_TOKEN) for real use.
    """
    github_token = os.getenv("GITHUB_TOKEN")
    
    if not github_token:
        # Graceful fallback for MVP if no token is provided
        return {"status": "simulated", "leaks_found": 0, "message": "Add GITHUB_TOKEN to .env for real scans."}
    
    url = f"https://api.github.com/search/code?q=\"{domain}\"+password+OR+secret+OR+token"
    headers = {
        "Authorization": f"token {github_token}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(url, headers=headers, timeout=10) as res:
                if res.status == 200:
                    data = await res.json()
                    total_count = data.get("total_count", 0)
                    return {"status": "success", "leaks_found": total_count}
                elif res.status == 403:
                    return {"status": "rate_limited", "leaks_found": "Unknown"}
        except:
            pass
            
    return {"status": "error", "leaks_found": "Unknown"}

async def run_identity_recon(domain: str, send_log_callback=None) -> dict:
    """Orchestrates the Identity & Data Compromise modules."""
    
    if send_log_callback: await send_log_callback(f"[RECON] Initiating Identity & Data Leak scan for {domain}...")
    
    results = await asyncio.gather(
        check_hibp_breaches(domain),
        check_github_leaks(domain)
    )
    
    breaches, github_data = results
    
    if send_log_callback: 
        await send_log_callback(f"[RECON] HIBP Historical Breaches Found: {len(breaches)}")
        await send_log_callback(f"[RECON] GitHub Secrets Exposure: {github_data.get('leaks_found', 0)} potential leaks")

    # Rule-Based Findings Engine
    findings = []
    
    if len(breaches) > 0:
        findings.append(RiskFinding(
            severity="Critical" if len(breaches) > 2 else "High",
            category="Identity",
            title=f"Vendor involved in {len(breaches)} historical data breaches",
            description=f"Most recent breach: {breaches[-1].get('date', 'Unknown')}. Data compromised includes: {', '.join(breaches[-1].get('compromised_data', []))}."
        ))
        
    if isinstance(github_data.get('leaks_found'), int) and github_data.get('leaks_found') > 0:
        findings.append(RiskFinding(
            severity="High",
            category="Identity",
            title=f"Potential Hardcoded Secrets on GitHub ({github_data['leaks_found']} files)",
            description="Developers may have committed source code containing API keys or passwords associated with this domain."
        ))

    # Validate and return using Pydantic
    recon_data = IdentityRecon(
        dark_web_leaks=[], # Placeholder for future Dark Web API
        github_leaks=[github_data],
        historical_breaches=breaches,
        findings=findings
    )
    
    return recon_data.model_dump()