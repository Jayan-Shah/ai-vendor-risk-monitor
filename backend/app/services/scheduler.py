import asyncio
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy.orm import Session
from app.models.vendor import SessionLocal, Vendor
from app.services.cyber import run_cyber_recon
from app.services.identity import run_identity_recon
from app.services.financial import run_financial_recon
from app.services.ai_agent import analyze_vendor_risk

async def scheduled_vendor_scan():
    print("\n[CRON] 🕒 Waking up: Starting continuous background scan of all vendors...")
    db: Session = SessionLocal()
    try:
        vendors = db.query(Vendor).all()
        for vendor in vendors:
            print(f"[CRON] 🔍 Scanning {vendor.name} ({vendor.domain})...")
            
            # 1. Run the APIs (Notice we don't pass a websocket callback here, so it runs silently)
            cyber_task = run_cyber_recon(vendor.domain)
            identity_task = run_identity_recon(vendor.domain)
            financial_task = run_financial_recon(vendor.name)
            
            cyber_data, identity_data, financial_data = await asyncio.gather(
                cyber_task, identity_task, financial_task
            )
            
            master_recon_data = {
                "domain": vendor.domain,
                "cyber": cyber_data,
                "identity": identity_data,
                "financial": financial_data
            }
            
            # 2. AI Analysis (Run in background thread so the scheduler doesn't freeze)
            loop = asyncio.get_event_loop()
            analysis = await loop.run_in_executor(
                None, analyze_vendor_risk, vendor.name, vendor.domain, master_recon_data
            )
            
            # 3. Update Database
            vendor.raw_api_data = master_recon_data
            if "risk_score" in analysis:
                vendor.risk_score = analysis["risk_score"]
                vendor.mitigation_playbook = analysis.get("mitigation_playbook", [])
            
            db.commit()
            print(f"[CRON] ✅ Successfully updated {vendor.name}. New Score: {vendor.risk_score}")
            
            # Sleep for 5 seconds between vendors so we don't get IP-banned by the free APIs
            await asyncio.sleep(5)
            
    except Exception as e:
        print(f"[CRON] ❌ Error during background scan: {e}")
    finally:
        db.close()
        
    print("[CRON] 🏁 Background scan cycle complete. Going back to sleep.\n")

def start_scheduler():
    """Initializes and starts the background chron job."""
    scheduler = AsyncIOScheduler()
    
    # For testing purposes, we will run this every 10 minutes. 
    # In production, you would change this to run once a day at 2:00 AM using:
    # scheduler.add_job(scheduled_vendor_scan, 'cron', hour=2, minute=0)
    
    scheduler.add_job(scheduled_vendor_scan, 'interval', minutes=10)
    scheduler.start()
    print("[SYSTEM] ⚙️ Continuous Monitoring Scheduler Started.")