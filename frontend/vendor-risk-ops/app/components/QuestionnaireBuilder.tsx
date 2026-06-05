/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Type,
  List,
  UploadCloud,
  ToggleRight,
  Calendar,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Eye,
  ChevronLeft,
  X,
  PlusCircle,
} from "lucide-react";
import { builderElements } from "../dummyData";

interface QuestionnaireBuilderProps {
  setActiveView: (v: string) => void;
  onSave: (template: any) => void;
}

export default function QuestionnaireBuilder({
  setActiveView,
  onSave,
}: QuestionnaireBuilderProps) {
  const [questions, setQuestions] = useState<any[]>([
    {
      id: 1,
      type: "Multiple Choice",
      label: "Does your organization have a SOC 2 Type II report?",
      options: ["Yes", "No", "In Progress"],
    },
  ]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState("");

  // Add a new question to the canvas
  const addQuestion = (type: string) => {
    const newId = Date.now();
    const newQuestion = {
      id: newId,
      type,
      label: `New ${type} Question`,
      options: type === "Multiple Choice" ? ["Option 1", "Option 2"] : [],
    };
    setQuestions([...questions, newQuestion]);
  };

  // Remove a question
  const removeQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Handle saving the template to the parent state
  const handleFinalSave = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name.");
      return;
    }

    const newTemplate = {
      id: `T-${Date.now()}`,
      name: templateName,
      questions: questions.length,
      lastModified: "Just now",
    };

    // Push the new template to the parent state in page.tsx
    onSave(newTemplate);

    setShowSaveModal(false);
    setActiveView("templateLibrary");
  };

  return (
    <div className="animate-in fade-in duration-500 flex flex-col h-full relative">
      {/* Top Header Navigation */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView("templateLibrary")}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Questionnaire Builder
            </h1>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em]">
              Design Mode
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-800 rounded-xl font-bold text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition">
            <Eye size={16} /> Preview
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition"
          >
            <Save size={16} /> Save Template
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-8 overflow-hidden pb-10">
        {/* Left Sidebar: Toolset */}
        <div className="w-72 flex flex-col gap-4">
          <h3 className="px-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Available Components
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {builderElements.map((el) => (
              <button
                key={el.id}
                onClick={() => addQuestion(el.type)}
                className="flex items-center gap-3 p-3.5 bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-500 hover:shadow-md transition group text-left"
              >
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {el.type === "Short Answer" && <Type size={18} />}
                  {el.type === "Multiple Choice" && <List size={18} />}
                  {el.type === "File Upload" && <UploadCloud size={18} />}
                  {el.type === "Yes/No Toggle" && <ToggleRight size={18} />}
                  {el.type === "Date Picker" && <Calendar size={18} />}
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                    {el.type}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase">
                    Add Field
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 bg-slate-100/30 dark:bg-[#0a0a0b] rounded-[2.5rem] border border-slate-200 dark:border-slate-800/50 p-10 overflow-y-auto custom-scrollbar">
          <div className="max-w-2xl mx-auto space-y-6">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="group relative bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm hover:border-blue-500/50 transition"
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition cursor-grab text-slate-700">
                  <GripVertical size={20} />
                </div>

                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-slate-500 opacity-50">
                        #{index + 1}
                      </span>
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded-md">
                        {q.type}
                      </span>
                    </div>
                    <input
                      type="text"
                      defaultValue={q.label}
                      className="w-full bg-transparent border-none text-xl font-bold text-slate-800 dark:text-slate-100 outline-none placeholder-slate-700"
                      placeholder="Enter question title..."
                    />
                  </div>
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="p-2 text-slate-600 hover:text-red-500 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* FIELD RENDERING */}
                <div className="pl-6 border-l-2 border-slate-100 dark:border-slate-800">
                  {q.type === "Short Answer" && (
                    <input
                      type="text"
                      disabled
                      className="w-full bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-slate-800 rounded-xl p-4 text-sm italic text-slate-500"
                      placeholder="Vendor will provide a text response..."
                    />
                  )}

                  {q.type === "Multiple Choice" && (
                    <div className="space-y-3">
                      {q.options.map((opt: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 group/opt"
                        >
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700 flex-shrink-0 bg-slate-50 dark:bg-slate-900"></div>
                          <input
                            type="text"
                            defaultValue={opt}
                            className="text-sm font-semibold bg-transparent border-b border-transparent focus:border-blue-500 outline-none py-1 w-full text-slate-400"
                          />
                          <button className="opacity-0 group-hover/opt:opacity-100 p-1 text-slate-600 hover:text-red-500">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                      <button className="text-xs text-blue-500 font-black hover:underline mt-2 flex items-center gap-1">
                        <PlusCircle size={14} /> ADD OPTION
                      </button>
                    </div>
                  )}

                  {q.type === "File Upload" && (
                    <div className="w-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-black/20">
                      <UploadCloud className="text-slate-600 mb-2" size={32} />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Vendor Dropzone for Evidence
                      </span>
                    </div>
                  )}

                  {q.type === "Yes/No Toggle" && (
                    <div className="flex items-center gap-4 py-2">
                      <div className="w-14 h-7 bg-slate-200 dark:bg-slate-800 rounded-full relative">
                        <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow-md"></div>
                      </div>
                      <span className="text-sm text-slate-500 font-bold uppercase tracking-tighter">
                        True / False Input
                      </span>
                    </div>
                  )}

                  {q.type === "Date Picker" && (
                    <div className="flex items-center gap-3 w-64 bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-slate-800 rounded-xl p-4">
                      <Calendar className="text-slate-600" size={18} />
                      <input
                        type="date"
                        className="bg-transparent border-none outline-none text-sm text-slate-500 font-bold w-full [color-scheme:dark]"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={() => addQuestion("Short Answer")}
              className="w-full py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 hover:border-blue-500 hover:text-blue-500 transition group bg-transparent"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition">
                <Plus size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest">
                Add New Field
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* SAVE MODAL */}
      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#050505]/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative">
            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
              Save Template
            </h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">
              Name your assessment to make it available for vendor onboarding.
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Template Name
                </label>
                <input
                  autoFocus
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. Critical Infrastructure Audit"
                  className="w-full bg-slate-50 dark:bg-black border border-slate-200 dark:border-slate-800 rounded-2xl p-5 outline-none focus:border-blue-500 text-white font-bold transition-all shadow-inner"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="flex-1 py-4 font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinalSave}
                  className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition transform active:scale-95"
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
