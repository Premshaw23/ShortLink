"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ClipboardCopy, Check } from "lucide-react";

const ShortenPage = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortened, setCustomShortened] = useState("");
  const [expirationDays, setExpirationDays] = useState(2);
  const [password, setPassword] = useState(""); // 🔧 NEW
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
      toast.error("Please enter a valid URL (http:// or https://)");
      return;
    }

    const data = {
      originalUrl,
      customShortened,
      expirationDays,
      password, // 🔧 INCLUDE password
    };

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

  const handleClear = () => {
    setOriginalUrl("");
    setCustomShortened("");
    setPassword("");
    setExpirationDays(2);
    setShortenedUrl("");
    setCopied(false);
  };
  

  return (
    <div className="max-w-2xl w-full mx-auto p-6 sm:p-10 bg-white shadow-xl shadow-gray-500 rounded-2xl my-10 sm:my-10">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-8">
        🔗 URL Shortener
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Original URL */}
        <div>
          <label
            htmlFor="originalUrl"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Original URL
          </label>
          <input
            type="url"
            id="originalUrl"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Custom Alias */}
        <div>
          <label
            htmlFor="customShortened"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Custom Alias (Optional)
          </label>
          <input
            type="text"
            id="customShortened"
            value={customShortened}
            onChange={(e) => setCustomShortened(e.target.value)}
            placeholder="e.g., my-link"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Password (Optional)
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Protect your link"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Expiration */}
        <div>
          <label
            htmlFor="expirationDays"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Expiration (in days)
          </label>
          <input
            type="number"
            id="expirationDays"
            min={1}
            max={365}
            value={expirationDays}
            onChange={(e) => setExpirationDays(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Buttons Section */}
        <div className="space-y-2 mt-4">
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-lg font-semibold flex justify-center items-center"
          >
            {loading && (
              <span className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
            )}
            Shorten URL
          </button>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={handleClear}
            className="w-full bg-gray-300 hover:bg-gray-400 transition text-gray-800 py-3 rounded-lg font-semibold"
          >
            Clear All
          </button>
        </div>
      </form>

      {/* Result */}
      {shortenedUrl && (
        <div className="mt-8 transition-all duration-500 ease-in-out opacity-100">
          <p className="text-center text-lg font-medium text-gray-800 mb-2">
            Shortened URL:
          </p>
          <div className="flex justify-center items-center gap-2 bg-gray-100 px-4 py-3 rounded-lg shadow-inner break-all">
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {shortenedUrl}
            </a>
            <button
              onClick={handleCopy}
              className="text-purple-600 hover:text-purple-800 transition"
              title="Copy to clipboard"
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
