import Link from "next/link";

export default function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-purple-700">Link Expired</h1>
        <p className="mt-4 text-gray-600">
          Sorry, this link is no longer active or has expired.
        </p>
        <Link
          href="/"
          className="inline-block mt-3 px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold shadow hover:bg-purple-700 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
