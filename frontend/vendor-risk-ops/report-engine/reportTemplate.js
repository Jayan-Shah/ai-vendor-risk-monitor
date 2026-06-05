export default function template(data, css) {
  const {
    portfolioData,
    vendorList,
    vendorDetailData,
    alertsData,
    complianceData,
    auditLogs,
  } = data;

  return `

<!DOCTYPE html>
<html>

<head>

<meta charset="utf-8">

<title>Vendor Cyber Risk Report</title>

<style>
${css}
</style>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>


<body>


<!-- COVER PAGE -->

<section class="cover">

<div class="cover-container">

<h1 class="cover-title">
Vendor Supply Chain Cyber Risk Report
</h1>

<p class="cover-subtitle">
Confidential Security Intelligence Report
</p>

<p class="cover-meta">
Generated ${new Date().toDateString()}
</p>

</div>

</section>


<div class="page-break"></div>



<!-- EXECUTIVE SUMMARY -->

<section>

<h2 class="section-title">
Executive Risk Overview
</h2>

<div class="kpi-grid">

<div class="kpi-card">
<p class="kpi-label">Global Risk Score</p>
<p class="kpi-value danger">${portfolioData.globalScore}</p>
</div>

<div class="kpi-card">
<p class="kpi-label">Total Vendors</p>
<p class="kpi-value">${portfolioData.totalVendors}</p>
</div>

<div class="kpi-card">
<p class="kpi-label">Critical Alerts</p>
<p class="kpi-value danger">${portfolioData.criticalAlerts}</p>
</div>

</div>


<div class="chart-container">

<h3>Portfolio Risk Distribution</h3>

<canvas id="riskChart"></canvas>

</div>

</section>


<div class="page-break"></div>



<!-- EXECUTIVE HEATMAP -->

<section>

<h2 class="section-title">
Executive Vendor Risk Heatmap
</h2>

<div class="chart-container">

<canvas id="heatmapChart"></canvas>

</div>

</section>


<div class="page-break"></div>



<!-- VENDOR RANKING -->

<section>

<h2 class="section-title">
Vendor Risk Ranking
</h2>

<table class="data-table">

<thead>

<tr>
<th>Vendor</th>
<th>Domain</th>
<th>Tier</th>
<th>Score</th>
<th>Trend</th>
<th>Status</th>
</tr>

</thead>

<tbody>

${vendorList
  .map(
    (v) => `
<tr>

<td class="vendor-name">${v.name}</td>

<td>${v.domain}</td>

<td>${v.tier}</td>

<td>${v.score}</td>

<td>${v.trend}</td>

<td>
<span class="badge badge-${v.status.toLowerCase()}">
${v.status}
</span>
</td>

</tr>
`
  )
  .join("")}

</tbody>

</table>

</section>


<div class="page-break"></div>



<!-- SECURITY FINDINGS -->

<section>

<h2 class="section-title">
Security Findings
</h2>

<table class="data-table">

<thead>

<tr>
<th>Severity</th>
<th>Category</th>
<th>Finding</th>
<th>Status</th>
<th>Age</th>
</tr>

</thead>

<tbody>

${vendorDetailData.openFindings
  .map(
    (f) => `
<tr>

<td>
<span class="badge badge-${f.severity.toLowerCase()}">
${f.severity}
</span>
</td>

<td>${f.category}</td>

<td>${f.title}</td>

<td>${f.status}</td>

<td>${f.age}</td>

</tr>
`
  )
  .join("")}

</tbody>

</table>

</section>


<div class="page-break"></div>



<!-- COMPLIANCE MATRIX -->

<section>

<h2 class="section-title">
Compliance Framework Coverage
</h2>

<table class="data-table">

<thead>

<tr>
<th>Framework</th>
<th>Coverage</th>
<th>Gaps</th>
<th>Status</th>
</tr>

</thead>

<tbody>

${complianceData
  .map(
    (c) => `
<tr>

<td>${c.name}</td>

<td>${c.coverage}%</td>

<td>${c.gaps}</td>

<td>${c.status}</td>

</tr>
`
  )
  .join("")}

</tbody>

</table>

</section>


<div class="page-break"></div>



<!-- ALERT TIMELINE -->

<section>

<h2 class="section-title">
Security Alert Timeline
</h2>

<table class="data-table">

<thead>

<tr>
<th>ID</th>
<th>Vendor</th>
<th>Alert</th>
<th>Severity</th>
<th>Status</th>
<th>Time</th>
</tr>

</thead>

<tbody>

${alertsData
  .map(
    (a) => `
<tr>

<td>${a.id}</td>

<td>${a.vendor}</td>

<td>${a.title}</td>

<td>${a.severity}</td>

<td>${a.status}</td>

<td>${a.time}</td>

</tr>
`
  )
  .join("")}

</tbody>

</table>

</section>


<div class="page-break"></div>



<!-- RISK TREND -->

<section>

<h2 class="section-title">
Vendor Risk Timeline Analysis
</h2>

<div class="chart-container">

<canvas id="trendChart"></canvas>

</div>


<div class="chart-container">

<h3>Security Category Breakdown</h3>

<canvas id="radarChart"></canvas>

</div>

</section>


<div class="page-break"></div>



<!-- ATTACK SURFACE -->

<section>

<h2 class="section-title">
External Attack Surface Intelligence
</h2>

<div class="kpi-grid">

<div class="kpi-card">
<p class="kpi-label">Domains</p>
<p class="kpi-value">14</p>
</div>

<div class="kpi-card">
<p class="kpi-label">Subdomains</p>
<p class="kpi-value">88</p>
</div>

<div class="kpi-card">
<p class="kpi-label">Open Ports</p>
<p class="kpi-value">11</p>
</div>

<div class="kpi-card">
<p class="kpi-label">Certificates</p>
<p class="kpi-value">21</p>
</div>

<div class="kpi-card">
<p class="kpi-label">Cloud Buckets</p>
<p class="kpi-value">3</p>
</div>

<div class="kpi-card">
<p class="kpi-label">Public APIs</p>
<p class="kpi-value">9</p>
</div>

</div>

</section>


<div class="page-break"></div>



<!-- DARK WEB -->

<section>

<h2 class="section-title">
Dark Web Exposure Intelligence
</h2>

<table class="data-table">

<thead>

<tr>
<th>Source</th>
<th>Exposure</th>
<th>Vendor</th>
<th>Status</th>
</tr>

</thead>

<tbody>

<tr>
<td>BreachForum</td>
<td>Credential Leak</td>
<td>DataSync Corp</td>
<td><span class="badge badge-critical">Active</span></td>
</tr>

<tr>
<td>Genesis Market</td>
<td>Session Cookies</td>
<td>Global Payroll</td>
<td><span class="badge badge-high">Investigating</span></td>
</tr>

<tr>
<td>Telegram Logs</td>
<td>Email + Password</td>
<td>Acme HVAC</td>
<td><span class="badge badge-high">Active</span></td>
</tr>

</tbody>

</table>

</section>


<div class="page-break"></div>



<!-- REMEDIATION -->

<section>

<h2 class="section-title">
Security Remediation Roadmap
</h2>

<table class="data-table">

<thead>

<tr>
<th>Priority</th>
<th>Action</th>
<th>Vendor</th>
<th>SLA</th>
</tr>

</thead>

<tbody>

<tr>
<td>Critical</td>
<td>Patch CVE-2023-44487 firewall vulnerability</td>
<td>DataSync Corp</td>
<td>24 Hours</td>
</tr>

<tr>
<td>High</td>
<td>Disable exposed RDP port</td>
<td>Global Payroll</td>
<td>48 Hours</td>
</tr>

<tr>
<td>Medium</td>
<td>Implement DMARC reject policy</td>
<td>Stripe</td>
<td>7 Days</td>
</tr>

</tbody>

</table>

</section>


<div class="page-break"></div>



<!-- AUDIT LOGS -->

<section>

<h2 class="section-title">
Audit Activity Logs
</h2>

<table class="data-table">

<thead>

<tr>
<th>Action</th>
<th>User</th>
<th>Time</th>
</tr>

</thead>

<tbody>

${auditLogs
  .map(
    (log) => `
<tr>

<td>${log.action}</td>

<td>${log.user}</td>

<td>${log.time}</td>

</tr>
`
  )
  .join("")}

</tbody>

</table>

</section>



<script src="./charts.js"></script>

</body>

</html>

`;
}
