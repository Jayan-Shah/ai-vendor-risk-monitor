import React from "react";
import { Search, Bell, Sun, Moon } from "lucide-react";

export default function Header({
  mounted,
  currentTheme,
  setTheme,
}: {
  mounted: boolean;
  currentTheme: string;
  setTheme: (t: string) => void;
}) {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 transition-colors duration-300">
      <div className="flex items-center w-96 bg-slate-100 dark:bg-slate-800/50 rounded-lg px-3 py-2 border border-transparent focus-within:border-blue-500 transition-colors">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search globally..."
          className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 dark:text-slate-300 placeholder-slate-400"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        <button
          onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300 flex items-center justify-center w-9 h-9"
        >
          {mounted &&
            (currentTheme === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} />
            ))}
        </button>
        <div className="h-8 w-8 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full shadow-inner border border-slate-200 dark:border-slate-700"></div>
      </div>
    </header>
  );
}
