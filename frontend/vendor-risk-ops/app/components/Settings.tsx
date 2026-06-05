/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Sliders,
  BellRing,
  Save,
  RefreshCcw,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { riskConfig } from "../dummyData";

export default function Settings() {
  // 1. Manage both Weights AND Thresholds in state
  const [weights, setWeights] = useState(riskConfig.weights);
  const [criticalThreshold, setCriticalThreshold] = useState(
    riskConfig.thresholds.critical
  );
  const [warningThreshold, setWarningThreshold] = useState(
    riskConfig.thresholds.warning
  );

  const handleSliderChange = (id: string, newValue: number) => {
    setWeights((prevWeights) =>
      prevWeights.map((w) => (w.id === id ? { ...w, value: newValue } : w))
    );
  };

  // 2. Updated Reset function to clear everything back to defaults
  const handleReset = () => {
    setWeights(riskConfig.weights);
    setCriticalThreshold(riskConfig.thresholds.critical);
    setWarningThreshold(riskConfig.thresholds.warning);
  };

  const totalWeight = weights.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full font-sans text-slate-800 bg-[#F4F7F9] min-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System Settings
          </h1>
          <p className="text-sm text-slate-500 font-medium tracking-wide mt-1">
            Configure the global risk scoring engine and notification logic.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded shadow-sm text-sm font-medium transition flex items-center space-x-2"
          >
            <RefreshCcw size={16} />
            <span>Reset Defaults</span>
          </button>
          <button className="bg-[#1E293B] hover:bg-slate-800 text-white px-5 py-2 rounded shadow-sm text-sm font-medium transition flex items-center space-x-2">
            <Save size={16} />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Left: Risk Weighting Engine */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Sliders size={18} className="text-[#2563EB]" />
                <h2 className="text-sm font-bold tracking-wide">
                  Risk Weighting Engine
                </h2>
              </div>

              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold border ${totalWeight === 100
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
              >
                {totalWeight !== 100 && <AlertTriangle size={14} />}
                Total Weight: {totalWeight}%
              </div>
            </div>

            <div className="space-y-8 p-2">
              {weights.map((weight) => (
                <div key={weight.id} className="group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-1">
                      <label className="text-[13px] font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                        {weight.label}
                      </label>
                      <p className="text-[11px] text-slate-500 font-medium max-w-md">
                        {weight.description}
                      </p>
                    </div>
                    <div className="text-right bg-slate-50 border border-slate-200 px-3 py-1 rounded-md">
                      <span className="text-[13px] font-bold text-slate-900">
                        {weight.value}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 ml-0.5">
                        %
                      </span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weight.value}
                    onChange={(e) =>
                      handleSliderChange(weight.id, parseInt(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB] outline-none hover:bg-slate-300 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Alert Thresholds */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-800 tracking-wide mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <BellRing size={16} className="text-amber-500" /> Alert Thresholds
            </h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Critical Alert Trigger
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={criticalThreshold}
                      onChange={(e) =>
                        setCriticalThreshold(parseInt(e.target.value) || 0)
                      }
                      className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-[13px] font-bold text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-2 rounded border border-slate-200">Pts</span>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Warning Alert Trigger
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={warningThreshold}
                      onChange={(e) =>
                        setWarningThreshold(parseInt(e.target.value) || 0)
                      }
                      className="w-full bg-white border border-slate-300 rounded-md p-2.5 text-[13px] font-bold text-slate-900 outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-2 rounded border border-slate-200">Pts</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-6 text-white shadow-lg relative overflow-hidden">
            <ShieldCheck size={80} className="absolute right-[-10px] bottom-[-10px] text-slate-800 opacity-50" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                CVM Core Engine
              </h3>
              <p className="text-slate-300 text-xs font-medium leading-relaxed">
                Score recalculation is performed in real-time. Thresholds
                determine when system-wide alerts are triggered for analysts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
