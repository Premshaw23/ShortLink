"use client";

import { useState } from "react";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      name,
      email,
      message,
    };

    toast
      .promise(
        emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          templateParams,
          process.env.NEXT_PUBLIC_EMAILJS_USER_ID
        ),
        {
          loading: "Sending message...",
          success: "Message sent successfully! ✅",
          error: "Something went wrong! ❌",
        }
      )
      .then(() => {
        setName("");
        setEmail("");
        setMessage("");
      });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b shadow-md from-purple-50 to-purple-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-8">
          Contact Us
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium mb-1 text-gray-800"
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-lg font-medium mb-1 text-gray-800"
            >
              Your Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
              placeholder="john@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-lg font-medium mb-1 text-gray-800"
            >
              Your Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white font-semibold py-3 rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
};

export default ContactUs;
