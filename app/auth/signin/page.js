"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-gradient-to-br from-purple-50 via-white to-purple-100 rounded-2xl shadow-2xl border border-purple-100">
      <h1 className="text-3xl font-extrabold mb-6 text-purple-800 drop-shadow-sm text-center">
        Sign In
      </h1>
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-xl text-sm">
        <b>Note:</b> Currently, the login system does <u>not</u> verify if your
        email is real. Email verification is coming soon!
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-base shadow-sm"
          required
          aria-label="Email"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 text-base shadow-sm"
          required
          aria-label="Password"
          autoComplete="current-password"
        />
        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          disabled={loading}
          aria-busy={loading}
          aria-label="Sign In"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
      <div className="my-6 text-center text-gray-500 flex items-center gap-2">
        <span className="flex-1 h-px bg-purple-200"></span>
        <span className="text-sm">or</span>
        <span className="flex-1 h-px bg-purple-200"></span>
      </div>
      <button
        onClick={() => signIn("google")}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold mb-2 shadow-lg transition"
      >
        Sign in with Google
      </button>
      <p className="text-center text-sm mt-4">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-purple-700 hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
          tabIndex={0}
          aria-label="Go to sign up page"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
