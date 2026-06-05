import asyncio
from ddgs import DDGS
from app.schemas import FinancialRecon, RiskFinding

def fetch_duckduckgo_sync(query: str):
    """Synchronous wrapper for the modern DDGS class."""
    try:
        with DDGS() as ddgs:
            # Fetch the top 3 results
            return list(ddgs.text(query, max_results=3))
    except Exception as e:
        return [{"error": "Search rate limited or failed", "details": str(e)}]

async def check_negative_news(vendor_name: str) -> list:
    """
    Searches DuckDuckGo for recent negative news regarding the vendor
    using specific risk-related keywords.
    """
    query = f'"{vendor_name}" (lawsuit OR breach OR bankruptcy OR layoff OR fined OR SEC)'
    
    # Run the synchronous search in a background thread so it doesn't block FastAPI
    loop = asyncio.get_event_loop()
    raw_results = await loop.run_in_executor(None, fetch_duckduckgo_sync, query)
    
    # Check if an error was returned
    if len(raw_results) > 0 and "error" in raw_results[0]:
        return raw_results

    results = []
    for r in raw_results:
        results.append({
            "title": r.get("title", ""),
            "snippet": r.get("body", ""),
            "link": r.get("href", "")
        })
        
    return results

async def run_financial_recon(vendor_name: str, send_log_callback=None) -> dict:
    """Orchestrates Financial & Reputational checks."""
    
    if send_log_callback: await send_log_callback(f"[RECON] Initiating Financial & Negative News scan for {vendor_name}...")
    
    news_results = await check_negative_news(vendor_name)
    
    if send_log_callback: 
        await send_log_callback(f"[RECON] Scraped {len(news_results)} recent news articles related to risk keywords.")

    findings = []
    
    # Simple rule: If we found articles matching these harsh keywords, flag it for the AI to read.
    if len(news_results) > 0 and "error" not in news_results[0]:
        findings.append(RiskFinding(
            severity="Medium",
            category="Financial",
            title="Potential Negative News Detected",
            description="Found recent media mentions involving lawsuits, layoffs, or regulatory action. (See AI summary for context)."
        ))

    recon_data = FinancialRecon(
        negative_news=news_results,
        findings=findings
    )
    
    return recon_data.model_dump()