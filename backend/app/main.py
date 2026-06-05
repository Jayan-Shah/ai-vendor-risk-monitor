from fastapi import FastAPI, WebSocket, WebSocketDisconnect, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.vendor import SessionLocal, Vendor, Alert
from app.services.cyber import run_cyber_recon
from app.services.identity import run_identity_recon
from app.services.financial import run_financial_recon
from app.services.ai_agent import analyze_vendor_risk
from app.services.scheduler import start_scheduler
import datetime
from pydantic import BaseModel

app = FastAPI(title="VigiLink AI Recon Engine")

# START THE CRON JOB WHEN THE SERVER BOOTS
# @app.on_event("startup")
# async def startup_event():
    # start_scheduler()

# Allow the Next.js frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# WebSocket Connection Manager for Real-Time Streaming logs
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, ws: WebSocket, vendor_id: str):
        await ws.accept()
        self.active_connections[vendor_id] = ws

    def disconnect(self, vendor_id: str):
        if vendor_id in self.active_connections:
            del self.active_connections[vendor_id]

    async def send_message(self, message: str, vendor_id: str):
        if vendor_id in self.active_connections:
            await self.active_connections[vendor_id].send_text(message)

manager = ConnectionManager()

async def process_vendor_recon(domain: str, vendor_name: str, ws_id: str):
    """
    Background worker that runs the APIs and streams progress to the frontend via WebSockets
    """
    async def log(msg: str):
        # Stream logs back to the Next.js UI instantly
        await manager.send_message(json.dumps({"type": "log", "message": msg}), ws_id)
        await asyncio.sleep(0.1) 

    db = SessionLocal()
    try:
        # Give the frontend a moment to complete the WS handshake before streaming begins
        await asyncio.sleep(1.0)
        await log(f"[SYSTEM] Job assigned. Target acquired: {domain}")
        
        # 1. API Recon Layer (Run all 3 concurrently)
        await log(f"[SYSTEM] Launching Triple-Engine Async OSINT gatherers...")
        
        cyber_task = run_cyber_recon(domain, vendor_name=vendor_name, send_log_callback=log) 
        identity_task = run_identity_recon(domain, send_log_callback=log)
        financial_task = run_financial_recon(vendor_name, send_log_callback=log)
        
        cyber_data, identity_data, financial_data = await asyncio.gather(cyber_task, identity_task, financial_task)
        
        # --- ENTERPRISE STRICT MATH ENGINE ---
        cyber_findings = cyber_data.get("findings", [])
        id_findings = identity_data.get("findings", [])
        fin_findings = financial_data.get("findings", [])
        
        # Category scores for the Radar Chart (Base 100, deduct 15 per category issue)
        cyber_score = max(0, 100 - (len(cyber_findings) * 15))
        id_score = max(0, 100 - (len(id_findings) * 15))
        fin_score = max(0, 100 - (len(fin_findings) * 15))
        comp_score = 85 # Mock compliance score for now
        
        # Global Score: Start at 100, deduct 15 points for EVERY issue found total
        total_issues = len(cyber_findings) + len(id_findings) + len(fin_findings)
        calculated_global_score = max(0, 100 - (total_issues * 15))
        # ------------------------------

        # --- THE FIX: FLATTEN DATA FOR THE FRONTEND REPORT CARD ---
        flat_report_data = {
            "cloud_hosting": cyber_data.get("cloud_hosting", {}),
            "email_security": cyber_data.get("email_security", {}),
            "open_ports": cyber_data.get("open_ports", []),
            "subdomains": cyber_data.get("subdomains", []),
            # Safely extract GitHub leaks depending on how identity.py names them
            "github_leaks": identity_data.get("github_leaks", identity_data.get("leaks", [])), 
            # Safely extract News
            "news": financial_data.get("news", financial_data.get("negative_news", []))
        }

        master_recon_data = {
            "domain": domain,
            "cyber": cyber_data,
            "identity": identity_data,
            "financial": financial_data,
            "category_scores": {
                "cyber": cyber_score,
                "identity": id_score,
                "financial": fin_score,
                "compliance": comp_score
            },
            "recon_results": flat_report_data # Injected for the UI Report
        }
        
        # 2. AI Analytical Layer
        await log("[AI] Transmitting aggregated findings to Local Qwen2.5-Coder model.")
        
        # We strip out the massive raw data dumps to prevent Ollama from freezing
        slim_ai_payload = {
            "cyber_issues": cyber_data.get("findings", []),
            "identity_issues": identity_data.get("findings", []),
            "financial_issues": financial_data.get("findings", [])
        }
        
        loop = asyncio.get_event_loop()
        analysis = await loop.run_in_executor(
            None, 
            analyze_vendor_risk, 
            vendor_name, 
            domain, 
            slim_ai_payload 
        )
        
        # 3. Persistence Layer (Save to SQLite)
        await log("[DB] Committing findings and evaluating alert thresholds.")
        existing_vendor = db.query(Vendor).filter(Vendor.domain == domain).first()
        
        target_vendor = existing_vendor
        if existing_vendor:
            existing_vendor.name = vendor_name
            existing_vendor.raw_api_data = master_recon_data
            existing_vendor.risk_score = calculated_global_score 
            existing_vendor.mitigation_playbook = analysis.get("mitigation_playbook", [])
        else:
            new_vendor = Vendor(
                domain=domain,
                name=vendor_name,
                raw_api_data=master_recon_data,
                risk_score=calculated_global_score, 
                mitigation_playbook=analysis.get("mitigation_playbook", [])
            )
            db.add(new_vendor)
            target_vendor = new_vendor
            
        db.commit()
        db.refresh(target_vendor)

        # --- AUTO-ALERT GENERATOR ---
        if calculated_global_score < 75:
            all_findings = []
            all_findings.extend(cyber_data.get("findings", []))
            all_findings.extend(identity_data.get("findings", []))
            all_findings.extend(financial_data.get("findings", []))
            
            for finding in all_findings:
                existing_alert = db.query(Alert).filter(
                    Alert.vendor_id == target_vendor.id, 
                    Alert.title == finding["title"],
                    Alert.status != "Resolved"
                ).first()
                
                if not existing_alert:
                    new_alert = Alert(
                        vendor_id=target_vendor.id,
                        title=finding["title"],
                        severity=finding["severity"]
                    )
                    db.add(new_alert)
            
            db.commit()
        
        # 4. Send final payload to frontend via WebSocket
        analysis["risk_score"] = calculated_global_score
        analysis["recon_results"] = flat_report_data # THE FIX: Attach raw data to WebSocket
        
        await manager.send_message(json.dumps({
            "type": "result",
            "data": analysis
        }), ws_id)
        
        await log(f"[SYSTEM] Deep Analysis Complete. Calculated Score: {calculated_global_score}")
        await log("[SYSTEM] 🏁 All queued analysis jobs completed successfully.")
        
    except Exception as e:
        await manager.send_message(json.dumps({"type": "error", "message": str(e)}), ws_id)
    finally:
        db.close()


