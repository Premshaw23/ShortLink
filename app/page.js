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
      <section className="flex flex-col-reverse md:flex-row items-center max-w-6xl mx-auto px-4 md:px-10 py-16 gap-16">
        {/* Left Section */}
        <div className="flex flex-col gap-8 md:w-1/2 text-center md:text-left">
          <h1
            className={`text-5xl md:text-6xl font-extrabold ${poppins.className} text-purple-800 leading-tight drop-shadow-lg flex flex-wrap items-center gap-2 justify-center md:justify-start`}
          >
            <Sparkles className="inline text-purple-400 mb-2 animate-bounce-slow" size={40} />
            Shorten URLs Instantly
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent animate-gradient-x">
              Private. Fast. Effortless.
            </span>
          </h1>
          <p className="text-gray-700 text-xl leading-relaxed max-w-lg mx-auto md:mx-0">
            ShortLink lets you create short, easy-to-share links <b>without tracking or ads</b>.<br />No sign up required. No clutter. Just simple, secure, privacy-first link shortening for everyone.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start mt-2">
            <Link href="/shorten" className="flex-1 min-w-[180px]">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow-lg font-semibold text-lg transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-400">
                <ShieldCheck size={22} /> Get Started
              </button>
            </Link>
            <Link href="/stats" className="flex-1 min-w-[180px]">
              <button className="w-full bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 px-8 py-3 rounded-lg shadow font-semibold text-lg transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-200">
                <BarChart2 size={22} /> View Analytics
              </button>
            </Link>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
              className="flex-1 min-w-[180px]"
            >
              <button className="w-full bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 px-8 py-3 rounded-lg shadow font-semibold text-lg transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-200">
                ⭐ GitHub
              </button>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
            <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium text-sm shadow animate-fade-in">
              <ShieldCheck size={16} /> No Tracking
            </span>
            <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium text-sm shadow animate-fade-in delay-100">
              <BarChart2 size={16} /> Free Analytics
            </span>
            <span className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-medium text-sm shadow animate-fade-in delay-200">
              <Sparkles size={16} /> Always Free
            </span>
          </div>
        </div>
        {/* Right Section */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative group pb-16 md:pb-20 flex items-end">
            <Image
              className="rounded-2xl shadow-2xl border-4 border-purple-200 group-hover:scale-105 transition-transform duration-300 bg-white"
              alt="Illustration of privacy-first URL shortening"
              src="/vector.jpg"
              width={480}
              height={480}
              priority
            />
            <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-full bg-white/90 border border-purple-200 rounded-xl px-6 py-2 shadow-lg text-purple-700 font-semibold text-lg backdrop-blur-md animate-fade-in whitespace-nowrap mt-4">
              100% Open Source & Privacy-First
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
