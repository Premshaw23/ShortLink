import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Terms of Service</h1>
      <p className="mb-4 text-gray-700">By using ShortLink, you agree to these terms. Please read them carefully.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Usage</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>Do not use ShortLink for spam, abuse, or illegal content.</li>
        <li>We may remove links that violate our policies.</li>
        <li>Accounts may be suspended for repeated violations.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Liability</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>We provide this service as-is, with no guarantees of uptime or data retention.</li>
        <li>We are not responsible for content shared via shortened links.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Privacy</h2>
      <ul className="list-disc ml-6 text-gray-700 mb-4">
        <li>See our <Link href="/privacy" className="underline text-purple-700">Privacy Policy</Link> for details on data collection and use.</li>
      </ul>
      <p className="text-gray-600 mt-8">Contact us for questions or concerns.</p>
    </div>
  );
}
