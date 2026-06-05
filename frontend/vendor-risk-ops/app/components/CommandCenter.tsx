"use client";
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Loader2 } from "lucide-react";

export default function CommandCenter({
  currentTheme,
  handleVendorClick,
  setActiveView,
}: {
  currentTheme: string;
  handleVendorClick: (v: any) => void;
  setActiveView: (v: string) => void;
}) {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Live KPI Data
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/dashboard/kpis");
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard KPIs:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  // Safe fallbacks while loading
  const kpis = dashboardData || {
    globalScore: 0,
    totalVendors: 0,
    criticalAlerts: 0,
    topOffenders: [],
  };

  // Dummy data for Risk Trend (Historical)
  const riskTrendData = [
    { month: "Jan", score: 65, avg: 50 },
    { month: "Feb", score: 68, avg: 51 },
    { month: "Mar", score: 62, avg: 52 },
    { month: "Apr", score: 71, avg: 54 },
    { month: "May", score: 75, avg: 55 },
    { month: "Jun", score: kpis.globalScore, avg: 56 },
  ];

  const gaugeData = [
    { name: "Pass", value: kpis.globalScore },
    { name: "Fail", value: 100 - kpis.globalScore },
  ];
  const GAUGE_COLORS = ["#3b5998", "#d1d5db"];

  // Vendor comparison mock data for BarChart
  const vendorComparisonData = [
    { name: "US-East Node", quantity: 69, cost: 43 },
    { name: "EU-West Node", quantity: 60, cost: 39 },
    { name: "AP-South Node", quantity: 55, cost: 40 },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-slate-500">
        <Loader2 className="animate-spin text-[#2563EB] mb-4" size={32} />
        <p className="font-semibold tracking-wide">
          Aggregating global telemetry...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300 font-sans text-slate-800">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Global Command Center
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          Continuous Vendor Threat Exposure / Risk Dashboard
        </p>
      </div>

      {/* TOP KPI CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-center shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2 mt-1">
            Total Monitored Vendors
          </p>
          <div className="text-3xl font-black text-[#1E293B]">
            {kpis.totalVendors}
          </div>
          <div className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex justify-between font-medium">
            <span
              className={
                kpis.criticalAlerts > 0 ? "text-rose-600 font-bold" : ""
              }
            >
              Critical open: {kpis.criticalAlerts}
            </span>
            <span>Active Sync</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-center shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2 mt-1">
            Global Security Score
          </p>
          <div
            className={`text-3xl font-black ${
              kpis.globalScore < 70 ? "text-rose-600" : "text-[#1E293B]"
            }`}
          >
            {kpis.globalScore}
          </div>
          <div className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex justify-between font-medium">
            <span>Target Score: &gt; 80</span>
            {kpis.globalScore < 80 && (
              <span className="text-rose-600 font-bold">Underperforming</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-center shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2 mt-1">
            Avg Risk Velocity
          </p>
          <div className="text-3xl font-black text-[#1E293B]">Live</div>
          <div className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex justify-between font-medium">
            <span>Cron Interval: 10m</span>
            <span className="text-emerald-600 font-bold">Optimized</span>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-center shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2 mt-1">
            Global Threat Exposure
          </p>
          <div className="text-3xl font-black text-[#1E293B]">3.42%</div>
          <div className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex justify-between font-medium">
            <span>Critical - {kpis.criticalAlerts}</span>
            <span>Resolved - 0</span>
          </div>
        </div>
      </div>

      {/* SECOND ROW: DONUT & RANKINGS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col relative h-[300px] shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide mb-1 text-center">
            Score Composition
          </h2>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="85%"
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={kpis.globalScore < 70 ? "#ef4444" : "#2563EB"} />
                  <Cell fill="#E2E8F0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-black text-slate-800">
              {kpis.globalScore}
            </div>
          </div>
          <div className="flex justify-center gap-4 text-xs font-semibold text-slate-500 mt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E2E8F0]"></span> Fail
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  kpis.globalScore < 70 ? "bg-rose-500" : "bg-[#2563EB]"
                }`}
              ></span>{" "}
              Pass
            </span>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white rounded-lg border border-slate-200 p-5 flex flex-col h-[300px] shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide mb-4">
            Risk Surface Area vs Financial Impact
          </h2>
          <div className="flex-1 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vendorComparisonData}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  dy={5}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip cursor={{ fill: "#f8fafc" }} />
                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: 12,
                    paddingTop: 10,
                    fontWeight: 500,
                    color: "#475569",
                  }}
                />
                <Bar
                  dataKey="quantity"
                  name="Risk Vectors"
                  fill="#2563EB"
                  radius={[2, 2, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="cost"
                  name="Impact Severity"
                  fill="#93C5FD"
                  radius={[2, 2, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* THIRD ROW: TABLES / TRENDS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 pb-8">
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center text-slate-800">
            <h2 className="text-sm font-bold tracking-wide">
              Top Target Suppliers (Highest Risk)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100 bg-slate-50/50">
                  <th className="pb-3 pt-3 px-4 font-semibold">Supplier</th>
                  <th className="pb-3 pt-3 px-2 font-semibold">Domain</th>
                  <th className="pb-3 pt-3 px-4 font-bold text-[#1E293B] text-right">
                    Risk Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {kpis.topOffenders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-slate-500 font-medium"
                    >
                      No vendor data available.
                    </td>
                  </tr>
                ) : (
                  kpis.topOffenders.map((vendor: any) => (
                    <tr
                      key={vendor.id}
                      onClick={() => handleVendorClick(vendor)}
                      className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-slate-800">
                        {vendor.name}
                      </td>
                      <td className="py-3 px-2 text-slate-500 font-medium">
                        {vendor.domain}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-black px-2 py-1 rounded ${
                            vendor.score < 50
                              ? "bg-rose-50 text-rose-700"
                              : vendor.score < 75
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {vendor.score}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col shadow-sm">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide mb-4">
            Historical Risk Posture vs Industry Average
          </h2>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={riskTrendData}
                margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  dy={5}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip />
                <Legend
                  iconType="plainline"
                  wrapperStyle={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#475569",
                  }}
                />
                <Line
                  type="monotone"
                  name="Your Portfolio"
                  dataKey="score"
                  stroke="#2563EB"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#2563EB" }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  name="Industry Avg"
                  dataKey="avg"
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
