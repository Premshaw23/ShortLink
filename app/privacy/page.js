import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Privacy Policy</h1>
      <p className="mb-4 text-gray-700">We value your privacy. This policy explains what data we collect, how we use it, and your rights.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">What We Collect</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Shortened URLs and associated analytics (clicks, referrers, device/browser info, and IP address).</li>
        <li>Account information if you sign up (email, name, Google profile image).</li>
        <li>Cookies for authentication and analytics (only if you consent).</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Data</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>To provide analytics and improve the service.</li>
        <li>To secure your account and links.</li>
        <li>We do not sell your data or use it for advertising.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Opt out of analytics by declining cookies.</li>
        <li>Request deletion of your account and data.</li>
        <li>Contact us for any privacy concerns.</li>
      </ul>
      <p className="text-gray-600 mt-8">See also our <Link href="/terms" className="underline text-purple-700">Terms of Service</Link>.</p>
    </div>
  );
}
