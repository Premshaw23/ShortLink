import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUserUrls } from "@/models/Url";
import Link from "next/link";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Please sign in to view your dashboard.
        </h1>
        <Link href="/auth/signin">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold">
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
    <div className="max-w-3xl mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {session.user?.name || session.user?.email}!
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Manage your shortened links below.
      </p>
      <Link href="/shorten">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold mb-6">
          Shorten a new link
        </button>
      </Link>
      <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-400 rounded flex items-center gap-3">
        <span className="text-sm text-purple-900">
          <b>Note:</b> Only your own links are shown here. Links created while
          not signed in expire in <b>24 hours</b> and cannot be managed.
        </span>
      </div>
      <DashboardClient urls={safeUrls} userEmail={session.user?.email} />
    </div>
  );
}
