"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-300 my-8 rounded-xl">
      <h1 className="text-3xl text-purple-700 font-bold text-center mb-6">Shortened URLs History</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && urls.length === 0 && (
        <p className="text-center text-gray-500">No URLs found.</p>
      )}

      {!loading && urls.length > 0 && (
        <ul className="bg-white shadow-md rounded-lg p-4">
          {urls.map((url) => (
            <li key={url._id} className="border-b py-2 flex flex-col gap-3">
              <p >
                Original URL:{" "}
                <Link href={url.originalUrl} className="text-blue-500 ">
                  {url.originalUrl}
                </Link>
              </p>
              <p>
                Shortened URL:{" "}
                <Link href={`/s/${url.shortenedUrl}`} className="text-green-500 ">
                  {url.shortenedUrl}
                </Link>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
