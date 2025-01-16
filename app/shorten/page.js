"use client";

import { useState } from "react";

const ShortenPage = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customShortened, setCustomShortened] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!originalUrl || !/^https?:\/\//.test(originalUrl)) {
      setErrorMessage("Please enter a valid URL.");
      return;
    }

    const data = { originalUrl, customShortened };
    console.log("data", data);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      console.log(response);
      const result = await response.json();
      if (response.ok) {
        setShortenedUrl(result.shortenedUrl);
        setErrorMessage("");
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while shortening the URL.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 py-10 bg-slate-200 shadow-xl shadow-stone-400 rounded-xl my-20">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-6">
        URL Shortener
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
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
            name="originalUrl"
            placeholder="Enter a valid URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="customShortened"
            className="block text-lg font-medium text-gray-700"
          >
            Custom Shortened URL (Optional):
          </label>
          <input
            type="text"
            id="customShortened"
            name="customShortened"
            placeholder="Choose a custom alias (e.g., 'myurl')"
            value={customShortened}
            onChange={(e) => setCustomShortened(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Shorten URL
        </button>
      </form>

      {shortenedUrl && (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-gray-700">Shortened URL:</p>
          <a
            href={shortenedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            {shortenedUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default ShortenPage;
