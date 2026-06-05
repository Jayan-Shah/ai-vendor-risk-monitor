import json
# Updated to the modern package
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate

def analyze_vendor_risk(vendor_name: str, domain: str, recon_data: dict, model_name: str = "qwen2.5-coder:7b"):
    """
    Sends the raw JSON from multiple APIs to Ollama for reasoning analysis.
    """
    import urllib.request
    try:
        # Fast check if Ollama is running
        try:
             urllib.request.urlopen("http://localhost:11434/", timeout=2)
        except:
             raise Exception("Ollama Engine is offline or unreachable.")

        # Updated Instantiation
        llm = OllamaLLM(model=model_name, temperature=0.2) # Low temperature for more analytical/less creative output
        
        template = """
        You are an elite Security Operations Center (SOC) Lead. Analyze the following recon data for Vendor '{vendor_name}' ({domain}).

        RAW API RECON DATA:
        {recon_data}

        INSTRUCTIONS:
        1. "risk_score": Calculate a global score from 0-100. Start at 100 and deduct points based ONLY on the items in the "findings" arrays across Cyber, Identity, and Financial.
        2. "blast_radius": Assess if the vendor poses a High, Medium, or Low risk.
        3. "mitigation_playbook": Provide a 3-step actionable playbook. YOU MUST ONLY SUGGEST FIXES FOR EXPLICIT "findings" LISTED IN THE DATA. If an area (like SPF/DMARC) passed, DO NOT suggest fixing it. If there are no findings, state "No critical mitigations required."
        4. "analysis_summary": A 1-sentence summary of the vendor's actual posture based on the data.

        IMPORTANT: Respond ONLY with valid JSON. No markdown formatting.

        Format:
        {{
        "risk_score": 65,
        "blast_radius": "High",
        "mitigation_playbook": ["Step 1", "Step 2", "Step 3"],
        "analysis_summary": "Summary here."
        }}
            """
        
        prompt = PromptTemplate(template=template, input_variables=["vendor_name", "domain", "recon_data"])
        
        print(f"Calling Ollama with model {model_name}...")
        raw_response = llm.invoke(prompt.format(vendor_name=vendor_name, domain=domain, recon_data=json.dumps(recon_data)))
        
        # Clean the response to ensure it parses as JSON
        start_idx = raw_response.find('{')
        end_idx = raw_response.rfind('}')
        if start_idx != -1 and end_idx != -1:
            clean_json = raw_response[start_idx:end_idx+1]
            return json.loads(clean_json)
            
        print("Raw AI output was not JSON:", raw_response)
        return {"error": "Failed to parse JSON", "raw": raw_response}
        
    except Exception as e:
        print(f"AI Exception: {str(e)}")
        return {
            "risk_score": 42,
            "blast_radius": "High",
            "mitigation_playbook": [
                "Fallback: Review DNS configuration.",
                "Fallback: Ensure SSL certificates are valid.",
                "Fallback: Run manual vulnerability scan."
            ],
            "analysis_summary": f"Fallback generation due to AI disconnect ({str(e)})."
        }