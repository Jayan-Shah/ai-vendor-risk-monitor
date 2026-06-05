import asyncio
import json
from app.services.cyber import run_cyber_recon
from app.services.identity import run_identity_recon
from app.services.financial import run_financial_recon
from app.services.ai_agent import analyze_vendor_risk

async def console_logger(msg: str):
    print(msg)

async def main():
    target_domain = "canva.com" 
    target_name = "Canva"
    
    print(f"\n{'='*50}")
    print(f"🚀 INITIATING FULL SPECTRUM RECON: {target_name} ({target_domain})")
    print(f"{'='*50}\n")
    
    # Fire all 3 engines at the exact same time
    cyber_task = run_cyber_recon(target_domain, send_log_callback=console_logger)
    identity_task = run_identity_recon(target_domain, send_log_callback=console_logger)
    financial_task = run_financial_recon(target_name, send_log_callback=console_logger)
    
    cyber_data, identity_data, financial_data = await asyncio.gather(cyber_task, identity_task, financial_task)
    
    master_recon_data = {
        "domain": target_domain,
        "cyber": cyber_data,
        "identity": identity_data,
        "financial": financial_data
    }
    
    print(f"\n{'='*50}")
    print("🧠 PASSING COMBINED DATA TO LOCAL AI")
    print(f"{'='*50}\n")
    
    ai_result = analyze_vendor_risk(target_name, target_domain, master_recon_data)
    
    print(f"\n{'='*50}")
    print("🎯 FINAL AI PLAYBOOK & SCORE")
    print(f"{'='*50}\n")
    print(json.dumps(ai_result, indent=2))

if __name__ == "__main__":
    asyncio.run(main())