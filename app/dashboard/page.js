import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { getUserUrls } from "@/models/Url";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Please sign in to view your dashboard.</h1>
        <Link href="/auth/signin">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold">Sign In</button>
        </Link>
      </div>
    );
  }

  // Fetch user links directly from the database
  const urls = await getUserUrls(session.user?.email);

  return (
    <div className="max-w-3xl mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Welcome, {session.user?.name || session.user?.email}!</h1>
      <p className="text-lg text-gray-700 mb-6">Manage your shortened links below.</p>
      <Link href="/shorten">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold mb-6">Shorten a new link</button>
      </Link>
      <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-400 rounded flex items-center gap-3">
        <span className="text-sm text-purple-900">
          <b>Note:</b> Only your own links are shown here. Links created while not signed in expire in <b>24 hours</b> and cannot be managed.
        </span>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Links</h2>
        {urls.length === 0 ? (
          <p className="text-gray-500">No links yet. Create your first one!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr>
                  <th className="p-2 border-b">Short Link</th>
                  <th className="p-2 border-b">Original URL</th>
                  <th className="p-2 border-b">Clicks</th>
                  <th className="p-2 border-b">Created</th>
                  <th className="p-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url, i) => (
                  <tr key={url._id} className={i % 2 === 0 ? "bg-purple-50" : ""}>
                    <td className="p-2 border-b">
                      <Link href={`/s/${url.shortenedUrl}`} className="text-purple-700 underline" target="_blank">
                        /s/{url.shortenedUrl}
                      </Link>
                    </td>
                    <td className="p-2 border-b truncate max-w-xs">{url.originalUrl}</td>
                    <td className="p-2 border-b">{url.clicks || 0}</td>
                    <td className="p-2 border-b">{url.createdAt ? new Date(url.createdAt).toLocaleDateString() : "-"}</td>
                    <td className="p-2 border-b">
                      <Link href={`/stats/${url.shortenedUrl}`}
                        className="text-blue-600 hover:underline mr-2">Analytics</Link>
                      {/* Future: Edit/Delete buttons */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
