import Image from "next/image";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Sparkles, ShieldCheck, BarChart2 } from "lucide-react";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-purple-100 to-purple-200 min-h-screen flex items-center justify-center">
      <section className="flex flex-col-reverse md:flex-row items-center max-w-6xl mx-auto px-6 md:px-12 py-16 gap-16">
        {/* Left Section */}
        <div className="flex flex-col gap-8 md:w-1/2 text-center md:text-left">
          <h1
            className={`text-5xl md:text-6xl font-extrabold ${poppins.className} text-purple-800 leading-tight drop-shadow-lg flex flex-wrap items-center gap-2 justify-center md:justify-start`}
          >
            <Sparkles className="inline text-purple-400 mb-2" size={40} />
            Simplify Links
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Privacy-First Shortening
            </span>
          </h1>
          <p className="text-gray-700 text-xl leading-relaxed max-w-lg mx-auto md:mx-0">
            ShortLink makes it effortless to shorten URLs without tracking you. No
            signups, no ads, no BS. Just fast and secure link shortening.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start mt-2">
            <Link href="/shorten" className="flex-1 min-w-[180px]">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow-lg font-semibold text-lg transition flex items-center justify-center gap-2">
                <ShieldCheck size={22} /> Try Now
              </button>
            </Link>
            <Link href="/stats" className="flex-1 min-w-[180px]">
              <button className="w-full bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 px-8 py-3 rounded-lg shadow font-semibold text-lg transition flex items-center justify-center gap-2">
                <BarChart2 size={22} /> Analytics
              </button>
            </Link>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
              className="flex-1 min-w-[180px]"
            >
              <button className="w-full bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 px-8 py-3 rounded-lg shadow font-semibold text-lg transition flex items-center justify-center gap-2">
                ⭐ GitHub
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
            <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium text-sm shadow">
              <ShieldCheck size={16} /> No Tracking
            </span>
            <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium text-sm shadow">
              <BarChart2 size={16} /> Analytics
            </span>
            <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium text-sm shadow">
              <Sparkles size={16} /> Free Forever
            </span>
          </div>
        </div>
        {/* Right Section */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            className="rounded-2xl shadow-2xl border-4 border-purple-200"
            alt="URL Shortening Illustration"
            src="/vector.jpg"
            width={480}
            height={480}
            priority
          />
        </div>
      </section>
    </main>
  );
}
