export const portfolioData = {
  globalScore: 72,
  totalVendors: 342,
  criticalAlerts: 8,
  riskDistribution: [
    { name: "Critical", value: 12, fill: "#ef4444" }, // Red
    { name: "High", value: 45, fill: "#f97316" }, // Orange
    { name: "Medium", value: 120, fill: "#eab308" }, // Yellow
    { name: "Low", value: 165, fill: "#22c55e" }, // Green
  ],
  topOffenders: [
    {
      id: 1,
      name: "DataSync Corp",
      domain: "datasync.io",
      score: 42,
      trend: "-12",
      tier: "Tier 1",
      issue: "CVE-2023-XXXX",
    },
    {
      id: 2,
      name: "Global Payroll",
      domain: "globalpay.com",
      score: 55,
      trend: "-5",
      tier: "Tier 1",
      issue: "Exposed RDP",
    },
    {
      id: 3,
      name: "Acme HVAC",
      domain: "acme-hvac.net",
      score: 58,
      trend: "-2",
      tier: "Tier 3",
      issue: "Dark Web Leak",
    },
  ],
  recentEvents: [
    {
      id: 101,
      text: "DataSync Corp score dropped 12 points due to unpatched firewall vulnerability.",
      time: "10 mins ago",
    },
    {
      id: 102,
      text: "Global Payroll added to OFAC watchlists.",
      time: "2 hours ago",
    },
  ],
};


export const vendorList = [
  {
    id: 1,
    name: "DataSync Corp",
    domain: "datasync.io",
    tier: "Tier 1",
    score: 42,
    trend: "-12",
    issues: 3,
    status: "Critical",
    category: "Cloud Infrastructure",
  },
  {
    id: 2,
    name: "Global Payroll",
    domain: "globalpay.com",
    tier: "Tier 1",
    score: 55,
    trend: "-5",
    issues: 1,
    status: "High",
    category: "HR & Finance",
  },
  {
    id: 3,
    name: "Acme HVAC",
    domain: "acme-hvac.net",
    tier: "Tier 3",
    score: 58,
    trend: "-2",
    issues: 2,
    status: "High",
    category: "Facilities",
  },
  {
    id: 4,
    name: "Stripe",
    domain: "stripe.com",
    tier: "Tier 1",
    score: 94,
    trend: "+1",
    issues: 0,
    status: "Good",
    category: "Payment Gateway",
  },
  {
    id: 5,
    name: "AWS Cloud",
    domain: "aws.amazon.com",
    tier: "Tier 1",
    score: 88,
    trend: "0",
    issues: 0,
    status: "Good",
    category: "Cloud Infrastructure",
  },
  {
    id: 6,
    name: "Zendesk",
    domain: "zendesk.com",
    tier: "Tier 2",
    score: 76,
    trend: "+4",
    issues: 0,
    status: "Medium",
    category: "Customer Support",
  },
  {
    id: 7,
    name: "Mailchimp",
    domain: "mailchimp.com",
    tier: "Tier 2",
    score: 81,
    trend: "+2",
    issues: 0,
    status: "Good",
    category: "Marketing",
  },
  {
    id: 8,
    name: "Okta",
    domain: "okta.com",
    tier: "Tier 1",
    score: 92,
    trend: "0",
    issues: 0,
    status: "Good",
    category: "Identity Management",
  },
];



// Add this to the bottom of src/app/dummyData.js

export const vendorDetailData = {
  radarData: [
    { subject: 'Cyber & Infra', A: 45, fullMark: 100 },
    { subject: 'Identity & Leaks', A: 85, fullMark: 100 },
    { subject: 'Financial Health', A: 92, fullMark: 100 },
    { subject: 'Compliance', A: 60, fullMark: 100 },
  ],
  historicalTrend: [
    { month: 'Jan', score: 85 }, { month: 'Feb', score: 86 }, 
    { month: 'Mar', score: 84 }, { month: 'Apr', score: 80 }, 
    { month: 'May', score: 72 }, { month: 'Jun', score: 65 }, 
    { month: 'Jul', score: 58 }, { month: 'Aug', score: 42 }, // Massive drop here
  ],
  openFindings: [
    { id: 1, severity: 'Critical', category: 'Cyber', title: 'CVE-2023-44487 (HTTP/2 Rapid Reset)', status: 'Open', age: '12 days' },
    { id: 2, severity: 'High', category: 'Identity', title: '3 Employee credentials found in Dark Web dump', status: 'Investigating', age: '2 days' },
    { id: 3, severity: 'Medium', category: 'Compliance', title: 'Missing DMARC Reject Policy on primary domain', status: 'Open', age: '45 days' },
    { id: 4, severity: 'Medium', category: 'Cyber', title: 'Exposed SSH Port (22) on sub.datasync.io', status: 'Open', age: '8 days' },
  ]
};

// Add to the bottom of src/app/dummyData.js

export const alertsData = [
  { id: 'AL-1042', vendor: 'DataSync Corp', title: 'CVE-2023-44487 (HTTP/2 Rapid Reset)', severity: 'Critical', status: 'Open', time: '2 hours ago' },
  { id: 'AL-1043', vendor: 'Global Payroll', title: 'Exposed RDP Port (3389)', severity: 'High', status: 'Open', time: '5 hours ago' },
  { id: 'AL-1038', vendor: 'Acme HVAC', title: '3 Employee credentials leaked on Dark Web', severity: 'High', status: 'Investigating', time: '1 day ago' },
  { id: 'AL-1039', vendor: 'DataSync Corp', title: 'Missing Security Headers (HSTS)', severity: 'Medium', status: 'Investigating', time: '2 days ago' },
  { id: 'AL-1035', vendor: 'Stripe', title: 'Missing DMARC Reject Policy', severity: 'Low', status: 'Resolved', time: '3 days ago' },
  { id: 'AL-1031', vendor: 'Zendesk', title: 'Expired SSL Certificate on sub-domain', severity: 'Medium', status: 'Resolved', time: '1 week ago' },
];





