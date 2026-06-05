/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ExternalLink,
  Mail,
  Ticket,
  ShieldAlert,
  CheckCircle,
  Clock,
  Loader2,
  Bot,
  Info,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { vendorDetailData } from "../dummyData"; // We still use this just for the historical trendline mock

export default function VendorDetail({
  vendor,
  setActiveView,
  currentTheme,
}: {
  vendor: any;
  setActiveView: (v: string) => void;
  currentTheme: string;
}) {
  const [details, setDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch the deep-dive data from FastAPI
  useEffect(() => {
    const fetchVendorDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/api/vendors/${vendor.domain}`
        );
        if (res.ok) {
          const data = await res.json();
          setDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch vendor details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vendor?.domain) {
      fetchVendorDetails();
    }
  }, [vendor]);

  // 2. Dynamically Aggregate Findings from the Cyber, Identity, and Financial engines
  let liveFindings: any[] = [];
  if (details?.raw_data) {
    const cyberFindings = details.raw_data.cyber?.findings || [];
    const identityFindings = details.raw_data.identity?.findings || [];
    const financialFindings = details.raw_data.financial?.findings || [];

    liveFindings = [
      ...cyberFindings,
      ...identityFindings,
      ...financialFindings,
    ].map((f: any, i: number) => ({
      id: i,
      severity: f.severity,
      category: f.category,
      title: f.title,
      description: f.description,
      status: "Open",
      age: "New", // Flagged as new since it's a live scan
    }));
  }

  // 3. Dynamically Calculate Radar Chart Data based on live finding counts
  // 3. Dynamically Calculate Radar Chart Data based on strict backend math
  const getDynamicRadarData = () => {
    // Read the exact scores passed from the Python backend
    const scores = details?.raw_data?.category_scores || {
      cyber: 100,
      identity: 100,
      financial: 100,
      compliance: 100,
    };

    return [
      { subject: "Cyber & Infra", A: scores.cyber, fullMark: 100 },
      { subject: "Identity & Leaks", A: scores.identity, fullMark: 100 },
      { subject: "Financial Health", A: scores.financial, fullMark: 100 },
      { subject: "Compliance", A: scores.compliance, fullMark: 100 },
    ];
  };

  return (
    <div className="w-full font-sans text-slate-800 bg-[#F4F7F9] min-h-screen">
      {/* Back Button & Header */}
      <div className="mb-6 flex items-center space-x-4 p-8 pb-0 bg-white border-b border-slate-200 shadow-sm relative z-10">
        <button
          onClick={() => setActiveView("vendorPortfolio")}
          className="p-2 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition shadow-sm mb-6"
        >
          <ArrowLeft size={20} className="text-slate-600" strokeWidth={2} />
        </button>
        <div className="flex-1 mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {vendor.name}
            </h1>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-semibold tracking-wider border border-slate-200">
              {vendor.tier}
            </span>
          </div>
          <a
            href={`https://${vendor.domain}`}
            target="_blank"
            rel="noreferrer"
            className="text-[#2563EB] hover:underline mt-1 flex items-center space-x-1 text-[13px] font-medium"
          >
            <span>{vendor.domain}</span>
            <ExternalLink size={14} />
          </a>
        </div>

        {/* Header Actions */}
        <div className="ml-auto flex space-x-3 mb-6">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded shadow-sm text-sm font-medium transition flex items-center space-x-2">
            <Mail size={16} />
            <span>Engage Vendor</span>
          </button>
          <button className="bg-[#1E293B] hover:bg-slate-800 text-white px-4 py-2 rounded shadow-sm text-sm font-medium transition flex items-center space-x-2">
            <Ticket size={16} />
            <span>Create Ticket</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="animate-spin text-[#2563EB] mb-4" size={32} />
          <p className="font-semibold">Retrieving deep-dive intelligence...</p>
        </div>
      ) : (
        <>
          {/* Data Grid: Radar & Trend */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6 px-8 pt-8">
            {/* Score & Radar Widget */}
            <div className="xl:col-span-1 bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col h-[380px]">
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 tracking-wide">
                    Vendor Risk Dimensions
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Live assessment breakdown
                  </p>
                </div>
                <div
                  className={`text-4xl font-black ${
                    vendor.score < 50
                      ? "text-rose-600"
                      : vendor.score < 75
                      ? "text-amber-500"
                      : "text-emerald-600"
                  }`}
                >
                  {vendor.score}
                </div>
              </div>

              <div className="flex-1 min-h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    data={getDynamicRadarData()}
                  >
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#475569", fontSize: 11, fontWeight: 600 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Rating"
                      dataKey="A"
                      stroke="#2563EB"
                      strokeWidth={2}
                      fill="#3B82F6"
                      fillOpacity={0.2}
                    />
                    <Tooltip
                      cursor={false}
                      contentStyle={{ borderRadius: "6px", fontSize: "12px" }}
                      itemStyle={{ color: "#0f172a", fontWeight: 700 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trendline Widget */}
            <div className="xl:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col h-[380px]">
              <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-sm font-bold text-slate-800 tracking-wide">
                  12-Month Security Posture Trend
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Historical score variation (Mocked)
                </p>
              </div>
              <div className="flex-1 min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={vendorDetailData.historicalTrend}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e2e8f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      domain={[0, 100]}
                      stroke="#94a3b8"
                      tick={{ fill: "#475569", fontSize: 11, fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{
                        stroke: "#cbd5e1",
                        strokeWidth: 1,
                        strokeDasharray: "5 5",
                      }}
                      contentStyle={{ borderRadius: "6px", fontSize: "12px" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#2563EB"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#ffffff",
                        strokeWidth: 2,
                        stroke: "#2563EB",
                      }}
                      activeDot={{
                        r: 6,
                        fill: "#2563EB",
                        stroke: "#ffffff",
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Mitigation Playbook (NEW WIDGET) */}
          <div className="bg-slate-900 rounded-lg shadow-lg border border-slate-800 p-6 mx-8 mb-6 relative overflow-hidden">
            <Bot
              size={120}
              className="absolute right-[-20px] bottom-[-20px] text-slate-800 opacity-30"
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                <div className="bg-blue-600/20 p-2 rounded-lg">
                  <Bot className="text-blue-400" size={20} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    AI Mitigation Playbook
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Local Qwen2.5-Coder Analysis
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                {details?.mitigation_playbook &&
                Array.isArray(details.mitigation_playbook) ? (
                  details.mitigation_playbook.map(
                    (step: string, idx: number) => (
                      <li key={idx} className="flex gap-4 items-start">
                        <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-black shrink-0 text-xs mt-0.5 shadow-md shadow-blue-900/50">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-slate-300 font-medium leading-relaxed">
                          {step}
                        </p>
                      </li>
                    )
                  )
                ) : (
                  <li className="text-sm text-slate-400 italic flex items-center gap-2">
                    <Info size={16} /> No critical mitigations required based on
                    current intel.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Live Findings Ledger Table */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mx-8 mb-8">
            <div className="p-4 border-b border-slate-200 bg-white">
              <h2 className="text-sm font-bold text-slate-800 tracking-wide">
                Live Active Defect Register
              </h2>
            </div>
            <div className="overflow-x-auto p-4 bg-slate-50/30">
              <table className="w-full text-left border-collapse min-w-[700px] text-[13px]">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-200">
                    <th className="pb-3 px-2 font-semibold">Severity</th>
                    <th className="pb-3 px-2 font-semibold">Division</th>
                    <th className="pb-3 px-2 font-semibold">Description</th>
                    <th className="pb-3 px-2 font-semibold">Age</th>
                    <th className="pb-3 px-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {liveFindings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-8 text-center text-slate-500 font-medium"
                      >
                        No critical defects detected during the last scan.
                      </td>
                    </tr>
                  ) : (
                    liveFindings.map((finding) => (
                      <tr
                        key={finding.id}
                        className="hover:bg-blue-50/50 transition cursor-pointer"
                      >
                        <td className="py-3 px-2">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center w-fit space-x-1.5 ${
                              finding.severity === "Critical"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : finding.severity === "High"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {finding.severity === "Critical" && (
                              <ShieldAlert size={12} />
                            )}
                            {finding.severity === "High" && <Clock size={12} />}
                            {finding.severity === "Medium" && (
                              <CheckCircle size={12} />
                            )}
                            <span>{finding.severity}</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 font-semibold text-slate-700">
                          {finding.category}
                        </td>
                        <td className="py-3 px-2 text-slate-600">
                          <div className="font-bold text-slate-800">
                            {finding.title}
                          </div>
                          <div className="text-xs mt-0.5 max-w-md truncate">
                            {finding.description}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-slate-500 font-medium">
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border border-blue-100">
                            {finding.age}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="font-bold text-[#1E293B]">
                            {finding.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
