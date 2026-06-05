/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from "react";

// The static data required for the report.
const vendorIntelligence = [
  {
    name: "DataSync Corp",
    tier: "T1",
    score: 42,
    risk: "Critical",
    attackSurface: {
      domains: 14,
      openPorts: 11,
      exposedServices: 3,
      cloudBuckets: 2,
    },
    vulnerabilities: [
      {
        cve: "CVE-2025-0199",
        cvss: 9.8,
        service: "Firewall Gateway",
        sla: "24h",
      },
    ],
    darkWeb: { emails: 14, passwords: 3, source: "Genesis Market" },
  },
  {
    name: "Global Payroll",
    tier: "T1",
    score: 55,
    risk: "High",
    attackSurface: {
      domains: 4,
      openPorts: 2,
      exposedServices: 1,
      cloudBuckets: 0,
    },
    vulnerabilities: [
      { cve: "CVE-2024-3801", cvss: 7.5, service: "S3 Bucket", sla: "72h" },
    ],
    darkWeb: { emails: 2, passwords: 0, source: "Telegram Logs" },
  },
  {
    name: "AWS Cloud",
    tier: "T1",
    score: 88,
    risk: "Low",
    attackSurface: {},
    vulnerabilities: [],
    darkWeb: {},
  },
  {
    name: "Stripe",
    tier: "T1",
    score: 94,
    risk: "Low",
    attackSurface: {},
    vulnerabilities: [],
    darkWeb: {},
  },
];

const riskTrendData = [78, 76, 75, 73, 72, 72];

/**
 * This component is designed to be rendered conditionally and handles its own print lifecycle.
 * @param {() => void} onPrintFinished - A callback function to notify the parent component
 * that the print dialog has been closed, so it can be unmounted.
 */