class GatekeeperRequest(BaseModel):
    domain: str
    vendor_name: str

@app.post("/api/vendors/gatekeeper")
async def run_gatekeeper_check(req: GatekeeperRequest):
    """Lightning-fast pre-onboarding check."""
    cyber_task = run_cyber_recon(req.domain)
    identity_task = run_identity_recon(req.domain)
    financial_task = run_financial_recon(req.vendor_name)
    
    cyber_data, identity_data, financial_data = await asyncio.gather(
        cyber_task, identity_task, financial_task
    )
    
    cyber_findings = cyber_data.get("findings", [])
    id_findings = identity_data.get("findings", [])
    fin_findings = financial_data.get("findings", [])
    
    total_issues = len(cyber_findings) + len(id_findings) + len(fin_findings)
    gatekeeper_score = max(0, 100 - (total_issues * 15))
    
    detailed_checks = []
    
    # A. DMARC Check 
    email_sec = cyber_data.get("email_security", {})
    if email_sec.get("dmarc_reject"):
        detailed_checks.append({"aspect": "DMARC Anti-Spoofing", "status": "Pass", "detail": "Strict reject policy enforced."})
    else:
        detailed_checks.append({"aspect": "DMARC Anti-Spoofing", "status": "Fail", "detail": "Missing reject policy. Vulnerable to email spoofing."})
        
    # B. SPF Check 
    if email_sec.get("spf_found"):
        detailed_checks.append({"aspect": "SPF Verification", "status": "Pass", "detail": "Sender Policy Framework is properly configured."})
    else:
        detailed_checks.append({"aspect": "SPF Verification", "status": "Fail", "detail": "No SPF records detected."})
        
    # C. SSL/TLS Certificate Check
    certs = cyber_data.get("certificates", [])
    if len(certs) > 0 and "error" not in certs[0]:
        detailed_checks.append({"aspect": "SSL/TLS Certificates", "status": "Pass", "detail": "Valid SSL/TLS certificates found and verified."})
    else:
        detailed_checks.append({"aspect": "SSL/TLS Certificates", "status": "Fail", "detail": "Missing, expired, or unverifiable SSL certificates."})
        
    # D. Data Breach Check
    breaches = identity_data.get("historical_breaches", [])
    if len(breaches) > 0:
        detailed_checks.append({"aspect": "Historical Breaches", "status": "Fail", "detail": f"Domain found in {len(breaches)} known dark web breaches."})
    else:
        detailed_checks.append({"aspect": "Historical Breaches", "status": "Pass", "detail": "No known corporate data breaches detected."})

    # E. Negative News
    news = financial_data.get("negative_news", [])
    if len(news) > 0 and "error" not in news[0]:
        detailed_checks.append({"aspect": "Reputation & Financial Risk", "status": "Fail", "detail": f"Detected {len(news)} recent articles indicating regulatory, legal, or financial risk."})
    else:
        detailed_checks.append({"aspect": "Reputation & Financial Risk", "status": "Pass", "detail": "No immediate negative news or financial distress signals detected."})

    status = "warning" if gatekeeper_score < 75 else "pass"
        
    return {
        "status": status,
        "score": gatekeeper_score,
        "detailed_checks": detailed_checks
    }

