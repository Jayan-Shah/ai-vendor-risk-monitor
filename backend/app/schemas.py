from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class RiskFinding(BaseModel):
    severity: str 
    category: str 
    title: str
    description: str

class CyberRecon(BaseModel):
    email_security: Dict[str, Any]      
    certificates: List[Dict[str, Any]]  
    headers: Dict[str, Any]             
    cloud_hosting: Dict[str, Any]
    subdomains: List[str]
    dnssec_enabled: bool
    exposed_buckets: List[str]
    open_ports: List[Dict[str, Any]] # <--- NEW CENSYS FIELD
    findings: List[RiskFinding]        

class IdentityRecon(BaseModel):
    dark_web_leaks: List[Dict[str, Any]]
    github_leaks: List[Dict[str, Any]]
    historical_breaches: List[Dict[str, Any]]
    findings: List[RiskFinding]

class FinancialRecon(BaseModel):
    negative_news: List[Dict[str, Any]]
    findings: List[RiskFinding]

class VendorReconPayload(BaseModel):
    domain: str
    cyber: CyberRecon
    identity: Optional[IdentityRecon] = None
    financial: Optional[FinancialRecon] = None
    category_scores: Optional[Dict[str, int]] = None