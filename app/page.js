import Image from "next/image";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700", "900"],
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="bg-gradient-to-b from-purple-100 to-purple-200 min-h-screen flex items-center justify-center">
      <section className="flex flex-col-reverse md:flex-row items-center max-w-6xl mx-auto px-6 md:px-12 py-12 gap-12">
        {/* Left Section */}
        <div className="flex flex-col gap-6 md:w-1/2 text-center md:text-left">
          <h1
            className={`text-4xl md:text-5xl font-extrabold ${poppins.className} text-purple-800 leading-tight`}
          >
            Simplify Links with <br /> Privacy-First Shortening
          </h1>
          <p className="text-gray-700 text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
            ShortLink makes it effortless to shorten URLs without tracking you.
            No signups, no ads, no BS. Just fast and secure link shortening.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/shorten">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow font-semibold transition">
                🔗 Try Now
              </button>
            </Link>
            <Link
              href="https://github.com/Premshaw23/ShortLink"
              target="_blank"
            >
              <button className="bg-white border border-purple-600 text-purple-600 hover:bg-purple-100 px-8 py-3 rounded-lg shadow font-semibold transition">
                ⭐ GitHub
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            className="rounded-xl shadow-xl"
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
