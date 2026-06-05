"use client";
import React from "react";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Shield,
  ClipboardList,
  Settings as SettingsIcon,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (v: string) => void;
  isSidebarOpen: boolean;
}

export default function Sidebar({ activeView, setActiveView, isSidebarOpen }: SidebarProps) {
  // Helper to determine if a nav item is active
  const isActive = (view: string) => activeView === view;

  // Helper for button styles to keep the JSX clean
  const getBtnStyle = (view: string) => `
    w-full flex items-center ${isSidebarOpen ? 'justify-between px-3' : 'justify-center'} py-2.5 rounded-xl text-sm transition-all duration-300 group
    ${isActive(view)
      ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400 font-bold"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100 font-medium hover:scale-[1.01]"
    }
  `;

  return (
    <aside className={`${isSidebarOpen ? 'w-[280px]' : 'w-20'} bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/50 flex flex-col transition-all duration-300 z-20`}>
      {/* Brand Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="text-white shrink-0" size={18} strokeWidth={1.5} />
          </div>
          {isSidebarOpen && (
            <span className="text-xl font-heading font-black tracking-tighter text-slate-800 dark:text-white">
              VigiLink<span className="text-cyan-500">.AI</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Scrollable Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-8 overflow-y-auto custom-scrollbar">
        {/* Monitoring Group */}
        <div className="space-y-2">
          {isSidebarOpen && (
            <p className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
              Dashboards
            </p>
          )}

          <button
            onClick={() => setActiveView("commandCenter")}
            className={getBtnStyle("commandCenter")}
          >
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
              <LayoutDashboard size={18} strokeWidth={1.5} className="shrink-0" />
              {isSidebarOpen && <span>Command Center</span>}
            </div>
            {isActive("commandCenter") && isSidebarOpen && <ChevronRight size={14} strokeWidth={1.5} />}
          </button>

          <button
            onClick={() => setActiveView("vendorPortfolio")}
            className={getBtnStyle("vendorPortfolio")}
          >
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
              <Users size={18} strokeWidth={1.5} className="shrink-0" />
              {isSidebarOpen && <span>Vendor Portfolio</span>}
            </div>
            {(isActive("vendorPortfolio") || activeView === "vendorDetail") && isSidebarOpen && (
              <ChevronRight size={14} strokeWidth={1.5} />
            )}
          </button>

          <button
            onClick={() => setActiveView("alertsTriage")}
            className={getBtnStyle("alertsTriage")}
          >
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
              <AlertTriangle size={18} strokeWidth={1.5} className="shrink-0" />
              {isSidebarOpen && <span>Alerts & Triage</span>}
            </div>
            {isActive("alertsTriage") && isSidebarOpen && <ChevronRight size={14} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Intelligence Group */}
        <div className="space-y-2">
          {isSidebarOpen && (
            <p className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">
              Reporting
            </p>
          )}

          <button
            onClick={() => setActiveView("reporting")}
            className={getBtnStyle("reporting")}
          >
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
              <Shield size={18} strokeWidth={1.5} className="shrink-0" />
              {isSidebarOpen && <span>Compliance Engine</span>}
            </div>
            {isActive("reporting") && isSidebarOpen && <ChevronRight size={14} strokeWidth={1.5} />}
          </button>

          <button
            onClick={() => setActiveView("questionnaires")}
            className={getBtnStyle("questionnaires")}
          >
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
              <ClipboardList size={18} strokeWidth={1.5} className="shrink-0" />
              {isSidebarOpen && <span>Questionnaires</span>}
            </div>
            {(isActive("questionnaires") ||
              activeView === "builder" ||
              activeView === "templateLibrary") && isSidebarOpen && <ChevronRight size={14} strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Bottom Fixed Section for Settings */}
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800/50 bg-slate-50/10 dark:bg-slate-900/10 backdrop-blur-md">
        <button
          onClick={() => setActiveView("settings")}
          className={`
            w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center'} py-3 rounded-xl font-bold text-sm transition-all duration-300 hover:scale-[1.01]
            ${isActive("settings")
              ? "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400"
              : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-100"
            }
          `}
        >
          <SettingsIcon
            size={18}
            strokeWidth={1.5}
            className={`shrink-0 ${isActive("settings") ? "animate-spin-slow" : ""}`}
          />
          {isSidebarOpen && <span>System Settings</span>}
        </button>
      </div>
    </aside>
  );
}