// Add to the bottom of src/app/dummyData.js
export const questionnaireData = [
  { id: 'Q-501', vendor: 'DataSync Corp', title: 'Annual Security Assessment', status: 'In Progress', progress: 65, dueDate: 'Mar 15, 2026' },
  { id: 'Q-502', vendor: 'Global Payroll', title: 'Data Privacy Impact Assessment', status: 'Under Review', progress: 100, dueDate: 'Mar 10, 2026' },
  { id: 'Q-503', vendor: 'Acme HVAC', title: 'Onboarding Questionnaire', status: 'Sent', progress: 0, dueDate: 'Mar 25, 2026' },
  { id: 'Q-504', vendor: 'Stripe', title: 'PCI-DSS Compliance Check', status: 'Completed', progress: 100, dueDate: 'Feb 20, 2026' },
];




export const existingTemplates = [
  { id: 'T-1', name: 'Standard Vendor Risk (VSA)', questions: 24, lastModified: '2 days ago' },
  { id: 'T-2', name: 'SOC 2 Readiness Check', questions: 45, lastModified: '1 week ago' },
  { id: 'T-3', name: 'GDPR Data Privacy Annex', questions: 12, lastModified: '3 weeks ago' },
];





export const vendorData = [
  {
    id: "V-1",
    name: "DataSync Corp",
    domain: "datasync.io",
    tier: "Tier 1",
    score: 42,
    issues: 3,
    trend: "-12 pts",
    category: "Cloud Service",
  },
  {
    id: "V-2",
    name: "Global Payroll",
    domain: "globalpay.com",
    tier: "Tier 1",
    score: 55,
    issues: 1,
    trend: "-5 pts",
    category: "Finance",
  },
  {
    id: "V-3",
    name: "Acme HVAC",
    domain: "acme-hvac.net",
    tier: "Tier 3",
    score: 58,
    issues: 2,
    trend: "-2 pts",
    category: "Facility",
  },
  {
    id: "V-4",
    name: "Stripe",
    domain: "stripe.com",
    tier: "Tier 1",
    score: 94,
    issues: 0,
    trend: "+1 pts",
    category: "Payments",
  },
  {
    id: "V-5",
    name: "AWS Cloud",
    domain: "aws.amazon.com",
    tier: "Tier 1",
    score: 88,
    issues: 0,
    trend: "stable",
    category: "Infrastructure",
  },
];

// 2. COMPLIANCE DATA (Used by Reporting.tsx)
export const complianceData = [
  { id: 1, name: "SOC 2 Type II", coverage: 85, gaps: 2, status: "Healthy" },
  { id: 2, name: "ISO 27001", coverage: 62, gaps: 5, status: "Warning" },
  { id: 3, name: "NIST CSF", coverage: 94, gaps: 1, status: "Healthy" },
  { id: 4, name: "GDPR / Privacy", coverage: 40, gaps: 8, status: "Critical" },
];

// 3. AUDIT LOGS (Used by Reporting.tsx sidebar)
export const auditLogs = [
  { action: "Dismissed Alert AL-1035", user: "JAYAN SHAH", time: "1 hour ago" },
  {
    action: "Generated Board Report Q1",
    user: "ANALYST_ALPHA",
    time: "4 hours ago",
  },
  {
    action: "Changed Vendor Weighting (Cyber: 40%)",
    user: "JAYAN SHAH",
    time: "Yesterday",
  },
];

// 4. TEMPLATE DATA (Used by Questionnaire System)
export const initialTemplates = [
  {
    id: "T-1",
    name: "Standard Vendor Risk (VSA)",
    questions: 24,
    lastModified: "2 days ago",
  },
  {
    id: "T-2",
    name: "SOC 2 Readiness Check",
    questions: 45,
    lastModified: "1 week ago",
  },
  {
    id: "T-3",
    name: "GDPR Data Privacy Annex",
    questions: 12,
    lastModified: "3 weeks ago",
  },
];

// 5. BUILDER COMPONENTS (Used by QuestionnaireBuilder.tsx)
export const builderElements = [
  { id: "be-1", type: "Short Answer" },
  { id: "be-2", type: "Multiple Choice" },
  { id: "be-3", type: "File Upload" },
  { id: "be-4", type: "Yes/No Toggle" },
  { id: "be-5", type: "Date Picker" },
];

// 6. RISK CONFIG (Used by Settings.tsx)
export const riskConfig = {
  weights: [
    {
      id: "cyber",
      label: "Cyber & Infrastructure",
      value: 40,
      description: "Weight of unpatched systems and open ports",
    },
    {
      id: "identity",
      label: "Identity & Leaks",
      value: 30,
      description: "Weight of leaked credentials and dark web activity",
    },
    {
      id: "financial",
      label: "Financial Health",
      value: 15,
      description: "Weight of credit scores and financial stability",
    },
    {
      id: "compliance",
      label: "Compliance & Legal",
      value: 15,
      description: "Weight of SOC 2, ISO, and regulatory gaps",
    },
  ],
  thresholds: {
    critical: 45,
    warning: 73,
  },
};