@app.post("/api/vendors/add")
def add_vendor_to_db(req: GatekeeperRequest, db: Session = Depends(get_db)):
    existing_vendor = db.query(Vendor).filter(Vendor.domain == req.domain).first()
    if not existing_vendor:
        new_vendor = Vendor(
            domain=req.domain,
            name=req.vendor_name,
            risk_score=None, 
            raw_api_data={}
        )
        db.add(new_vendor)
        db.commit()
    return {"status": "success"}

@app.post("/api/vendors/scan")
async def scan_vendor(domain: str, vendor_name: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing_vendor = db.query(Vendor).filter(Vendor.domain == domain).first()
    if not existing_vendor:
        new_vendor = Vendor(
            domain=domain,
            name=vendor_name,
            risk_score=None,
            raw_api_data={}
        )
        db.add(new_vendor)
        db.commit()

    ws_id = domain
    background_tasks.add_task(process_vendor_recon, domain, vendor_name, ws_id)
    
    return {
        "status": "queued", 
        "ws_id": ws_id, 
        "message": f"Scan queued for {domain}."
    }

@app.websocket("/ws/recon/{ws_id}")
async def websocket_endpoint(websocket: WebSocket, ws_id: str):
    await manager.connect(websocket, ws_id)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(ws_id)

@app.get("/api/dashboard/kpis")
def get_dashboard_kpis(db: Session = Depends(get_db)):
    vendors = db.query(Vendor).all()
    total_vendors = len(vendors)
    
    if total_vendors == 0:
        return {"globalScore": 0, "totalVendors": 0, "criticalAlerts": 0, "topOffenders": []}
        
    valid_scores = [v.risk_score for v in vendors if v.risk_score is not None]
    global_score = int(sum(valid_scores) / len(valid_scores)) if valid_scores else 100
    critical_alerts = sum(1 for score in valid_scores if score < 50)
    top_offenders_query = db.query(Vendor).filter(Vendor.risk_score != None).order_by(Vendor.risk_score.asc()).limit(5).all()
    
    top_offenders = [{"id": v.id, "name": v.name, "domain": v.domain, "score": v.risk_score, "tier": "Tier 1"} for v in top_offenders_query]
    
    return {
        "globalScore": global_score,
        "totalVendors": total_vendors,
        "criticalAlerts": critical_alerts,
        "topOffenders": top_offenders
    }

@app.get("/api/vendors")
def get_all_vendors(db: Session = Depends(get_db)):
    """Fetches all monitored vendors for the Portfolio Table."""
    vendors = db.query(Vendor).all()
    
    result = []
    for v in vendors:
        issues_count = 0
        recon_results = {}
        
        if v.raw_api_data:
            cyber_findings = v.raw_api_data.get("cyber", {}).get("findings", [])
            id_findings = v.raw_api_data.get("identity", {}).get("findings", [])
            fin_findings = v.raw_api_data.get("financial", {}).get("findings", [])
            issues_count = len(cyber_findings) + len(id_findings) + len(fin_findings)
            # THE FIX: Ensure the Table API returns the raw data for the Report Card
            recon_results = v.raw_api_data.get("recon_results", {})
            
        score = v.risk_score if v.risk_score is not None else 100
            
        result.append({
            "id": v.id,
            "name": v.name,
            "domain": v.domain,
            "score": score,
            "tier": "Tier 1", 
            "issues": issues_count,
            "status": "Critical" if score < 50 else "High" if score < 75 else "Good",
            "category": "Cloud Infrastructure",
            "recon_results": recon_results # Allows immediate rendering upon clicking "Report"
        })
        
    return result

@app.get("/api/vendors/{domain}")
def get_vendor_details(domain: str, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.domain == domain).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
        
    return {
        "id": vendor.id,
        "name": vendor.name,
        "domain": vendor.domain,
        "score": vendor.risk_score,
        "mitigation_playbook": vendor.mitigation_playbook,
        "raw_data": vendor.raw_api_data
    }

@app.get("/api/alerts")
def get_active_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).all()
    
    result = []
    for a in alerts:
        diff = datetime.datetime.utcnow() - a.created_at
        hours = int(diff.total_seconds() / 3600)
        time_str = f"{hours} hours ago" if hours > 0 else "Just now"
        
        result.append({
            "id": f"AL-{1000 + a.id}",
            "vendor": a.vendor.name if a.vendor else "Unknown",
            "title": a.title,
            "severity": a.severity,
            "status": a.status,
            "time": time_str
        })
        
    return result