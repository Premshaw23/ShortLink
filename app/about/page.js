import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg my-10">
      <h1 className="text-4xl font-bold text-center text-purple-600 mb-6">
        About Us
      </h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Our Mission
          </h2>
          <p className="text-lg text-gray-800">
            At ShortLink, our mission is to provide a simple and reliable URL
            shortening service that respects your privacy. We believe that
            sharing links should be easy, quick, and secure. With no unnecessary
            sign-ups or tracking, we aim to deliver the best URL shortening
            experience for everyone.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Why Choose Us?
          </h2>
          <ul className="list-disc pl-5 text-lg text-gray-800 space-y-2">
            <li>Fast and reliable URL shortening</li>
            <li>Customizable short links with optional alias</li>
            <li>No unnecessary tracking or sign-ups required</li>
            <li>Simple, clean, and user-friendly interface</li>
            <li>Completely free to use</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-800">
            We value your feedback and suggestions. If you have any questions,
            or if you'd like to get in touch with our team, feel free to reach
            out to us through the contact form on our{" "}
            <a href="/contact" className="text-blue-500 hover:text-blue-700">
              Contact Us
            </a>{" "}
            page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
