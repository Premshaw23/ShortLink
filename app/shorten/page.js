"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { ClipboardCopy, Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";

const generatePassword = () => {
  // Simple strong password generator
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  let pass = "";
  for (let i = 0; i < 12; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

const ShortenPage = () => {
  const { data: session } = useSession();
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortened, setCustomShortened] = useState("");
  const [expirationDateTime, setExpirationDateTime] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      expirationDateTime, // send ISO string
      password,
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
    setExpirationDateTime("");
    setShortenedUrl("");
    setCopied(false);
  };

  const handleSuggestPassword = () => {
    const newPass = generatePassword();
    setPassword(newPass);
    setShowPassword(true);
    toast.success("Strong password suggested!");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-purple-200 via-white to-purple-100 shadow-lg shadow-neutral-500 rounded-3xl my-10 border border-purple-200">
      <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-8 flex items-center justify-center gap-2 drop-shadow">
        <Sparkles className="text-purple-400" size={28} /> URL Shortener
      </h1>

      <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-400 rounded flex items-center gap-3">
        <Sparkles className="text-purple-400" size={24} />
        <span className="text-sm text-purple-900">
          <b>Anonymous links</b> expire in <b>24 hours</b>. <b>Sign in</b> to manage your links, set custom expiration, and access analytics.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Original URL */}
        <div className="bg-white/90 border border-purple-100 rounded-lg p-3 shadow-sm flex flex-col gap-1">
          <label
            htmlFor="originalUrl"
            className="text-sm font-semibold text-gray-800 mb-1"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          />
        </div>

        {/* Custom Alias */}
        <div className="bg-white/90 border border-purple-100 rounded-lg p-3 shadow-sm flex flex-col gap-1">
          <label
            htmlFor="customShortened"
            className="text-sm font-semibold text-gray-800 mb-1"
          >
            Custom Alias (Optional)
          </label>
          <input
            type="text"
            id="customShortened"
            value={customShortened}
            onChange={(e) => setCustomShortened(e.target.value)}
            placeholder="e.g., my-link"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
          />
        </div>

        {/* Password */}
        <div className="bg-white/90 border border-purple-100 rounded-lg p-3 shadow-sm flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2"
          >
            Password (Optional)
            <button
              type="button"
              onClick={handleSuggestPassword}
              className="ml-2 text-purple-600 hover:text-purple-800 text-xs px-2 py-1 rounded border border-purple-200 bg-purple-50 flex items-center gap-1"
              title="Suggest strong password"
            >
              <Sparkles size={14} /> Suggest
            </button>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Protect your link"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow pr-10 focus:outline-none focus:ring-2 focus:ring-purple-300 text-sm"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-700"
              tabIndex={-1}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Expiration */}
        <div className="bg-white/90 border border-purple-100 rounded-lg p-3 shadow-sm flex flex-col gap-1">
          <label
            htmlFor="expirationDateTime"
            className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2"
          >
            {/* Calendar Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {/* Clock Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Expiration (date & time)
          </label>
          <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 w-full max-w-xs">
            <input
              type="datetime-local"
              id="expirationDateTime"
              value={expirationDateTime}
              onChange={(e) => setExpirationDateTime(e.target.value)}
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white text-sm"
              min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)}
              required={!!session}
              disabled={!session}
            />
            {expirationDateTime && (
              <button
                type="button"
                onClick={() => setExpirationDateTime("")}
                className="text-xs text-purple-600 hover:text-purple-900 px-2 py-1 rounded border border-purple-200 bg-white whitespace-nowrap"
                title="Clear date/time"
              >
                Clear
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {session
              ? "Set the exact date and time when the link should expire."
              : "Sign in to set a custom expiration. Anonymous links always expire in 24 hours."}
            {expirationDateTime &&
              new Date(expirationDateTime) < new Date() && (
                <span className="text-red-600 font-semibold ml-2">
                  (Date/time must be in the future)
                </span>
              )}
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition text-white py-2 px-6 rounded-lg font-semibold flex justify-center items-center shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-base"
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
            className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 transition text-gray-800 py-2 px-6 rounded-lg font-semibold shadow focus:outline-none focus:ring-2 focus:ring-purple-200 text-base"
          >
            Clear All
          </button>
        </div>
      </form>

      {/* Result */}
      {shortenedUrl && (
        <div className="mt-8 transition-all duration-500 ease-in-out opacity-100 bg-green-100 border border-green-200 rounded-lg p-4 shadow flex flex-col items-center">
          <p className="text-center text-base font-medium text-gray-800 mb-2">
            Shortened URL:
          </p>
          <div className="flex justify-center items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-inner break-all border border-green-100">
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
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
