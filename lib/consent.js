// Utility to check if analytics are allowed by cookie consent
export function isAnalyticsAllowed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("cookie_consent") === "accepted";
}
