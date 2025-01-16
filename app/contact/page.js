"use client"
import { useState } from "react";
import emailjs from "emailjs-com";

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Define the parameters to be sent to the EmailJS template
    const templateParams = {
      name,
      email,
      message,
    };

    // Send the email using EmailJS
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, // Replace with your EmailJS service ID
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, // Replace with your EmailJS template ID
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID // Replace with your EmailJS user ID
      )
      .then(
        (response) => {
          setSuccessMessage("Your message has been sent successfully!");
          setErrorMessage(""); // Clear previous errors
          setName("");
          setEmail("");
          setMessage("");
        },
        (error) => {
          setErrorMessage("Oops! Something went wrong. Please try again.");
          setSuccessMessage(""); // Clear previous success messages
        }
      );
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-400 rounded-xl shadow-lg my-10">
      <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Contact Us
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label
            htmlFor="name"
            className="block text-lg font-medium text-gray-700"
          >
            Your Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your name"
            required
          />
        </div>

        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700"
          >
            Your Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Message Input */}
        <div>
          <label
            htmlFor="message"
            className="block text-lg font-medium text-gray-700"
          >
            Your Message:
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            rows="3"
            placeholder="Write your message"
            required
          />
        </div>

        {/* Error or Success Messages */}
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactUs;
