import React from "react";
import {
  Server,
  Globe,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  Github,
  Newspaper,
  AlertOctagon,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function CyberReportCard({ vendor }: { vendor: any }) {
  if (!vendor) return null;

  // --- AGGRESSIVE DATA EXTRACTOR ---
  // This parses stringified JSON from the database to ensure we never see "Data missing"
  let parsedVendor = { ...vendor };

  // 1. Attempt to parse any stringified root properties
  for (const key in parsedVendor) {
    if (
      typeof parsedVendor[key] === "string" &&
      (parsedVendor[key].startsWith("{") || parsedVendor[key].startsWith("["))
    ) {
      try {
        parsedVendor[key] = JSON.parse(parsedVendor[key]);
      } catch (e) {}
    }
  }

  // 2. Coalesce all possible data locations from the backend orchestrator
  const allData = {
    ...parsedVendor.recon_results,
    ...parsedVendor.cyber_data,
    ...parsedVendor.scan_results,
    ...parsedVendor.data,
    ...parsedVendor,
  };

  // 3. Extract Specific Engines
  const cloud_hosting = allData.cloud_hosting || {
    ip: "Data missing",
    isp: "Pending Sync",
    country: "N/A",
  };
  const email_security = allData.email_security || {
    spf_found: false,
    dmarc_found: false,
    dmarc_reject: false,
  };
  const open_ports = allData.open_ports || [];
  const subdomains = allData.subdomains || [];

  // Extract Leaks (Handling multiple possible backend naming conventions)
  let raw_leaks =
    allData.github_leaks || allData.identity_recon?.github_leaks || [];
  if (typeof raw_leaks === "string") {
    try {
      raw_leaks = JSON.parse(raw_leaks);
    } catch (e) {
      raw_leaks = [];
    }
  }
  const top10Leaks = Array.isArray(raw_leaks) ? raw_leaks.slice(0, 10) : [];

  // Extract News
  let raw_news =
    allData.news ||
    allData.news_articles ||
    allData.financial_recon?.news ||
    [];
  if (typeof raw_news === "string") {
    try {
      raw_news = JSON.parse(raw_news);
    } catch (e) {
      raw_news = [];
    }
  }
  const recentNews = Array.isArray(raw_news) ? raw_news.slice(0, 5) : [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen p-8 print:p-0 print:bg-white flex justify-center">
      <div className="bg-white w-full max-w-4xl shadow-2xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden border border-slate-200">
        {/* HEADER */}
        <div className="bg-[#0f172a] px-10 py-8 text-white flex justify-between items-end border-b-4 border-[#2563EB]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={18} className="text-[#3b82f6]" />
              <p className="text-[#3b82f6] font-bold tracking-widest uppercase text-xs">
                Deep Analysis OSINT Report
              </p>
            </div>
            <h1 className="text-4xl font-black">
              {vendor.name || "Unknown Vendor"}
            </h1>
            <p className="text-slate-400 font-medium mt-1">{vendor.domain}</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-[#1e293b] rounded-lg p-3 border border-slate-700 mb-2">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                Calculated Risk Score
              </p>
              <p
                className={`text-3xl font-black ${
                  parsedVendor.risk_score < 50
                    ? "text-rose-500"
                    : parsedVendor.risk_score < 75
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              >
                {parsedVendor.risk_score ?? parsedVendor.score ?? "N/A"}
              </p>
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
              Generated
            </p>
            <p className="font-bold text-sm">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="p-10 space-y-10">
          {/* 1. HOSTING & GEOGRAPHY */}
          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
              <MapPin className="text-[#2563EB]" size={20} />
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                Hosting & Residency
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Primary IP
                </p>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {cloud_hosting.ip}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Service Provider (ISP)
                </p>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {cloud_hosting.isp}
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase">
                  Data Location
                </p>
                <p className="text-sm font-black text-slate-900 mt-1">
                  {cloud_hosting.country}
                </p>
              </div>
            </div>
          </section>

          {/* 2. INFRASTRUCTURE EXPOSURE (CENSYS PORTS) */}
          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
              <Server className="text-[#2563EB]" size={20} />
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                Port & Service Exposure
              </h2>
            </div>

            {open_ports.length > 0 ? (
              <div className="border border-rose-200 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-rose-50 text-rose-800 text-xs uppercase font-black">
                    <tr>
                      <th className="px-4 py-3">Exposed Port</th>
                      <th className="px-4 py-3">Detected Service</th>
                      <th className="px-4 py-3">Target IP</th>
                      <th className="px-4 py-3">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-100 bg-white">
                    {open_ports.map((port: any, idx: number) => (
                      <tr key={idx} className="hover:bg-rose-50/50">
                        <td className="px-4 py-3 font-black text-slate-800">
                          {port.port}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-600 uppercase">
                          {port.service || "UNKNOWN"}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                          {port.ip || cloud_hosting.ip}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                              [22, 3389, 2082, 2083, 2086, 2087].includes(
                                port.port
                              )
                                ? "bg-rose-600 text-white"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {[22, 3389, 2082, 2083, 2086, 2087].includes(
                              port.port
                            )
                              ? "Critical"
                              : "Warning"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 text-emerald-800">
                <CheckCircle2 size={24} />
                <div>
                  <p className="font-bold">Infrastructure Hardened</p>
                  <p className="text-sm font-medium text-emerald-600">
                    No non-standard or high-risk ports detected publicly.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 3. IDENTITY LEAKS (GITHUB SECRETS) - NEW */}
          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
              <Github className="text-[#2563EB]" size={20} />
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                Identity & Data Leaks (Top 10)
              </h2>
              <span className="ml-auto bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
                {raw_leaks.length} Total Leaks Found
              </span>
            </div>

            {top10Leaks.length > 0 ? (
              <div className="border border-amber-200 rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-amber-50 text-amber-800 text-xs uppercase font-black">
                    <tr>
                      <th className="px-4 py-3">Leak Type</th>
                      <th className="px-4 py-3">Repository</th>
                      <th className="px-4 py-3">File Path</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100 bg-white">
                    {top10Leaks.map((leak: any, idx: number) => (
                      <tr key={idx} className="hover:bg-amber-50">
                        <td className="px-4 py-3 font-bold text-amber-900">
                          {leak.secret_type || leak.leak_type || "API Key"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">
                          {leak.repository || leak.repo || "Private/Internal"}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500 break-all">
                          {leak.filename || leak.file || "config.json"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {raw_leaks.length > 10 && (
                  <div className="bg-slate-50 p-2 text-center text-xs font-bold text-slate-500 uppercase border-t border-amber-200">
                    + {raw_leaks.length - 10} more leaks hidden for brevity
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-center text-slate-500">
                <p className="text-sm font-medium italic">
                  No exposed credentials or secrets detected on public GitHub.
                </p>
              </div>
            )}
          </section>

          {/* 4. FINANCIAL & NEGATIVE NEWS - NEW */}
          <section>
            <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
              <Newspaper className="text-[#2563EB]" size={20} />
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">
                Financial Context & Negative News
              </h2>
            </div>

            {recentNews.length > 0 ? (
              <div className="space-y-3">
                {recentNews.map((article: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:border-[#2563EB] transition group"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#2563EB] transition">
                          {article.title || article.headline}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {article.snippet || article.summary}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase">
                            {article.source || "News Outlet"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {article.date || "Recent"}
                          </span>
                        </div>
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-[#2563EB] transition"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-center text-slate-500">
                <p className="text-sm font-medium italic">
                  No critical negative news articles found in recent web
                  scraping.
                </p>
              </div>
            )}
          </section>

          {/* 5. EMAIL & ATTACK SURFACE */}
          <section className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                <Mail className="text-[#2563EB]" size={20} />
                <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">
                  Domain Hygiene
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      SPF Record
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase">
                      Spoofing Protection
                    </p>
                  </div>
                  {email_security.spf_found ? (
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  ) : (
                    <XCircle className="text-rose-500" size={20} />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white">
                  <div>
                    <p className="font-bold text-sm text-slate-800">
                      DMARC Reject Policy
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase">
                      Phishing Enforcement
                    </p>
                  </div>
                  {email_security.dmarc_reject ? (
                    <CheckCircle2 className="text-emerald-500" size={20} />
                  ) : (
                    <XCircle className="text-rose-500" size={20} />
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
                <Globe className="text-[#2563EB]" size={20} />
                <h2 className="text-base font-black text-slate-800 uppercase tracking-wide">
                  Subdomain Surface
                </h2>
              </div>
              {subdomains.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-lg p-3 max-h-[140px] overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {subdomains.map((sub: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded border border-slate-200"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">
                  No public subdomains discovered.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* FLOATING ACTION BUTTON FOR PDF EXPORT */}
      <button
        onClick={handlePrint}
        className="fixed bottom-10 right-10 bg-[#2563EB] text-white shadow-xl shadow-blue-200 px-6 py-3 rounded-full font-black tracking-wide hover:bg-blue-700 transition print:hidden"
      >
        Export as PDF
      </button>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * { visibility: hidden; }
          .print\\:bg-white, .print\\:bg-white * { visibility: visible; }
          .print\\:bg-white { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
        }
      `,
        }}
      />
    </div>
  );
}
