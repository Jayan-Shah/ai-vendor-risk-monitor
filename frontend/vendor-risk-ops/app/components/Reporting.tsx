/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  Download,
  ListChecks,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";

// Importing data from your central source
import { complianceData, auditLogs, vendorData } from "../dummyData";

// Import the new Enterprise Template
import EnterpriseReportTemplate from "./EnterpriseReportTemplate";

interface ReportingProps {
  handleVendorClick: (vendor: any) => void;
}

export default function Reporting({ handleVendorClick }: ReportingProps) {
  const [selectedFramework, setSelectedFramework] = useState("SOC 2");

  const [isPrinting, setIsPrinting] = useState(false);

  // LOGIC: Trigger the browser's native print engine for the PDF report
  const handlePrintFinished = () => {
    setIsPrinting(false);
  };

  // LOGIC: Mapping logic to simulate vendor violations per framework
  const getMappedVendors = () => {
    if (selectedFramework === "SOC 2") {
      // SOC 2 focuses on lower overall security scores
      return vendorData.filter((v) => v.score < 65);
    }
    if (selectedFramework === "GDPR") {
      // GDPR focuses on Tier 1 vendors with potential privacy impacts
      return vendorData.filter((v) => v.tier === "Tier 1");
    }
    if (selectedFramework === "DORA") {
      // DORA focuses on active operational issues
      return vendorData.filter((v) => v.issues > 0);
    }
    return [];
  };

  const mappedVendors = getMappedVendors();

  return (
    <div className="w-full font-sans text-slate-800 bg-[#F4F7F9] min-h-[calc(100vh-80px)] relative">
      {/* The Enterprise Report Template 
        (Hidden by default via CSS, becomes visible only during window.print())
      */}
      {isPrinting &&
        ReactDOM.createPortal(
          <EnterpriseReportTemplate onPrintFinished={handlePrintFinished} />,
          document.body
        )}

      {/* Header section with the Report Trigger */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reporting & Compliance
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-wide mt-1">
            Map real-time vendor risks to your regulatory baseline.
          </p>
        </div>
        <button
          onClick={() => setIsPrinting(true)}
          className="bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2.5 rounded shadow-sm text-sm font-medium transition flex items-center space-x-2"
        >
          <Download size={18} />
          <span>Generate Board Report (PDF)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Left: Main Framework Alignment & Interactive Mapping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dashboard Summary Cards */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <ShieldCheck size={16} className="text-[#2563EB]" /> Global Framework Alignment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceData.map((item: any) => (
                <div
                  key={item.id}
                  className="p-5 bg-white border border-slate-200 rounded-lg space-y-4 shadow-sm relative overflow-hidden group hover:border-[#2563EB]/50 transition-colors"
                >
                  <div className="flex justify-between items-center relative z-10">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${item.status === "Healthy"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : item.status === "Warning"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="space-y-2 relative z-10">
                    <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                      <span>Coverage: {item.coverage}%</span>
                      <span className="text-rose-600">
                        {item.gaps} Critical Gaps
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${item.status === "Healthy"
                            ? "bg-emerald-500"
                            : item.status === "Warning"
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                        style={{ width: `${item.coverage}%` }}
                      ></div>
                    </div>
                  </div>
                  {/* Subtle background decoration */}
                  {item.status === "Critical" && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Lab: Mapping Overlay */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm overflow-hidden">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 tracking-wide">
                  Regulatory Mapping Overlay
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Vendors currently impacting your {selectedFramework} baseline.
                </p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-md border border-slate-200">
                {["SOC 2", "GDPR", "DORA"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSelectedFramework(f)}
                    className={`px-4 py-1.5 rounded text-[11px] font-bold transition-all ${selectedFramework === f
                        ? "bg-white text-[#2563EB] shadow-sm border border-slate-200"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[250px] bg-slate-50/50 p-4 rounded-lg border border-slate-100">
              {mappedVendors.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {mappedVendors.map((vendor) => (
                    <button
                      key={vendor.id}
                      onClick={() => handleVendorClick(vendor)}
                      className="group flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg hover:border-[#2563EB] hover:shadow-md transition-all text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs border ${vendor.score < 55
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                        >
                          {vendor.score}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-[13px] mb-0.5">
                            {vendor.name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                            {selectedFramework === "SOC 2" &&
                              "CC7.1 Logic Access Fail"}
                            {selectedFramework === "GDPR" &&
                              "Art. 32 Privacy Breach"}
                            {selectedFramework === "DORA" &&
                              "ICT Risk Managed Deficit"}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="text-slate-400 group-hover:text-[#2563EB] transition-colors"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <ListChecks className="text-slate-400" size={24} />
                  </div>
                  <p className="text-slate-500 font-bold text-sm">
                    No mapped vendor gaps for {selectedFramework}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Audit Trail */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <FileText size={16} className="text-slate-500" /> Audit Trail (Immutable)
          </h2>
          <div className="space-y-6 flex-1 bg-slate-50/50 p-4 rounded-lg border border-slate-100">
            {auditLogs.map((log: any, index: number) => (
              <div key={index} className="flex gap-4 relative">
                {index !== auditLogs.length - 1 && (
                  <div className="absolute left-1.5 top-6 w-[2px] h-full bg-slate-200"></div>
                )}
                <div
                  className={`w-3.5 h-3.5 border-2 rounded-full mt-1 shrink-0 bg-white relative z-10 ${index === 0
                      ? "border-[#2563EB]"
                      : "border-slate-300"
                    }`}
                ></div>
                <div className="pb-4">
                  <p className="text-[13px] font-bold text-slate-900 leading-tight">
                    {log.action}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider bg-blue-50 px-1.5 py-0.5 rounded">
                      {log.user}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      {log.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 bg-slate-900 rounded-lg text-white shadow-lg relative overflow-hidden">
            <ShieldAlert size={80} className="absolute right-[-10px] bottom-[-10px] text-slate-800 opacity-50" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" /> Compliance Lock
              </h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                All reporting data is cryptographically signed for regulatory
                non-repudiation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
