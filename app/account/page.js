import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import { User } from "lucide-react";
import { Suspense } from "react";

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <svg
        className="animate-spin h-8 w-8 text-purple-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-label="Loading"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>
      <span className="ml-3 text-purple-700 font-medium">
        Loading account...
      </span>
    </div>
  );
}

export default async function AccountPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="max-w-xl mx-auto mt-24 p-8 bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-2xl border border-purple-100 text-center">
        <h1 className="text-3xl font-extrabold mb-6 text-purple-800 drop-shadow-sm">
          Please sign in to view your account.
        </h1>
        <a href="/auth/signin">
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition mt-2">
            Sign In
          </button>
        </a>
      </div>
    );
  }
  const user = session.user;
  return (
    <div className="max-w-2xl mx-auto mt-16 p-8 bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-2xl border border-purple-100">
      <h1
        className="text-4xl font-extrabold mb-6 text-purple-800 drop-shadow-sm"
        tabIndex={0}
      >
        Account Details
      </h1>
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        {user?.image ? (
          <Image
            src={user.image}
            alt={user?.name || user?.email || "User"}
            width={64}
            height={64}
            className="rounded-full border-2 border-purple-300 shadow-lg bg-white"
            aria-label="User avatar"
          />
        ) : (
          <span
            className="rounded-full border-2 border-purple-300 shadow-lg bg-white flex items-center justify-center w-16 h-16"
            aria-label="User avatar placeholder"
          >
            <User size={40} className="text-purple-400" />
          </span>
        )}
        <div className="flex flex-col items-center sm:items-start">
          <div
            className="font-bold text-2xl text-purple-900 mb-1"
            tabIndex={0}
          >
            {user?.name || "No Name"}
          </div>
          <div
            className="text-gray-600 text-base"
            tabIndex={0}
          >
            {user?.email}
          </div>
        </div>
      </div>
      <div className="mb-8 p-4 bg-purple-50 border-l-4 border-purple-300 rounded-xl flex items-center gap-3">
        <span className="text-purple-900 text-base">
          <b>Note:</b> More account management features coming soon.
        </span>
      </div>
      <button
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400 transition mb-2 shadow-lg"
        aria-label="Edit account (coming soon)"
        disabled
      >
        Edit Account (Coming Soon)
      </button>
      {/* Toast container for future feedback */}
      <div
        id="toast-root"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50"
      ></div>
    </div>
  );
}
