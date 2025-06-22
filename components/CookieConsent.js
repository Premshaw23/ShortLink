"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

let showConsentBanner;
export function openConsentBanner() {
  if (showConsentBanner) showConsentBanner();
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
  showConsentBanner = () => setVisible(true);
  const consent = localStorage.getItem("cookie_consent");
  if (!consent) setVisible(true);
  return () => { showConsentBanner = null; };
}, []);

  const handleConsent = (accepted) => {
    localStorage.setItem("cookie_consent", accepted ? "accepted" : "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div className="bg-white border border-purple-200 shadow-lg rounded-xl px-6 py-4 flex flex-col md:flex-row items-center gap-4 max-w-2xl w-full mx-4">
        <span className="text-gray-800 text-sm">
          We use cookies for analytics to improve your experience. See our {" "}
          <Link href="/privacy" className="underline text-purple-700 hover:text-purple-900">Privacy Policy</Link> and {" "}
          <Link href="/terms" className="underline text-purple-700 hover:text-purple-900">Terms</Link>.
        </span>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => handleConsent(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
          >
            Accept
          </button>
          <button
            onClick={() => handleConsent(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
