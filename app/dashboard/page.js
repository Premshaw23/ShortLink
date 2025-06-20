import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUserUrls } from "@/models/Url";
import Link from "next/link";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="max-w-xl mx-auto mt-24 p-8 bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-2xl border border-purple-100 text-center">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-800 drop-shadow-sm">
          Please sign in to view your dashboard.
        </h1>
        <Link href="/auth/signin">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition mt-2">
            Sign In
          </button>
        </Link>
      </div>
    );
  }

  // Fetch user links directly from the database
  const urls = await getUserUrls(session.user?.email);

  // Before passing urls to DashboardClient, deeply convert all non-plain fields (ObjectId, Date) to strings
  function serializeUrl(url) {
    return {
      ...url,
      _id: url._id?.toString?.() || url._id,
      createdAt: url.createdAt?.toISOString?.() || url.createdAt,
      expiresAt: url.expiresAt?.toISOString?.() || url.expiresAt || null,
      // clickLogs: array of objects, each with timestamp (Date)
      clickLogs: Array.isArray(url.clickLogs)
        ? url.clickLogs.map(log => ({
            ...log,
            timestamp: log.timestamp?.toISOString?.() || log.timestamp,
          }))
        : [],
    };
  }
  const safeUrls = urls.map(serializeUrl);

  return (
    <div className="max-w-4xl mx-auto mt-16 p-8 bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-2xl border border-purple-100">
      <h1 className="text-4xl font-extrabold mb-4 text-purple-800 drop-shadow-sm">
        Welcome, {session.user?.name || session.user?.email}!
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Manage your shortened links below.
      </p>
      <Link href="/shorten">
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold mb-8 shadow-lg transition">
          Shorten a new link
        </button>
      </Link>
      <div className="mb-8 p-4 bg-purple-50 border-l-4 border-purple-400 rounded-xl flex items-center gap-3">
        <span className="text-base text-purple-900">
          <b>Note:</b> Only your own links are shown here. Links created while not signed in expire in{" "}
          <b>24 hours</b> and cannot be managed.
        </span>
      </div>
      <DashboardClient urls={safeUrls} userEmail={session.user?.email} />
    </div>
  );
}
