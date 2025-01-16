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
    <main className="home bg-gradient-to-b from-purple-100 to-purple-200 min-h-screen flex items-center justify-center">
      <section className="flex flex-col-reverse md:flex-row items-center max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Left Section */}
        <div className="flex flex-col gap-6 md:w-1/2 text-center md:text-left">
          <h1
            className={`text-4xl md:text-5xl font-bold ${poppins.className} text-purple-800`}
          >
            The Best URL Shortener in the Market
          </h1>
          <p className="text-gray-700 leading-relaxed max-w-lg mx-auto md:mx-0">
            Simplify your links without compromising your privacy. No tracking,
            no personal data required—just quick, straightforward link
            shortening for your convenience.
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <Link href="/shorten">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-purple-700 transition">
                Try Now
              </button>
            </Link>
            <Link href="/s/github">
              <button className="bg-white border border-purple-600 text-purple-600 px-8 py-3 rounded-lg shadow-md hover:bg-purple-100 transition">
                GitHub
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative flex justify-center items-center md:w-1/2">
          <Image
            className="rounded-lg shadow-lg w-auto h-auto"
            alt="Vector Illustration"
            src="/vector.jpg"
            width={500}
            height={500}
            priority={true}
          />
        </div>
      </section>
    </main>
  );
}