export default function EnterpriseReportTemplate({
  onPrintFinished,
}: {
  onPrintFinished: () => void;
}) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // This hook manages the entire printing process.
  // It triggers the print dialog when the component mounts and cleans up afterwards.
  useEffect(() => {
    // A small timeout ensures the component has fully rendered in the DOM before printing.
    const timer = setTimeout(() => {
      window.print();
    }, 100);

    // This event fires after the print dialog is closed (whether printed or cancelled).
    const handleAfterPrint = () => {
      onPrintFinished(); // Notify the parent component to set isPrinting=false.
    };

    window.addEventListener("afterprint", handleAfterPrint);

    // Cleanup function: This is crucial to prevent memory leaks.
    return () => {
      clearTimeout(timer);
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [onPrintFinished]);

  // A reusable footer component for each page.
  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <div className="mt-auto pt-6 border-t border-slate-200 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest w-full">
      <span>CVM Intelligence Report • Q1 2026</span>
      <span>Page 0{pageNum} of 04</span>
    </div>
  );

  return (
    // The root element is hidden on screen and only visible for printing.
    // The `absolute` positioning ensures it doesn't interfere with the main app layout.
    <div
      id="board-report-print"
      className="hidden print:block absolute top-0 left-0 w-full z-[9999] bg-white text-slate-900 font-sans"
    >
      {/* ========================================================= */}
      {/* PAGE 1: COVER PAGE                                        */}
      {/* ========================================================= */}
      <div className="bg-white w-full h-[297mm] relative break-after-page flex flex-col">
        <div className="p-12 flex-1 flex flex-col w-full">
          <div className="border-l-8 border-blue-600 pl-8 mb-auto mt-20">
            <h1 className="text-6xl font-black text-slate-900 leading-tight tracking-tight uppercase">
              Vendor Risk <br />
              <span className="text-blue-600">Intelligence</span> <br />
              Report
            </h1>
            <p className="mt-6 text-slate-500 font-bold tracking-[0.2em] uppercase text-sm">
              Quarterly Assessment • Q1 2026
            </p>
          </div>
          <div className="grid grid-cols-2 gap-y-12 gap-x-8 bg-slate-50 p-10 rounded-3xl border border-slate-200 w-full mb-12">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Prepared For
              </p>
              <p className="text-xl font-bold text-slate-900">
                Executive Board
              </p>
              <p className="text-base text-slate-500">Acme Corporation</p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Prepared By
              </p>
              <p className="text-xl font-bold text-slate-900">Jayan Shah</p>
              <p className="text-base text-slate-500">
                Security Operations Lead
              </p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Date Generated
              </p>
              <p className="text-xl font-bold text-slate-900">{today}</p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                Classification
              </p>
              <span className="inline-block bg-red-100 text-red-700 px-4 py-1.5 rounded-md text-sm font-black uppercase tracking-widest mt-1">
                Strictly Confidential
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PAGE 2: EXECUTIVE SUMMARY & PORTFOLIO RISK                */}
      {/* ========================================================= */}
      <div className="bg-white w-full h-[297mm] flex flex-col p-12 break-after-page">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-b-4 border-slate-900 pb-3 mb-8 w-full">
          01. Executive Risk Summary
        </h2>
        <div className="flex w-full gap-4 mb-10">
          <div className="flex-1 bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Portfolio Score
            </p>
            <p className="text-4xl font-black text-slate-900">72</p>
          </div>
          <div className="flex-1 bg-red-50 p-6 rounded-2xl border-2 border-red-100">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">
              Critical Vendors
            </p>
            <p className="text-4xl font-black text-red-600">1</p>
          </div>
          <div className="flex-1 bg-amber-50 p-6 rounded-2xl border-2 border-amber-100">
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">
              High Risk
            </p>
            <p className="text-4xl font-black text-amber-600">1</p>
          </div>
          <div className="flex-1 bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Exposed Assets
            </p>
            <p className="text-4xl font-black text-slate-900">14</p>
          </div>
        </div>
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">
          Risk Trend (Last 6 Months)
        </h3>
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 mb-10 w-full">
          <svg viewBox="0 0 1200 150" className="w-full h-32 overflow-visible">
            {riskTrendData.map((val, i) => {
              const barHeight = (val / 100) * 120;
              const yPos = 130 - barHeight;
              const xPos = 100 + i * 200;
              return (
                <g key={i}>
                  <rect
                    x={xPos}
                    y={yPos}
                    width="60"
                    height={barHeight}
                    fill="#2563eb"
                    rx="4"
                  />
                  <text
                    x={xPos + 30}
                    y={yPos - 10}
                    textAnchor="middle"
                    fontSize="16"
                    fontWeight="bold"
                    fill="#0f172a"
                  >
                    {val}
                  </text>
                  <text
                    x={xPos + 30}
                    y="150"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#64748b"
                  >
                    Month {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">
          Vendor Risk Ranking
        </h3>
        <div className="border border-slate-200 rounded-2xl overflow-hidden w-full mb-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {vendorIntelligence.map((v, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 font-bold text-slate-900 text-base">
                    {v.name}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {v.tier}
                  </td>
                  <td className="px-6 py-4 font-black text-lg">{v.score}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        v.risk === "Critical"
                          ? "bg-red-100 text-red-700"
                          : v.risk === "High"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {v.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PageFooter pageNum={2} />
      </div>

      {/* ========================================================= */}
      {/* PAGE 3: THREAT INTELLIGENCE DEEP DIVE                     */}
      {/* ========================================================= */}
      <div className="bg-white w-full h-[297mm] flex flex-col p-12 break-after-page">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-b-4 border-slate-900 pb-3 mb-8 w-full">
          02. Threat Intelligence
        </h2>
        <div className="space-y-8 w-full mb-auto">
          {vendorIntelligence
            .filter((v) => v.risk === "Critical" || v.risk === "High")
            .map((vendor, i) => (
              <div
                key={i}
                className="border-2 border-slate-200 rounded-2xl p-6 bg-slate-50 relative overflow-hidden break-inside-avoid w-full"
              >
                {vendor.risk === "Critical" && (
                  <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
                )}
                {vendor.risk === "High" && (
                  <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
                )}
                <div className="flex justify-between items-start mb-6 pl-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">
                      {vendor.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                      {vendor.tier} Criticality
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-slate-900">
                      {vendor.score}
                      <span className="text-sm text-slate-400">/100</span>
                    </p>
                  </div>
                </div>
                <div className="pl-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                    External Assets
                  </h4>
                  <div className="flex w-full gap-4 mb-6">
                    <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">
                        Domains
                      </p>
                      <p className="text-xl font-black mt-1">
                        {vendor.attackSurface.domains}
                      </p>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">
                        Open Ports
                      </p>
                      <p className="text-xl font-black text-red-600 mt-1">
                        {vendor.attackSurface.openPorts}
                      </p>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">
                        Exposed Svcs
                      </p>
                      <p className="text-xl font-black text-amber-600 mt-1">
                        {vendor.attackSurface.exposedServices}
                      </p>
                    </div>
                    <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-500 font-bold uppercase">
                        Cloud Buckets
                      </p>
                      <p className="text-xl font-black mt-1">
                        {vendor.attackSurface.cloudBuckets}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full gap-6">
                    <div className="w-1/2">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                        Vulnerabilities
                      </h4>
                      {vendor.vulnerabilities.map((vuln, vidx) => (
                        <div
                          key={vidx}
                          className="bg-white border-2 border-red-200 p-4 rounded-xl w-full"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-black text-red-700 text-base">
                              {vuln.cve}
                            </span>
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-black">
                              CVSS {vuln.cvss}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">
                            <b>Affected:</b> {vuln.service}
                          </p>
                          <p className="text-xs text-red-600 font-bold mt-1">
                            SLA: {vuln.sla}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="w-1/2">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                        Credential Exposure
                      </h4>
                      <div className="bg-white border-2 border-slate-200 p-4 rounded-xl h-full flex flex-col justify-between w-full min-h-[110px]">
                        <div>
                          <div className="flex justify-between text-xs font-bold text-slate-800 mb-2">
                            <span>Emails Leaked:</span>
                            <span className="text-amber-600">
                              {vendor.darkWeb.emails}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-slate-800">
                            <span>Passwords Leaked:</span>
                            <span className="text-red-600">
                              {vendor.darkWeb.passwords}
                            </span>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-slate-100 mt-3">
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">
                            Source
                          </p>
                          <p className="text-xs font-bold text-slate-900">
                            {vendor.darkWeb.source}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <PageFooter pageNum={3} />
      </div>

      {/* ========================================================= */}
      {/* PAGE 4: REMEDIATION & METHODOLOGY                         */}
      {/* ========================================================= */}
      <div className="bg-white w-full h-[297mm] flex flex-col p-12">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-b-4 border-slate-900 pb-3 mb-8 w-full">
          03. Strategic Remediation
        </h2>
        <div className="bg-slate-900 text-white p-10 rounded-[2rem] mb-12 w-full break-inside-avoid">
          <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-6">
            Recommended Action Plan
          </h3>
          <ul className="space-y-6">
            <li className="flex gap-4 items-start">
              <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                1
              </span>
              <p className="text-sm font-medium leading-relaxed">
                Patch <b className="text-red-400">CVE-2025-0199</b> on DataSync
                Corp firewall immediately. Exploit is actively traded.
              </p>
            </li>
            <li className="flex gap-4 items-start">
              <span className="bg-amber-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                2
              </span>
              <p className="text-sm font-medium leading-relaxed">
                Encrypt exposed S3 buckets within Global Payroll infrastructure
                to comply with GDPR Art. 32.
              </p>
            </li>
            <li className="flex gap-4 items-start">
              <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                3
              </span>
              <p className="text-sm font-medium leading-relaxed">
                Force global password resets and enforce MFA for all credentials
                exposed on Genesis Market.
              </p>
            </li>
          </ul>
        </div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight border-b-4 border-slate-900 pb-3 mb-8 w-full">
          04. Security Rating Methodology
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-8">
          The CVM platform calculates algorithmic risk using a weighted
          distribution model across five primary security domains.
        </p>
        <div className="space-y-5 w-full mb-auto">
          {[
            { label: "Network Security", weight: "25%" },
            { label: "Application Security", weight: "20%" },
            { label: "Patch Cadence", weight: "20%" },
            { label: "Compliance Posture", weight: "20%" },
            { label: "Credential Exposure", weight: "15%" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 w-full break-inside-avoid"
            >
              <div className="w-48 text-sm font-bold text-slate-800">
                {item.label}
              </div>
              <div className="w-12 text-right text-sm font-black text-slate-900">
                {item.weight}
              </div>
            </div>
          ))}
        </div>
        <PageFooter pageNum={4} />
      </div>
    </div>
  );
}
