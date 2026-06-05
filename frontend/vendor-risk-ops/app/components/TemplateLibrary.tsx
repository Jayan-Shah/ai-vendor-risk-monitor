/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  FileText,
  Edit3,
  Copy,
  Trash2,
  Plus,
  Clock,
  Search,
  LayoutGrid,
  List as ListIcon,
} from "lucide-react";

interface TemplateLibraryProps {
  setActiveView: (v: string) => void;
  templates: any[]; // This is the dynamic list from page.tsx
}

export default function TemplateLibrary({
  setActiveView,
  templates,
}: TemplateLibraryProps) {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Template Library
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and edit your standardized security assessments.
          </p>
        </div>
        <button
          onClick={() => setActiveView("builder")}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition transform active:scale-95"
        >
          <Plus size={18} />
          <span>Create Blank Template</span>
        </button>
      </div>

      {/* Toolbar: Search and View Toggles */}
      <div className="flex justify-between items-center bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
        <div className="relative w-72">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full bg-black/40 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-xs outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-slate-800 text-white rounded-lg">
            <LayoutGrid size={18} />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg transition">
            <ListIcon size={18} />
          </button>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group bg-[#0f1115] border border-slate-800 rounded-[2rem] p-8 shadow-sm hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden"
          >
            {/* Hover Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-500">
                <FileText size={28} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <button className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition">
                  <Copy size={16} />
                </button>
                <button className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-white mb-2">
              {template.name}
            </h3>

            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                {template.questions} Questions
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-1 rounded-md">
                <Clock size={12} /> {template.lastModified}
              </span>
            </div>

            <button
              onClick={() => setActiveView("builder")}
              className="w-full flex items-center justify-center gap-2 py-4 bg-slate-800/50 text-slate-300 rounded-2xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all group/btn"
            >
              <Edit3
                size={16}
                className="transition-transform group-hover/btn:rotate-12"
              />
              Edit Template
            </button>
          </div>
        ))}

        {/* Empty State / Add Card */}
        <button
          onClick={() => setActiveView("builder")}
          className="border-2 border-dashed border-slate-800 rounded-[2rem] p-8 flex flex-col items-center justify-center text-slate-600 hover:border-blue-500/50 hover:text-blue-500 transition group bg-transparent"
        >
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
            <Plus size={24} />
          </div>
          <span className="font-bold">Add New Template</span>
        </button>
      </div>
    </div>
  );
}
