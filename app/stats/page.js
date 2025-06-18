"use client";

import { Copy, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AllStatsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await fetch("/api/fetchdata");
        if (!res.ok) throw new Error("Failed to fetch URLs");
        const data = await res.json();
        setUrls(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${shortUrl}`);
    setCopiedSlug(shortUrl);
    setTimeout(() => setCopiedSlug(null), 1500);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100 animate-pulse flex flex-col gap-4"
          >
            <div className="h-4 bg-purple-100 rounded w-1/3 mb-2" />
            <div className="h-5 bg-purple-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-purple-100 rounded w-1/2 mb-2" />
            <div className="flex gap-2 mt-4">
              <div className="h-8 w-20 bg-purple-100 rounded" />
              <div className="h-8 w-20 bg-purple-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center py-10 text-red-500 font-medium">{error}</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-purple-700 mb-10 text-center tracking-tight drop-shadow">
        📈 All Link Stats
      </h1>

      {urls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-center text-gray-500 text-lg">
            No shortened links found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {urls.map((url) => (
            <article
              key={url._id}
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between h-full border border-purple-100 focus-within:ring-2 focus-within:ring-purple-400"
            >
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-1">
                  Created:{" "}
                  {url.createdAt
                    ? new Date(url.createdAt).toLocaleString("en-IN")
                    : "-"}
                </p>
                <button
                  type="button"
                  title={url.originalUrl}
                  onClick={() =>
                    window.open(
                      url.originalUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      window.open(
                        url.originalUrl,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                  className="font-semibold text-blue-700 hover:underline break-all text-left text-base focus:outline-none"
                >
                  {url.originalUrl.length > 60
                    ? url.originalUrl.slice(0, 60) + "..."
                    : url.originalUrl}
                </button>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Short:</span>
                  <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded font-mono text-purple-700">
                    <Link
                      href={`/s/${url.shortenedUrl}`}
                      className="hover:underline"
                    >
                      {url.shortenedUrl}
                    </Link>
                    <button
                      type="button"
                      className="ml-1 text-purple-500 hover:text-purple-800"
                      title="Copy short link"
                      onClick={() => handleCopy(url.shortenedUrl)}
                    >
                      <Copy size={16} />
                    </button>
                    {copiedSlug === url.shortenedUrl && (
                      <span className="ml-1 text-green-600 text-xs">
                        Copied!
                      </span>
                    )}
                  </span>
                </div>

                {url.expiresAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Expires: {new Date(url.expiresAt).toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="font-bold text-green-700 text-lg">
                    {url.clicks || 0}
                  </span>
                  <span className="ml-1 text-gray-500 text-sm">clicks</span>
                </div>

                <div className="text-xs flex items-center gap-2">
                  {url.password ? (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                      🔒 Password
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      🔓 Public
                    </span>
                  )}
                </div>

                <Link
                  href={`/stats/${url.shortenedUrl}`}
                  className="ml-2 flex items-center gap-1 text-purple-700 hover:text-purple-900"
                >
                  <BarChart2 size={18} />
                  <span className="font-semibold text-sm">Stats</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
