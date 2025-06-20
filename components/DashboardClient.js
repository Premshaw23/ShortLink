"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, BarChart2, FileDown, Link2 } from "lucide-react";

export default function DashboardClient({ urls, userEmail }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const pageSize = 10;
  const router = useRouter();

  const filteredUrls = urls.filter((url) =>
    url.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
    (url.shortenedUrl && url.shortenedUrl.toLowerCase().includes(search.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filteredUrls.length / pageSize));
  const pagedUrls = filteredUrls.slice((page - 1) * pageSize, page * pageSize);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this link?")) return;
    setDeleting(true);
    const res = await fetch("/api/deleteurl", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, owner: userEmail }),
    });
    setDeleting(false);
    if (res.ok) router.refresh();
    else alert("Delete failed");
  }

  async function handleBulkDelete() {
    if (!confirm("Delete selected links?")) return;
    setDeleting(true);
    for (const id of selected) {
      await fetch("/api/deleteurl", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, owner: userEmail }),
      });
    }
    setDeleting(false);
    setSelected([]);
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-8 bg-purple-50 border border-purple-100 rounded-xl p-5 shadow-sm">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by original URL or short link..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          aria-label="Search links"
        />
        <button
          onClick={handleBulkDelete}
          disabled={selected.length === 0 || deleting}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Delete selected links"
        >
          Delete Selected
        </button>
        <button
          onClick={() => {
            const csv = [
              ["Short Link", "Original URL", "Clicks", "Created"],
              ...urls.map((u) => [
                `/s/${u.shortenedUrl}`,
                u.originalUrl,
                u.clicks || 0,
                u.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : "-"
              ])
            ].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "my-links.csv";
            a.click();
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-green-400 inline-flex items-center gap-1"
          aria-label="Export links as CSV"
        >
          <FileDown size={16} className="inline" aria-hidden="true" /> Export CSV
        </button>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Links</h2>
        {urls.length === 0 ? (
          <p className="text-gray-500">No links yet. Create your first one!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left" aria-label="Your links table">
              <thead>
                <tr>
                  <th className="p-2 border-b"><input type="checkbox" onChange={e => setSelected(e.target.checked ? pagedUrls.map(u => u._id) : [])} checked={pagedUrls.length > 0 && pagedUrls.every(u => selected.includes(u._id))} aria-label="Select all links on page" /></th>
                  <th className="p-2 border-b"><Link2 className="inline mr-1 text-purple-400" aria-hidden="true" />Short Link</th>
                  <th className="p-2 border-b">Original URL</th>
                  <th className="p-2 border-b"><BarChart2 className="inline mr-1 text-purple-400" aria-hidden="true" />Clicks</th>
                  <th className="p-2 border-b">Created</th>
                  <th className="p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedUrls.map((url, i) => (
                  <tr key={url._id} className={i % 2 === 0 ? "bg-purple-50" : ""}>
                    <td className="p-2 border-b"><input type="checkbox" checked={selected.includes(url._id)} onChange={e => setSelected(e.target.checked ? [...selected, url._id] : selected.filter(id => id !== url._id))} aria-label={`Select link ${url.shortenedUrl}`} /></td>
                    <td className="p-2 border-b">
                      <Link href={`/s/${url.shortenedUrl}`} className="text-purple-700 underline focus:outline-none focus:ring-2 focus:ring-purple-400" target="_blank" aria-label={`Open short link /s/${url.shortenedUrl}`}>/s/{url.shortenedUrl}</Link>
                    </td>
                    <td className="p-2 border-b truncate max-w-xs" title={url.originalUrl}>{url.originalUrl}</td>
                    <td className="p-2 border-b">{url.clicks || 0}</td>
                    <td className="p-2 border-b">{url.createdAt ? new Date(url.createdAt).toISOString().slice(0, 10) : "-"}</td>
                    <td className="p-2 border-b">
                      <button onClick={() => handleDelete(url._id)} className="text-red-600 hover:underline mr-2 focus:outline-none focus:ring-2 focus:ring-red-400 inline-flex items-center gap-1" disabled={deleting} aria-label={`Delete link /s/${url.shortenedUrl}`}>
                        <Trash2 size={16} className="inline" aria-hidden="true" /> Delete
                      </button>
                      <Link href={`/stats/${url.shortenedUrl}`} className="text-blue-600 hover:underline mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400 inline-flex items-center gap-1" aria-label={`View analytics for /s/${url.shortenedUrl}`}>
                        <BarChart2 size={16} className="inline" aria-hidden="true" /> Analytics
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-8 gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-purple-100 text-purple-700 font-semibold disabled:opacity-50">Prev</button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 rounded ${page === i + 1 ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-700"} font-semibold`}>{i + 1}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-purple-100 text-purple-700 font-semibold disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
