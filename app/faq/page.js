import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-purple-700">Frequently Asked Questions</h1>
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Is ShortLink free to use?</h2>
          <p className="text-gray-700">Yes! ShortLink is 100% free for everyone. No hidden fees, no premium plans.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Do I need to sign up to shorten links?</h2>
          <p className="text-gray-700">No sign-up is required for basic link shortening. However, creating an account lets you manage your links, set custom expiration, and view analytics.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">How long do anonymous links last?</h2>
          <p className="text-gray-700">Links created without an account expire automatically after 24 hours for privacy and security.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">How do I protect a link with a password?</h2>
          <p className="text-gray-700">When shortening a link, enter a password in the form. Only users with the password can access the destination.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">What analytics are available?</h2>
          <p className="text-gray-700">You can view click counts, referrers, device/browser stats, and more. Analytics are only collected if you accept cookies.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">How do I delete my account or links?</h2>
          <p className="text-gray-700">Sign in, go to your dashboard, and use the delete option for links. Account deletion is coming soon. Contact us via the <Link href="/contact" className="underline text-purple-700">Contact</Link> page for urgent requests.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Is my data private?</h2>
          <p className="text-gray-700">Yes. We do not sell your data or use it for advertising. See our <Link href="/privacy" className="underline text-purple-700">Privacy Policy</Link> for details.</p>
        </div>
      </div>
    </div>
  );
}
