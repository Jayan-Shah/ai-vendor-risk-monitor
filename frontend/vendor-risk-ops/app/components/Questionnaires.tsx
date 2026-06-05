/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  ClipboardList,
  Send,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpRight,
  PlusCircle,
} from "lucide-react";
import { questionnaireData } from "../dummyData";

export default function Questionnaires({
  setActiveView,
}: {
  setActiveView: (v: string) => void;
}) {
  return (
    <div className="animate-in fade-in duration-500 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Security Questionnaires
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and track active security assessments across your portfolio.
          </p>
        </div>
        <div className="flex gap-3">
          {/* Manage Templates now goes to the Library */}
          <button
            onClick={() => setActiveView("templateLibrary")}
            className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-4 py-2.5 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <PlusCircle size={18} />
            <span>Manage Templates</span>
          </button>

          {/* Send New Questionnaire will eventually go to a Send Wizard */}
          <button
            onClick={() => setActiveView("builder")}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg transition"
          >
            <Send size={18} />
            <span>Send New Questionnaire</span>
          </button>
        </div>
      </div>

      {/* Global Assessment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Active",
            value: 12,
            icon: ClipboardList,
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/10",
          },
          {
            label: "Pending Response",
            value: 5,
            icon: Clock,
            color: "text-yellow-500",
            bg: "bg-yellow-50 dark:bg-yellow-900/10",
          },
          {
            label: "Under Review",
            value: 3,
            icon: Search,
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-900/10",
          },
          {
            label: "Completed (MTD)",
            value: 24,
            icon: CheckCircle2,
            color: "text-green-500",
            bg: "bg-green-50 dark:bg-green-900/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={18} />
              </div>
            </div>
            <div className="text-3xl font-black mt-4 text-slate-800 dark:text-white">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Active Assessments Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center">
          <h2 className="font-bold text-slate-800 dark:text-slate-200">
            Live Assessment Tracker
          </h2>
          <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5">
            <Search size={14} className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Filter by vendor..."
              className="bg-transparent border-none outline-none text-xs font-medium w-48 text-slate-700 dark:text-slate-300"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                <th className="p-4">Vendor</th>
                <th className="p-4">Assessment Title</th>
                <th className="p-4 text-center">Progress</th>
                <th className="p-4">Status</th>
                <th className="p-4">Due Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questionnaireData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group"
                >
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      {item.vendor}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
                      {item.id}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {item.title}
                    </div>
                  </td>
                  <td className="p-4 w-48">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 rounded-full ${
                            item.progress === 100
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 w-8">
                        {item.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest border ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          : item.status === "Under Review"
                          ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
                          : item.status === "In Progress"
                          ? "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
                          : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-300" />
                      {item.dueDate}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-blue-500 hover:text-blue-600 font-bold text-xs inline-flex items-center gap-1 group/btn">
                      Review{" "}
                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
