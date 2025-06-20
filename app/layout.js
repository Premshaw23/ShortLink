import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShortLink – Simple & Private URL Shortener",
  description:
    "Shorten your long URLs quickly with ShortLink. No sign-up, no tracking — just clean, fast, and customizable links.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <Navbar />
          <CookieConsent />
          <Toaster position="top-center" reverseOrder={false} />
          {children}
          <Analytics />
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
