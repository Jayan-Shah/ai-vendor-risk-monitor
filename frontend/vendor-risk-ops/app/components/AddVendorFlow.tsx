/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  Globe,
  Shield,
  Send,
  CheckCircle2,
  ArrowRight,
  Building2,
  Lock,
  Zap,
} from "lucide-react";
import { existingTemplates } from "../dummyData";

interface AddVendorFlowProps {
  setActiveView: (v: string) => void;
}

export default function AddVendorFlow({ setActiveView }: AddVendorFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    contact: "",
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto py-10 px-4">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-12">
        <button
          onClick={() => setActiveView("vendorPortfolio")}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition text-slate-400"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Onboard New Vendor
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Initialize continuous monitoring and baseline assessments.
          </p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-16 relative px-10">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-10"></div>
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex flex-col items-center gap-3">
            <div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-300 border-4 ${
                step >= num
                  ? "bg-blue-600 border-blue-100 dark:border-blue-900/50 text-white scale-110 shadow-lg shadow-blue-600/20"
                  : "bg-white dark:bg-[#0a0a0b] border-slate-100 dark:border-slate-800 text-slate-500"
              }`}
            >
              {step > num ? <CheckCircle2 size={24} /> : num}
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-widest ${
                step >= num ? "text-blue-500" : "text-slate-600"
              }`}
            >
              {num === 1 ? "Identity" : num === 2 ? "Assessment" : "Review"}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: VENDOR IDENTITY */}
      {step === 1 && (
        <div className="bg-white dark:bg-[#0f1115] rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
              <Building2 size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Vendor Identity</h2>
              <p className="text-slate-500 text-xs">
                Establish the primary profile for automated scanning.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Company Name
              </label>
              <input
                type="text"
                placeholder="e.g. Microsoft"
                className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:border-blue-500 text-white font-bold transition shadow-inner"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                Domain URL
              </label>
              <div className="relative">
                <Globe
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="microsoft.com"
                  className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pl-12 outline-none focus:border-blue-500 text-white font-bold transition shadow-inner"
                  onChange={(e) =>
                    setFormData({ ...formData, domain: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <button
            onClick={nextStep}
            disabled={!formData.name || !formData.domain}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Continue to Risk Tiering <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* STEP 2: ASSESSMENT SELECTION */}
      {step === 2 && (
        <div className="bg-white dark:bg-[#0f1115] rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="p-3 bg-purple-600/10 rounded-2xl text-purple-500">
              <Lock size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                Security Baseline
              </h2>
              <p className="text-slate-500 text-xs">
                Select an onboarding questionnaire to send to{" "}
                {formData.name || "the vendor"}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {existingTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all group text-left ${
                  selectedTemplate === template.id
                    ? "border-blue-600 bg-blue-600/5"
                    : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-lg ${
                      selectedTemplate === template.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                    }`}
                  >
                    <Zap size={18} />
                  </div>
                  <div>
                    <div className="font-black text-slate-800 dark:text-white">
                      {template.name}
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {template.questions} Critical Controls
                    </div>
                  </div>
                </div>
                <div
                  className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedTemplate === template.id
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {selectedTemplate === template.id && (
                    <CheckCircle2 size={14} className="text-white" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={prevStep}
              className="flex-1 py-4 font-bold text-slate-500 hover:text-white transition"
            >
              Go Back
            </button>
            <button
              onClick={nextStep}
              disabled={!selectedTemplate}
              className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition disabled:opacity-50"
            >
              Review Invite
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: FINAL REVIEW */}
      {step === 3 && (
        <div className="text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="relative inline-block">
            <div className="h-32 w-32 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-green-500">
              <Send size={56} className="animate-bounce" />
            </div>
            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white dark:bg-[#0f1115] border-4 border-[#050505] rounded-full flex items-center justify-center text-green-500">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tight">
              Ready to Monitor?
            </h2>
            <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
              We will add{" "}
              <span className="text-white font-bold">{formData.name}</span> to
              your portfolio and trigger the automated scanning engine
              immediately.
            </p>
          </div>

          <div className="max-w-md mx-auto p-6 bg-slate-900/50 border border-slate-800 rounded-3xl text-left space-y-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-widest">
                Selected Template
              </span>
              <span className="text-blue-400 font-black">
                {existingTemplates.find((t) => t.id === selectedTemplate)?.name}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-bold uppercase tracking-widest">
                Primary Asset
              </span>
              <span className="text-white font-black">{formData.domain}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 max-w-sm mx-auto pt-6">
            <button
              onClick={() => setActiveView("vendorPortfolio")}
              className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-green-600/20 hover:bg-green-700 transition transform active:scale-95"
            >
              Finalize & Launch
            </button>
            <button
              onClick={prevStep}
              className="text-slate-500 font-bold text-sm hover:text-white transition"
            >
              Change Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
