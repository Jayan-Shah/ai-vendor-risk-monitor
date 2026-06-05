/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  ShieldAlert,
  MoreHorizontal,
  Loader2,
} from "lucide-react";

export default function AlertsTriage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/alerts");
        if (res.ok) {
          const data = await res.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const openAlerts = alerts.filter((a) => a.status === "Open");
  const investigatingAlerts = alerts.filter(
    (a) => a.status === "Investigating"
  );
  const resolvedAlerts = alerts.filter((a) => a.status === "Resolved");

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "High":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Medium":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const AlertCard = ({ alert }: { alert: any }) => (
    <div className="bg-white border text-left border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-[#2563EB] transition cursor-pointer group mb-3 last:mb-0">
      <div className="flex justify-between items-start mb-2">
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${getSeverityStyle(
            alert.severity
          )}`}
        >
          {alert.severity}
        </span>
        <button className="text-slate-400 hover:text-[#2563EB] opacity-0 group-hover:opacity-100 transition">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <h3 className="font-bold text-slate-900 text-[13px] mb-1 leading-snug">
        {alert.title}
      </h3>
      <p className="text-xs text-slate-600 font-medium mb-4">{alert.vendor}</p>
      <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1">
        <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
          {alert.id}
        </span>
        <div className="flex items-center text-[11px] font-medium text-slate-500 space-x-1">
          <Clock size={12} className="text-slate-400" />
          <span>{alert.time}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full font-sans text-slate-800 bg-[#F4F7F9] min-h-[calc(100vh-80px)] flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Alerts & Triage
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-wide mt-1">
            Manage and remediate active vendor vulnerabilities.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 text-slate-500">
          <Loader2 className="animate-spin text-[#2563EB] mb-4" size={32} />
          <p className="font-semibold">
            Retrieving active threat intelligence...
          </p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden pb-6">
          {/* Open Alerts Column */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-180px)] overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center space-x-2">
                <ShieldAlert size={18} className="text-rose-600" />
                <h2 className="font-bold text-slate-800 text-sm tracking-wide">
                  Open Alerts
                </h2>
              </div>
              <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                {openAlerts.length}
              </span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto bg-slate-50/50">
              {openAlerts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                  No open alerts
                </div>
              ) : (
                openAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </div>

          {/* Investigating Column */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-180px)] overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center space-x-2">
                <AlertCircle size={18} className="text-amber-500" />
                <h2 className="font-bold text-slate-800 text-sm tracking-wide">
                  Investigating
                </h2>
              </div>
              <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                {investigatingAlerts.length}
              </span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto bg-slate-50/50">
              {investigatingAlerts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                  Empty queue
                </div>
              ) : (
                investigatingAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </div>

          {/* Resolved Column */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col h-[calc(100vh-180px)] overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center space-x-2">
                <CheckCircle size={18} className="text-emerald-500" />
                <h2 className="font-bold text-slate-800 text-sm tracking-wide">
                  Resolved (30d)
                </h2>
              </div>
              <span className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                {resolvedAlerts.length}
              </span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto bg-slate-50/50">
              {resolvedAlerts.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-medium">
                  No resolved items
                </div>
              ) : (
                resolvedAlerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
