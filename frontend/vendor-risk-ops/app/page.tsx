/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import CommandCenter from "./components/CommandCenter";
import VendorPortfolio from "./components/VendorPortfolio";
import VendorDetail from "./components/VendorDetail";
import AlertsTriage from "./components/AlertsTriage";
import Reporting from "./components/Reporting";
import Settings from "./components/Settings";
import Questionnaires from "./components/Questionnaires";
import TemplateLibrary from "./components/TemplateLibrary";
import QuestionnaireBuilder from "./components/QuestionnaireBuilder";
import AddVendorFlow from "./components/AddVendorFlow";
import { Shield } from "lucide-react";

// Import initial data
import { initialTemplates } from "./dummyData";

export default function Home() {
  // 1. NAVIGATION & UI STATE
  const [activeView, setActiveView] = useState("commandCenter");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [currentTheme, setCurrentTheme] = useState("dark");

  // 2. DATA STATE (Lifted for persistence)
  const [templates, setTemplates] = useState(initialTemplates);

  // 3. THEME TOGGLE LOGIC
  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setCurrentTheme(newTheme);

    // Physically toggle the 'dark' class on the root element for Tailwind
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Sync theme on initial load
  useEffect(() => {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [currentTheme]);

  // 4. HANDLERS
  const handleVendorClick = (vendor: any) => {
    setSelectedVendor(vendor);
  };

  const closeVendorDrawer = () => {
    setSelectedVendor(null);
  };

  const handleSaveNewTemplate = (newTemplate: any) => {
    setTemplates((prev) => [newTemplate, ...prev]);
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden font-sans bg-[#F4F7F9] text-slate-800">
      {/* GLOBAL HEADER - Premium BI Top Nav */}
      <header className="flex items-center justify-between px-8 pt-4 pb-0 bg-white border-b border-slate-200 shadow-sm z-10">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-[#1E293B] rounded shadow-sm flex items-center justify-center">
            <Shield size={20} className="text-white" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-slate-900 tracking-tight leading-none mb-1">
              VigiLink AI
            </span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest leading-none">
              Vendor Risk
            </span>
          </div>
        </div>

        {/* Central Navigation Tabs */}
        <nav className="flex space-x-10 items-end h-full mt-2">
          <button
            onClick={() => setActiveView("commandCenter")}
            className={`pb-3 text-sm font-medium tracking-wide transition-all ${
              activeView === "commandCenter"
                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Command Center
          </button>
          <button
            onClick={() => setActiveView("vendorPortfolio")}
            className={`pb-3 text-sm font-medium tracking-wide transition-all ${
              activeView === "vendorPortfolio" || activeView === "vendorDetail"
                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Vendor Portfolio
          </button>
          <button
            onClick={() => setActiveView("alertsTriage")}
            className={`pb-3 text-sm font-medium tracking-wide transition-all ${
              activeView === "alertsTriage"
                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Alerts & Triage
          </button>
          <button
            onClick={() => setActiveView("reporting")}
            className={`pb-3 text-sm font-medium tracking-wide transition-all ${
              activeView === "reporting"
                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Reporting
          </button>
          <button
            onClick={() => setActiveView("settings")}
            className={`pb-3 text-sm font-medium tracking-wide transition-all ${
              activeView === "settings"
                ? "text-[#2563EB] border-b-2 border-[#2563EB]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Settings
          </button>
        </nav>

        <div className="flex items-center gap-6 flex-1 justify-end pb-3">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg transition-all hover:bg-slate-100 group">
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-500"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </button>

          {/* Profile Info */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold leading-none text-slate-900">
                Jayan Shah
              </span>
              <span className="text-[10px] text-slate-600 uppercase tracking-tighter mt-1">
                Security Lead
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#1E293B] flex items-center justify-center font-bold text-white text-xs shadow-sm">
              JS
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="flex-1 overflow-y-auto px-8 py-6 relative">
        {/* Dashboard Views */}
        {activeView === "commandCenter" && (
          <CommandCenter
            currentTheme={currentTheme}
            handleVendorClick={handleVendorClick}
            setActiveView={setActiveView}
          />
        )}
        {activeView === "vendorPortfolio" && (
          <VendorPortfolio
            handleVendorClick={handleVendorClick}
            setActiveView={setActiveView}
          />
        )}
        {/* CRASH FIX: Ensure we use the 'vendor' prop name */}
        {activeView === "vendorDetail" && selectedVendor && (
          <VendorDetail
            vendor={selectedVendor}
            setActiveView={setActiveView}
            currentTheme={currentTheme}
          />
        )}
        {activeView === "alertsTriage" && <AlertsTriage />}
        {activeView === "reporting" && (
          <Reporting
            handleVendorClick={handleVendorClick} // ADD THIS PROP
          />
        )}
        {activeView === "settings" && <Settings />}
        {/* Questionnaire System */}
        {activeView === "questionnaires" && (
          <Questionnaires setActiveView={setActiveView} />
        )}
        {activeView === "templateLibrary" && (
          <TemplateLibrary
            setActiveView={setActiveView}
            templates={templates}
          />
        )}
        {activeView === "builder" && (
          <QuestionnaireBuilder
            setActiveView={setActiveView}
            onSave={handleSaveNewTemplate}
          />
        )}
        {/* Onboarding Flow */}
        {activeView === "addVendor" && (
          <AddVendorFlow setActiveView={setActiveView} />
        )}
        {/* 5. Contextual Side-Panel (Deep Dive Drawer) */}
        {/* 5. Contextual Side-Panel (Deep Dive Drawer) */}
        {selectedVendor && (
          <>
            <div
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-[1px] z-40 transition-all"
              onClick={closeVendorDrawer}
            />
            {/* FIX: Changed w-[900px] to w-2/3 max-w-[900px] so it doesn't eat the whole screen */}
            <div className="fixed top-0 right-0 h-full w-2/3 max-w-[900px] bg-[#F4F7F9] border-l border-slate-200 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 translate-x-0 overflow-y-auto">
              <VendorDetail
                vendor={selectedVendor}
                setActiveView={() => closeVendorDrawer()}
                currentTheme={currentTheme}
              />
            </div>
          </>
        )}{" "}
      </section>
    </main>
  );
}
