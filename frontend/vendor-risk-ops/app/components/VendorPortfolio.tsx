/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import CyberReportCard from "./CyberReportCard";
import {
  Search,
  Filter,
  Download,
  X,
  Play,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  XCircle,
  Activity,
  GripVertical,
  Trash2,
  ListOrdered,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function VendorPortfolio({
  handleVendorClick,
  setActiveView,
}: {
  handleVendorClick: (v: any) => void;
  setActiveView: (v: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("All Tiers");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const [vendors, setVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- REPORT VIEWING STATE ---
  const [viewingReport, setViewingReport] = useState<any>(null);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/vendors");
      if (res.ok) {
        const data = await res.json();
        setVendors(data);
      }
    } catch (error) {
      console.error("Network error fetching vendors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // --- ADD VENDOR STATE (Gatekeeper Only) ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newVendorName, setNewVendorName] = useState("");
  const [isGatekeeperLoading, setIsGatekeeperLoading] = useState(false);
  const [gatekeeperReport, setGatekeeperReport] = useState<any>(null);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // --- ANALYZE VENDOR QUEUE STATE (Deep Scan) ---
  const [showAnalyzeModal, setShowAnalyzeModal] = useState(false);
  const [vendorToAdd, setVendorToAdd] = useState("");
  const [analysisQueue, setAnalysisQueue] = useState<any[]>([]);
  const [isQueueRunning, setIsQueueRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const isModalOpenRef = useRef(false);

  // Drag and Drop Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // ==========================================
  // FLOW 1: ADD VENDOR (Gatekeeper -> DB Save)
  // ==========================================
  const handleRunGatekeeper = async () => {
    if (!newDomain || !newVendorName) return;
    setIsGatekeeperLoading(true);
    setGatekeeperReport(null);
    setDetailsExpanded(false);

    try {
      const res = await fetch("http://localhost:8000/api/vendors/gatekeeper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: newDomain.trim(),
          vendor_name: newVendorName,
        }),
      });
      const data = await res.json();
      setGatekeeperReport(data);
    } catch (error) {
      console.error("Gatekeeper failed", error);
    }
    setIsGatekeeperLoading(false);
  };

  const handleApproveAndAdd = async () => {
    setIsAdding(true);
    try {
      const res = await fetch("http://localhost:8000/api/vendors/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: newDomain.trim(),
          vendor_name: newVendorName,
        }),
      });

      if (res.ok) {
        fetchVendors();
        closeAddModal();
      }
    } catch (error) {
      console.error(error);
    }
    setIsAdding(false);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setGatekeeperReport(null);
    setDetailsExpanded(false);
    setIsAdding(false);
    setNewDomain("");
    setNewVendorName("");
  };

  // ==========================================
  // FLOW 2: BATCH QUEUE ANALYZER (Deep Scan)
  // ==========================================

  const handleAddToQueue = () => {
    if (!vendorToAdd) return;
    const selectedVendorData = vendors.find((v) => v.domain === vendorToAdd);
    if (!selectedVendorData) return;

    if (analysisQueue.find((q) => q.domain === selectedVendorData.domain))
      return;

    setAnalysisQueue((prev) => [
      ...prev,
      { ...selectedVendorData, status: "pending" },
    ]);
    setVendorToAdd("");
  };

  const removeFromQueue = (index: number) => {
    setAnalysisQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const _queue = [...analysisQueue];
    const draggedItemContent = _queue.splice(dragItem.current, 1)[0];
    _queue.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setAnalysisQueue(_queue);
  };

  const processNextInQueue = async (queue: any[], currentIndex: number) => {
    if (!isModalOpenRef.current) return;

    if (currentIndex >= queue.length) {
      setIsQueueRunning(false);
      setLogs((prev) => [
        ...prev,
        "\n[SYSTEM] 🏁 All queued analysis jobs completed successfully.",
      ]);
      return;
    }

    const item = queue[currentIndex];
    setAnalysisQueue((prev) =>
      prev.map((q, i) =>
        i === currentIndex ? { ...q, status: "scanning" } : q
      )
    );
    setLogs([
      `[SYSTEM] Triggering Deep Analysis for ${item.name} (${item.domain})...`,
    ]);

    try {
      const res = await fetch(
        `http://localhost:8000/api/vendors/scan?domain=${item.domain}&vendor_name=${item.name}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (data.status === "queued") {
        const ws = new WebSocket(`ws://localhost:8000/ws/recon/${data.ws_id}`);
        wsRef.current = ws;

        ws.onmessage = (event) => {
          const payload = JSON.parse(event.data);
          if (payload.type === "log") {
            setLogs((prev) => [...prev, payload.message]);
          } else if (payload.type === "result") {
            setLogs((prev) => [
              ...prev,
              `[SYSTEM] Deep Analysis Complete. Calculated Score: ${
                payload.data.risk_score || 0
              }`,
            ]);
            setAnalysisQueue((prev) =>
              prev.map((q, i) =>
                i === currentIndex
                  ? { ...q, status: "complete", ...payload.data }
                  : q
              )
            );
            fetchVendors();
            ws.close();
          } else if (payload.type === "error") {
            setLogs((prev) => [...prev, `[ERROR] ${payload.message}`]);
            setAnalysisQueue((prev) =>
              prev.map((q, i) =>
                i === currentIndex ? { ...q, status: "error" } : q
              )
            );
            ws.close();
          }
        };

        ws.onclose = () => {
          setTimeout(() => processNextInQueue(queue, currentIndex + 1), 1500);
        };
      } else {
        setLogs((prev) => [
          ...prev,
          `[ERROR] Failed to queue ${item.name}. Skipping...`,
        ]);
        setAnalysisQueue((prev) =>
          prev.map((q, i) =>
            i === currentIndex ? { ...q, status: "error" } : q
          )
        );
        processNextInQueue(queue, currentIndex + 1);
      }
    } catch (error) {
      setLogs((prev) => [
        ...prev,
        `[ERROR] Connection lost for ${item.name}. Skipping...`,
      ]);
      setAnalysisQueue((prev) =>
        prev.map((q, i) => (i === currentIndex ? { ...q, status: "error" } : q))
      );
      processNextInQueue(queue, currentIndex + 1);
    }
  };

  const startQueue = () => {
    if (analysisQueue.length === 0) return;
    setIsQueueRunning(true);
    isModalOpenRef.current = true;
    processNextInQueue(analysisQueue, 0);
  };

  const openAnalyzeModal = () => {
    isModalOpenRef.current = true;
    setShowAnalyzeModal(true);
  };

  const closeAnalyzeModal = () => {
    isModalOpenRef.current = false;
    if (wsRef.current) wsRef.current.close();
    setShowAnalyzeModal(false);
    setIsQueueRunning(false);
    setAnalysisQueue([]);
    setVendorToAdd("");
    setLogs([]);
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier =
      tierFilter === "All Tiers" || vendor.tier === tierFilter;
    const matchesCategory =
      categoryFilter === "All Categories" || vendor.category === categoryFilter;
    return matchesSearch && matchesTier && matchesCategory;
  });

  return (
    <div className="w-full font-sans text-slate-800 bg-[#F4F7F9] min-h-screen relative">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Vendor Portfolio
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-wide mt-1">
            Supplier lists, risk data, and tier filtering
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded shadow-sm text-sm font-medium transition flex items-center space-x-2">
            <Download size={16} />
            <span>Export CSV</span>
          </button>

          <button
            onClick={openAnalyzeModal}
            className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2 rounded shadow-sm text-sm font-medium transition flex items-center gap-2"
          >
            <Activity size={16} /> Analyze Vendors
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2 rounded shadow-sm text-sm font-medium transition"
          >
            + Add Vendor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center w-80 bg-white border border-slate-300 rounded-md px-3 py-2 focus-within:border-[#2563EB] focus-within:ring-1 focus-within:ring-[#2563EB] transition-all">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by supplier name..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-slate-500" />
            <select
              className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md px-3 py-2 outline-none cursor-pointer focus:border-[#2563EB]"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
            >
              <option value="All Tiers">All Tiers</option>
              <option value="Tier 1">Tier 1</option>
              <option value="Tier 2">Tier 2</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm max-h-[600px] overflow-y-auto">
        <table className="w-full text-left border-collapse min-w-[950px] text-[13px]">
          <thead className="sticky top-0 bg-white z-20 border-b border-slate-200">
            <tr className="text-slate-500">
              <th className="p-4 w-12 font-semibold bg-slate-50/50">
                <input type="checkbox" className="rounded border-slate-300" />
              </th>
              <th className="p-4 font-semibold bg-slate-50/50">Vendor Name</th>
              <th className="p-4 font-semibold bg-slate-50/50">Tier</th>
              <th className="p-4 font-semibold text-center bg-slate-50/50">
                Score
              </th>
              <th className="p-4 font-semibold text-center w-32 bg-slate-50/50">
                Velocity
              </th>
              <th className="p-4 font-semibold text-center bg-slate-50/50">
                Issues
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-slate-500">
                  <Loader2
                    className="animate-spin text-[#2563EB] mx-auto mb-3"
                    size={24}
                  />{" "}
                  Fetching live intelligence...
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor, vIndex) => {
                const sparklineData = Array.from({ length: 6 }).map((_, i) => ({
                  score:
                    (vendor.score || 100) + (((vIndex * i * 37) % 20) - 10),
                }));
                const trendColor =
                  (vendor.score || 100) > 70 ? "#3b5998" : "#ef4444";
                return (
                  <tr
                    key={vendor.id}
                    onClick={() => handleVendorClick(vendor)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded border-slate-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">
                        {vendor.name}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 mt-1">
                        {vendor.domain}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {vendor.tier}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {vendor.score ? (
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div
                            className={`font-bold p-1.5 rounded inline-block ${
                              vendor.score < 50
                                ? "bg-rose-50 text-rose-700"
                                : vendor.score < 75
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {vendor.score} / 100
                          </div>
                          {(vendor.recon_results ||
                            vendor.cyber_data ||
                            vendor.scan_results ||
                            vendor.data) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setViewingReport(vendor);
                              }}
                              className="text-[10px] font-bold text-[#2563EB] hover:text-blue-800 hover:underline uppercase tracking-wider"
                            >
                              View Report
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="font-bold p-1.5 rounded inline-block bg-slate-100 text-slate-500 border border-slate-200">
                          Pending Analysis
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center w-32 h-10">
                      {vendor.score && (
                        <ResponsiveContainer width="100%" height={20}>
                          <LineChart data={sparklineData}>
                            <Line
                              type="monotone"
                              dataKey="score"
                              stroke={trendColor}
                              strokeWidth={2.5}
                              dot={false}
                              isAnimationActive={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {vendor.issues > 0 ? (
                        <span className="inline-flex items-center justify-center h-6 px-2 rounded-md text-rose-700 bg-rose-50 border border-rose-200 text-[11px] font-bold gap-1">
                          <AlertTriangle size={10} /> {vendor.issues} Issues
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-[600px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <ShieldCheck className="text-[#2563EB]" size={20} /> New Vendor
                Onboarding
              </h2>
              <button
                onClick={closeAddModal}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1 max-h-[75vh] overflow-y-auto">
              {!gatekeeperReport && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Company Name
                    </label>
                    <input
                      className="w-full bg-white border border-slate-300 rounded p-2.5 text-sm font-bold text-slate-900 outline-none focus:border-[#2563EB]"
                      placeholder="e.g. Acme Corp"
                      value={newVendorName}
                      onChange={(e) => setNewVendorName(e.target.value)}
                      disabled={isGatekeeperLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Target Domain
                    </label>
                    <input
                      className="w-full bg-white border border-slate-300 rounded p-2.5 text-sm font-bold text-slate-900 outline-none focus:border-[#2563EB]"
                      placeholder="e.g. acme.com"
                      value={newDomain}
                      onChange={(e) => setNewDomain(e.target.value)}
                      disabled={isGatekeeperLoading}
                    />
                  </div>
                  <button
                    onClick={handleRunGatekeeper}
                    disabled={
                      !newDomain || !newVendorName || isGatekeeperLoading
                    }
                    className="w-full flex items-center justify-center gap-2 bg-[#1E293B] hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold py-3 rounded-md transition mt-4"
                  >
                    {isGatekeeperLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Search size={16} />
                    )}
                    {isGatekeeperLoading
                      ? "Running Gatekeeper Checks..."
                      : "Run Pre-Onboarding Checks"}
                  </button>
                </div>
              )}

              {gatekeeperReport && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <div
                    className={`border rounded-lg p-5 flex items-start gap-4 ${
                      gatekeeperReport.status === "warning"
                        ? "bg-rose-50 border-rose-200"
                        : "bg-emerald-50 border-emerald-200"
                    }`}
                  >
                    {gatekeeperReport.status === "warning" ? (
                      <AlertTriangle
                        className="text-rose-600 shrink-0 mt-1"
                        size={28}
                      />
                    ) : (
                      <CheckCircle2
                        className="text-emerald-600 shrink-0 mt-1"
                        size={28}
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3
                          className={`text-lg font-black ${
                            gatekeeperReport.status === "warning"
                              ? "text-rose-900"
                              : "text-emerald-900"
                          }`}
                        >
                          Base Score: {gatekeeperReport.score}/100
                        </h3>
                      </div>
                      <p
                        className={`text-sm font-medium leading-relaxed ${
                          gatekeeperReport.status === "warning"
                            ? "text-rose-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {gatekeeperReport.status === "warning"
                          ? "This vendor exhibits security vulnerabilities. Onboarding them will inject risk into your portfolio."
                          : "This vendor passed fundamental security hygiene checks. They are safe to onboard."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => setDetailsExpanded(!detailsExpanded)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition text-sm font-bold text-slate-700"
                    >
                      <span>View Detailed Checks</span>
                      {detailsExpanded ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                    {detailsExpanded && (
                      <div className="p-0 border-t border-slate-200">
                        <ul className="divide-y divide-slate-100">
                          {gatekeeperReport.detailed_checks?.map(
                            (check: any, idx: number) => (
                              <li
                                key={idx}
                                className="p-4 flex items-start gap-3 hover:bg-slate-50 transition"
                              >
                                {check.status === "Pass" ? (
                                  <CheckCircle2
                                    size={18}
                                    className="text-emerald-500 mt-0.5"
                                  />
                                ) : (
                                  <XCircle
                                    size={18}
                                    className="text-rose-500 mt-0.5"
                                  />
                                )}
                                <div>
                                  <p className="text-sm font-bold text-slate-800">
                                    {check.aspect}
                                  </p>
                                  <p className="text-xs font-medium text-slate-500 mt-0.5">
                                    {check.detail}
                                  </p>
                                </div>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={closeAddModal}
                      disabled={isAdding}
                      className="flex-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 font-bold py-3 rounded transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApproveAndAdd}
                      disabled={isAdding}
                      className={`flex-1 flex justify-center items-center gap-2 text-white font-bold py-3 rounded transition disabled:opacity-80 ${
                        gatekeeperReport.status === "warning"
                          ? "bg-rose-600 hover:bg-rose-700"
                          : "bg-emerald-600 hover:bg-emerald-700"
                      }`}
                    >
                      {isAdding ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />{" "}
                          Saving...
                        </>
                      ) : gatekeeperReport.status === "warning" ? (
                        "Override & Add Vendor"
                      ) : (
                        "Approve & Add Vendor"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAnalyzeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-[650px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <ListOrdered className="text-[#2563EB]" size={20} /> Deep
                Analysis Queue
              </h2>
              <button
                onClick={closeAnalyzeModal}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col max-h-[80vh] overflow-y-auto">
              <div className="flex gap-3 mb-6">
                <select
                  className="flex-1 bg-white border border-slate-300 rounded p-2.5 text-sm font-bold text-slate-900 outline-none focus:border-[#2563EB] cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                  value={vendorToAdd}
                  onChange={(e) => setVendorToAdd(e.target.value)}
                  disabled={isQueueRunning}
                >
                  <option value="" disabled>
                    -- Select Vendor to Queue --
                  </option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.domain}>
                      {v.name} ({v.domain})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddToQueue}
                  disabled={!vendorToAdd || isQueueRunning}
                  className="bg-[#1E293B] hover:bg-slate-800 disabled:bg-slate-300 text-white font-bold px-6 rounded-md transition whitespace-nowrap"
                >
                  Add to Queue
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden mb-6 flex-1 min-h-[150px]">
                {analysisQueue.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400">
                    <ListOrdered size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">
                      Your scan queue is empty.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-200">
                    {analysisQueue.map((item, index) => (
                      <li
                        key={item.domain}
                        draggable={!isQueueRunning}
                        onDragStart={() => (dragItem.current = index)}
                        onDragEnter={() => (dragOverItem.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => e.preventDefault()}
                        className={`flex items-center gap-3 p-3 bg-white transition ${
                          isQueueRunning
                            ? "opacity-80"
                            : "cursor-move hover:bg-slate-100"
                        }`}
                      >
                        <GripVertical
                          size={16}
                          className={`text-slate-400 ${
                            isQueueRunning ? "invisible" : ""
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">
                            {item.name}
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {item.domain}
                          </p>
                        </div>

                        <div className="flex items-center w-auto justify-end">
                          {item.status === "pending" && (
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Pending
                            </span>
                          )}
                          {item.status === "scanning" && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-[#2563EB] uppercase tracking-wider">
                              <Loader2 size={14} className="animate-spin" />{" "}
                              Scanning
                            </span>
                          )}
                          {item.status === "complete" && (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                                <CheckCircle2 size={14} /> Done
                              </span>

                              <button
                                onClick={() => {
                                  const freshVendor = vendors.find(
                                    (v) => v.domain === item.domain
                                  );
                                  setViewingReport(freshVendor || item);
                                }}
                                className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded hover:bg-emerald-200 transition uppercase"
                              >
                                Report
                              </button>
                            </div>
                          )}
                          {item.status === "error" && (
                            <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider">
                              <XCircle size={14} /> Failed
                            </span>
                          )}
                        </div>

                        {!isQueueRunning && (
                          <button
                            onClick={() => removeFromQueue(index)}
                            className="text-slate-300 hover:text-rose-500 transition p-1 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button
                onClick={startQueue}
                disabled={analysisQueue.length === 0 || isQueueRunning}
                className="w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-md transition mb-6"
              >
                {isQueueRunning ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Play size={18} fill="white" />
                )}
                {isQueueRunning
                  ? "Processing Batch Queue..."
                  : "Start Queue Processing"}
              </button>

              {(isQueueRunning || logs.length > 0) && (
                <div className="bg-[#1E293B] rounded-lg p-5 font-mono text-xs text-green-400 h-[220px] overflow-y-auto shadow-inner relative animate-in fade-in slide-in-from-bottom-4">
                  <div className="absolute top-2 right-2 flex gap-2">
                    {isQueueRunning && (
                      <Loader2
                        size={16}
                        className="animate-spin text-slate-400"
                      />
                    )}
                    {!isQueueRunning && logs.length > 0 && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                  </div>
                  {logs.map((log, i) => (
                    <div key={i} className="mb-1.5 break-words">
                      <span className="text-slate-500">
                        [{new Date().toLocaleTimeString()}]
                      </span>{" "}
                      {log}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: FULL CYBER REPORT VIEW (Printable Overlay)         */}
      {/* ========================================================= */}
      {viewingReport && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[100] flex justify-center overflow-y-auto p-4 print:p-0 print:bg-white print:block">
          <div className="relative w-full max-w-5xl my-10 print:my-0">
            <button
              onClick={() => setViewingReport(null)}
              className="absolute -top-12 right-0 text-white hover:text-rose-400 flex items-center gap-2 font-bold print:hidden transition"
            >
              <X size={24} /> Close Report
            </button>

            <CyberReportCard vendor={viewingReport} />
          </div>
        </div>
      )}
    </div>
  );
}
