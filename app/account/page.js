import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Image from "next/image";
import { User } from "lucide-react";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Please sign in to view your account.</h1>
      </div>
    );
  }
  const user = session.user;
  return (
    <div className="max-w-2xl mx-auto mt-16 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Account Details</h1>
      <div className="flex items-center gap-4 mb-6">
        {user?.image ? (
          <Image
            src={user.image}
            alt={user?.name || user?.email || "User"}
            width={48}
            height={48}
            className="rounded-full border border-purple-300 shadow"
          />
        ) : (
          <span className="rounded-full border border-purple-300 shadow bg-white flex items-center justify-center w-12 h-12">
            <User size={32} className="text-purple-400" />
          </span>
        )}
        <div>
          <div className="font-semibold text-lg">{user?.name || "No Name"}</div>
          <div className="text-gray-600">{user?.email}</div>
        </div>
      </div>
      <p className="text-gray-700">More account management features coming soon.</p>
    </div>
  );
}
