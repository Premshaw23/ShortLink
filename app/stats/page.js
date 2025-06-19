"use client";

import { Copy, BarChart2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { useSession } from "next-auth/react";

export default function AllStatsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [qrPreview, setQrPreview] = useState(null); // url.shortenedUrl or null
  const [search, setSearch] = useState("");
  const [showActive, setShowActive] = useState(true);
  const [showExpired, setShowExpired] = useState(true);
  const [page, setPage] = useState(1);
  const { data: session } = useSession();

  const pageSize = 6;

  const filteredUrls = urls.filter((url) => {
    const q = search.toLowerCase();
    const isExpired = url.expiresAt && new Date(url.expiresAt) < new Date();
    if (!showActive && !isExpired) return false;
    if (!showExpired && isExpired) return false;
    return (
      url.originalUrl.toLowerCase().includes(q) ||
      (url.shortenedUrl && url.shortenedUrl.toLowerCase().includes(q)) ||
      (url.customShortened && url.customShortened.toLowerCase().includes(q))
    );
  });
  const totalPages = Math.max(1, Math.ceil(filteredUrls.length / pageSize));
  const pagedUrls = filteredUrls.slice((page - 1) * pageSize, page * pageSize);

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

  // Reset page to 1 when search/filter changes
  useEffect(() => {
    setPage(1);
  }, [search, showActive, showExpired]);

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${shortUrl}`);
    setCopiedSlug(shortUrl);
    setTimeout(() => setCopiedSlug(null), 1500);
  };

  const handleCopyOriginal = (originalUrl) => {
    navigator.clipboard.writeText(originalUrl);
    setCopiedSlug(originalUrl);
    setTimeout(() => setCopiedSlug(null), 1500);
  };

  // Helper to highlight search matches
  function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(
      `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
      "gi"
    );
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-indigo-200/70 text-indigo-900 font-medium rounded-md px-1 py-0.5 whitespace-pre-wrap"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  // Helper to determine link ownership
  function getLinkType(url) {
    if (session && url.owner && session.user && url.owner === session.user.email) {
      return "My Link";
    } else if (!url.owner) {
      return "Anonymous";
    } else {
      return "Other";
    }
  }

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
      <h1 className="text-4xl font-extrabold text-purple-700 mb-3 text-center tracking-tight drop-shadow">
        📈 All Link Stats
      </h1>
      {/* Info Banner: Link Ownership */}
      <div className="mb-6 flex flex-row items-center justify-center gap-4">
        <div className="bg-purple-50 border border-purple-200 rounded-xl px-5 py-3 text-purple-800 text-sm font-medium shadow-sm max-w-2xl">
          <span className="block mb-1">
            <span className="font-bold">Anonymous links</span> are links you created without signing in. They are only visible to you on this device and will expire in 24 hours.
          </span>
          <span className="block">
            <span className="font-bold">My links</span> are links you created while signed in. They are saved to your account and accessible from any device.
          </span>
        </div>
      </div>

      {/* History/Filter Panel */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8 bg-purple-50 border border-purple-100 rounded-xl p-5 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by original URL, alias, or short link..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
        />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={showActive}
              onChange={() => setShowActive((v) => !v)}
              className="accent-purple-600"
            />
            Active
          </label>
          <label className="flex items-center gap-1 text-xs font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={showExpired}
              onChange={() => setShowExpired((v) => !v)}
              className="accent-purple-600"
            />
            Expired
          </label>
        </div>
      </div>

      {urls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-center text-gray-500 text-lg">
            No shortened links found.
          </p>
        </div>
      ) : filteredUrls.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <p className="text-center text-gray-400 text-lg font-semibold">
            No links found matching your search/filter.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pagedUrls.map((url) => (
              <article
                key={url._id}
                className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between h-full border border-purple-100 focus-within:ring-2 focus-within:ring-purple-400"
              >
                <div className="mb-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="focus:outline-none"
                        title="Click to preview large QR"
                        onClick={() => setQrPreview(url.shortenedUrl)}
                      >
                        <QRCodeSVG
                          value={`${window.location.origin}/s/${url.shortenedUrl}`}
                          size={56}
                          className="border border-purple-100 rounded-lg bg-white p-1 hover:scale-110 transition-transform"
                        />
                      </button>
                      <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">
                          Created: {url.createdAt ? new Date(url.createdAt).toLocaleString("en-IN") : "-"}
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
                          {highlightText(
                            url.originalUrl.length > 60
                              ? url.originalUrl.slice(0, 60) + "..."
                              : url.originalUrl,
                            search
                          )}
                        </button>
                        <button
                          type="button"
                          className="ml-2 text-purple-500 hover:text-purple-800 text-xs border border-purple-100 rounded px-2 py-1"
                          title="Copy original URL"
                          onClick={() => handleCopyOriginal(url.originalUrl)}
                        >
                          Copy Original
                        </button>
                        {copiedSlug === url.originalUrl && (
                          <span className="ml-1 text-green-600 text-xs">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Ownership badge */}
                    <span
                      className={`ml-4 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-sm border ${getLinkType(url) === "My Link" ? "bg-green-100 text-green-700 border-green-200" : getLinkType(url) === "Anonymous" ? "bg-yellow-100 text-yellow-800 border-yellow-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                      title={getLinkType(url) === "My Link" ? "This link belongs to your account" : getLinkType(url) === "Anonymous" ? "This is an anonymous link (only visible on this device)" : "Other user's link"}
                    >
                      {getLinkType(url)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-500">Short:</span>
                    <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded font-mono text-purple-700">
                      <Link
                        href={`/s/${url.shortenedUrl}`}
                        className="hover:underline"
                      >
                        {highlightText(url.shortenedUrl, search)}
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
                    <p
                      className={`text-xs mt-1 font-semibold ${
                        new Date(url.expiresAt) < new Date()
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      Expires: {new Date(url.expiresAt).toLocaleString("en-IN")}
                      {new Date(url.expiresAt) < new Date() && (
                        <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">
                          Expired
                        </span>
                      )}
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
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    aria-disabled={page === 1}
                    tabIndex={page === 1 ? -1 : 0}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={page === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage((p) => Math.min(totalPages, p + 1));
                    }}
                    aria-disabled={page === totalPages}
                    tabIndex={page === totalPages ? -1 : 0}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}

      {qrPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setQrPreview(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 flex flex-col items-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-purple-700 text-xl font-bold"
              onClick={() => setQrPreview(null)}
              title="Close preview"
            >
              ×
            </button>
            <QRCodeSVG
              id="qr-big-preview"
              value={`${window.location.origin}/s/${qrPreview}`}
              size={220}
              className="border border-purple-200 rounded-lg bg-white p-2 mb-4"
            />
            {/* Hidden canvas for PNG export */}
            <canvas
              id="qr-canvas"
              width="220"
              height="220"
              style={{ display: "none" }}
            ></canvas>
            <p className="text-center text-sm text-gray-700 font-semibold mb-2">
              Scan to open short link
            </p>
            <a
              href={`/s/${qrPreview}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-700 hover:underline text-xs mb-4"
            >
              {window.location.origin}/s/{qrPreview}
            </a>
            <div className="flex gap-2 mt-2">
              <button
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold text-sm shadow"
                onClick={() => {
                  const svg = document.getElementById("qr-big-preview");
                  if (!svg) return;
                  const serializer = new XMLSerializer();
                  const source = serializer.serializeToString(svg);
                  const blob = new Blob([source], { type: "image/svg+xml" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `shortlink-qr-${qrPreview}.svg`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }}
                title="Download QR as SVG"
              >
                Download SVG
              </button>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold text-sm shadow"
                onClick={() => {
                  const svg = document.getElementById("qr-big-preview");
                  const canvas = document.getElementById("qr-canvas");
                  if (!svg || !canvas) return;
                  const svgData = new XMLSerializer().serializeToString(svg);
                  const img = new window.Image();
                  img.onload = function () {
                    const ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    const pngUrl = canvas.toDataURL("image/png");
                    const a = document.createElement("a");
                    a.href = pngUrl;
                    a.download = `shortlink-qr-${qrPreview}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  };
                  img.src =
                    "data:image/svg+xml;base64," +
                    window.btoa(unescape(encodeURIComponent(svgData)));
                }}
                title="Download QR as PNG"
              >
                Download PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
