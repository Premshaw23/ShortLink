"use client";

import { Loader, Copy, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, use } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { isAnalyticsAllowed } from "@/lib/consent";
import { useSession } from "next-auth/react";
import { openConsentBanner } from "@/components/CookieConsent";

export default function StatsPage({ params }) {
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const { slug } = use(params);
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;
  const [consentChecked, setConsentChecked] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    // Only check consent for anonymous users
    if (isLoggedIn) {
      setAnalyticsAllowed(true);
      setConsentChecked(true);
    } else {
      const checkConsent = () => {
        setAnalyticsAllowed(isAnalyticsAllowed());
        setConsentChecked(true);
      };
      checkConsent();
      // Listen for consent changes (e.g., from consent banner)
      function handleStorage(e) {
        if (e.key === "cookie_consent") {
          checkConsent();
        }
      }
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!consentChecked || !analyticsAllowed) return;
    fetch(`/api/stats/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to load stats");
        }
        return res.json();
      })
      .then(setData)
      .catch((err) => console.error("Stats error:", err.message));
  }, [slug, analyticsAllowed, consentChecked]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!consentChecked || (status === "loading")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-lg text-purple-700 font-semibold">Loading analytics...</p>
      </div>
    );
  }

  if (!isLoggedIn && !analyticsAllowed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-lg text-purple-700 font-semibold">Analytics are disabled due to your privacy settings.</p>
        <p className="text-gray-500 mt-2">You can enable analytics by accepting cookies in the consent banner.</p>
        <button
          onClick={openConsentBanner}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-sm"
        >
          Change Cookie Settings
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-lg text-purple-700 font-semibold">Loading analytics...</p>
      </div>
    );
  }

  // Group logs by date for chart
  const dateCounts = {};
  const referrerCounts = {};
  const deviceCounts = {};
  const browserCounts = {};
  (data.logs || []).forEach((log) => {
    // Clicks over time
    const date = new Date(log.timestamp).toLocaleDateString();
    dateCounts[date] = (dateCounts[date] || 0) + 1;
    // Top referrers
    const ref = log.referer || "Direct / Unknown";
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
    // Device/Browser stats (simple parsing)
    const ua = log.userAgent || "Unknown";
    if (/mobile/i.test(ua)) deviceCounts["Mobile"] = (deviceCounts["Mobile"] || 0) + 1;
    else if (/tablet/i.test(ua)) deviceCounts["Tablet"] = (deviceCounts["Tablet"] || 0) + 1;
    else deviceCounts["Desktop"] = (deviceCounts["Desktop"] || 0) + 1;
    const browser =
      /chrome/i.test(ua) ? "Chrome" :
      /firefox/i.test(ua) ? "Firefox" :
      /safari/i.test(ua) && !/chrome/i.test(ua) ? "Safari" :
      /edge/i.test(ua) ? "Edge" :
      /opera|opr/i.test(ua) ? "Opera" :
      "Other";
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;
  });
  const chartData = Object.entries(dateCounts).map(([date, count]) => ({ date, count }));
  const topReferrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const deviceChartData = Object.entries(deviceCounts).map(([type, count]) => ({ type, count }));
  const browserChartData = Object.entries(browserCounts).map(([type, count]) => ({ type, count }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/stats" className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-900 font-semibold text-sm bg-purple-50 px-3 py-2 rounded-lg transition">
          <ArrowLeft size={18} /> Back
        </Link>
        <span className="ml-auto flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg">
          <span className="font-mono text-purple-700">/s/{slug}</span>
          <button
            onClick={handleCopy}
            className="text-purple-600 hover:text-purple-900"
            title="Copy short link"
          >
            <Copy size={18} />
          </button>
          {copied && <span className="text-green-600 text-xs ml-1">Copied!</span>}
        </span>
      </div>

      <h1 className="text-3xl font-extrabold mb-6 text-purple-700 text-center tracking-tight drop-shadow">
        📊 Link Analytics for <code className="text-purple-900 bg-purple-100 px-2 py-1 rounded">/{slug}</code>
      </h1>

      <div className="mb-8 p-6 bg-white shadow-lg rounded-2xl flex flex-wrap gap-8 justify-between items-center">
        <div>
          <p className="text-lg text-gray-700 mb-1">
            <span className="font-semibold">Total Clicks:</span> <span className="text-green-700 font-bold">{data.totalClicks}</span>
          </p>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-semibold text-xs mt-1 ${data.passwordProtected ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {data.passwordProtected ? "🔒 Password Protected" : "🔓 Public"}
          </span>
        </div>
        <div>
          <p className="text-gray-600">
            <span className="font-semibold">Created At:</span> {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Expires At:</span> {data.expiresAt ? new Date(data.expiresAt).toLocaleString() : "Never"}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Clicks Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value, name, props) => [`${value} clicks`, "Date"]} />
            <Line type="monotone" dataKey="count" stroke="#a78bfa" dot={false} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Referrers */}
      <div className="bg-white shadow rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Top Referrers</h2>
        {topReferrers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No referrer data yet.</p>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr>
                <th className="p-2 border-b">Referrer</th>
                <th className="p-2 border-b">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {topReferrers.map(([ref, count], i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-purple-50" : ""}>
                  <td className="p-2 border-b truncate max-w-xs">{ref}</td>
                  <td className="p-2 border-b">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Device/Browser Stats */}
      <div className="bg-white shadow rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Device Types</h2>
          {deviceChartData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No device data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={deviceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Browsers</h2>
          {browserChartData.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No browser data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={browserChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#818cf8" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Click Logs</h2>
        {(!data.logs || data.logs.length === 0) ? (
          <p className="text-gray-500 text-center py-8">No clicks yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="p-2 border-b">Timestamp</th>
                  <th className="p-2 border-b">IP</th>
                  <th className="p-2 border-b">User Agent</th>
                </tr>
              </thead>
              <tbody>
                {(data.logs || []).map((log, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-purple-50" : ""}>
                    <td className="p-2 border-b">{log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}</td>
                    <td className="p-2 border-b">{log.ip || "-"}</td>
                    <td className="p-2 border-b truncate max-w-xl">{log.userAgent || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
