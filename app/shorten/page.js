"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ClipboardCopy, Check } from "lucide-react";

const ShortenPage = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortened, setCustomShortened] = useState("");
  const [expirationDays, setExpirationDays] = useState(7);
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
      toast.error("Please enter a valid URL (http:// or https://)");
      return;
    }

    const data = { originalUrl, customShortened, expirationDays };

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (response.ok) {
        setShortenedUrl(result.shortenedUrl);
        toast.success("URL shortened successfully!");
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto p-6 py-10 bg-slate-200 shadow-xl shadow-stone-400 rounded-xl my-20">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-6">
        URL Shortener
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Original URL */}
        <div>
          <label
            htmlFor="originalUrl"
            className="block text-lg font-medium text-gray-700"
          >
            Enter URL:
          </label>
          <input
            type="text"
            id="originalUrl"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Custom alias */}
        <div>
          <label
            htmlFor="customShortened"
            className="block text-lg font-medium text-gray-700"
          >
            Custom Alias (Optional):
          </label>
          <input
            type="text"
            id="customShortened"
            value={customShortened}
            onChange={(e) => setCustomShortened(e.target.value)}
            placeholder="e.g., my-url"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Expiration input */}
        <div>
          <label
            htmlFor="expirationDays"
            className="block text-lg font-medium text-gray-700"
          >
            Expiration (in days):
          </label>
          <input
            type="number"
            id="expirationDays"
            min={1}
            max={365}
            value={expirationDays}
            onChange={(e) => setExpirationDays(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full flex justify-center items-center bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? (
            <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
          ) : null}
          Shorten URL
        </button>
      </form>

      {/* Result */}
      {shortenedUrl && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-700 mb-2">
            Shortened URL:
          </p>
          <div className="flex justify-center items-center gap-2 bg-white p-2 rounded-lg shadow-inner">
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 break-all"
            >
              {shortenedUrl}
            </a>
            <button
              onClick={handleCopy}
              className="text-purple-600 hover:text-purple-800"
              title="Copy"
            >
              {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortenPage;
