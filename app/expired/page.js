export default function ExpiredPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50">
      <div className="bg-white shadow-md p-8 rounded-xl max-w-lg text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">
          Link Expired
        </h1>
        <p className="text-gray-600">
          Sorry, this shortened link has expired. You can shorten a new URL from
          the homepage.
        </p>
      </div>
    </div>
  );
}
