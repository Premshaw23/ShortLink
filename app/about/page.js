import React from "react";
import Link from "next/link";

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-purple-600 mb-10">
          About 
        </h1>

        <div className="space-y-10 text-gray-800 text-lg leading-relaxed">
          {/* Mission */}
          <section>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              🌟 Our Mission
            </h2>
            <p>
              At <strong>ShortLink</strong>, our goal is to make link shortening
              fast, private, and hassle-free. We believe in delivering a smooth
              experience without invading your privacy. No tracking. No
              sign-ups. Just links—simplified.
            </p>
          </section>

          {/* Why Choose Us */}
          <section>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              🚀 Why Choose Us?
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>⚡ Fast and reliable link shortening</li>
              <li>🎯 Custom aliases for memorable URLs</li>
              <li>🛡️ Zero tracking, 100% privacy focused</li>
              <li>💡 Minimal, clean, user-friendly design</li>
              <li>💸 Totally free—forever</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              📬 Get in Touch
            </h2>
            <p>
              We'd love to hear from you! Whether you have feedback, feature
              ideas, or just want to say hello—head over to our{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:underline font-medium"
              >
                Contact
              </Link>{" "}
              page and drop us a message.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
