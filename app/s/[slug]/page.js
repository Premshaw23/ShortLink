"use client";

import { useEffect, useState,use } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const RedirectPage = ({ params }) => {
  const { slug } = use(params);
  const router = useRouter();

  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);


  const toggleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const fetchUrlDetails = async () => {
      try {
        const res = await fetch(`/api/resolve/${slug}`);
        let data = {};
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        if (!res.ok) {
          toast.error(data.message || "Invalid or expired link.");
          router.replace("/expired");
          return;
        }
        if (data.passwordProtected) {
          setIsProtected(true);
        } else {
          setRedirecting(true);
          router.replace(data.originalUrl);
        }
      } catch (err) {
        toast.error(err.message || "Invalid or expired link.");
        setTimeout(() => router.replace("/expired"), 1500);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUrlDetails();
  }, [slug, router]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/resolve/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Incorrect password");
      } else {
        router.replace(data.originalUrl);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
      setPassword("");
    }
  };

  if (loading||redirecting) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-10 text-center flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-purple-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <p className="text-2xl font-semibold text-purple-700">
            {redirecting ? "🔁 Redirecting..." : "Loading..."}
          </p>
          <p className="mt-2 text-gray-500 text-base">
            Please wait while we process your request.
          </p>
        </div>
      </div>
    );
  }
  

  if (!isProtected) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 px-4">
      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-4">
          🔒 Password Required
        </h2>
        <p className="text-gray-600 text-center mb-6">
          This link is protected. Please enter the password to continue.
        </p>

        {/* Password Input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-lg"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`mt-6 w-full py-3 rounded-lg text-white font-semibold transition ${
            submitting
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {submitting ? "Verifying..." : "Unlock URL"}
        </button>
      </form>
    </div>
  );
};

export default RedirectPage;
