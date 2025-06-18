"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader, Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function UrlsPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const response = await fetch("/api/fetchdata");
        if (!response.ok) throw new Error("Failed to fetch URLs");

        const data = await response.json();
        setUrls(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-purple-700 text-center mb-8">
        Shortened URLs History
      </h1>

      {loading && (
        <div className="flex flex-col items-center">
          <Loader className="animate-spin text-purple-700 mb-4" size={36} />
          <p className="text-lg text-gray-600">Fetching URLs...</p>
        </div>
      )}

      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {!loading && urls.length === 0 && (
        <p className="text-center text-gray-600 text-lg">
          No shortened URLs found.
        </p>
      )}

      {!loading && urls.length > 0 && (
        <div className="bg-white rounded-xl shadow-md divide-y">
          {urls.map((url) => (
            <div
              key={url._id}
              className="p-5 space-y-2 hover:bg-gray-50 transition"
            >
              <p className="text-gray-800">
                <span className="font-medium">Original:</span>{" "}
                <Link
                  href={url.originalUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline break-all"
                >
                  {url.originalUrl}
                </Link>
              </p>

              <p className="text-gray-800">
                <span className="font-medium">Expires:</span>{" "}
                <span className="text-red-600">
                  {new Date(url.expiresAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </p>

              <div className="flex items-center justify-between gap-4">
                <p className="text-gray-800">
                  <span className="font-medium">Shortened:</span>{" "}
                  <Link
                    href={`/s/${url.shortenedUrl}`}
                    className="text-green-600 hover:underline"
                  >
                    {`${
                      process.env.NEXT_PUBLIC_BASE_URL || "https://short.link"
                    }/s/${url.shortenedUrl}`}
                  </Link>
                </p>

                <button
                  onClick={() =>
                    handleCopy(
                      `${
                        process.env.NEXT_PUBLIC_BASE_URL ||
                        window.location.origin
                      }/s/${url.shortenedUrl}`
                    )
                  }
                  className="text-purple-600 hover:text-purple-800"
                  title="Copy to clipboard"
                  aria-label="Copy shortened URL"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
