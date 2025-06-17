export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-6 py-10 bg-white shadow rounded-lg">
        <h1 className="text-4xl font-bold text-purple-700">
          404 - Link Not Found
        </h1>
        <p className="mt-4 text-gray-600">
          Oops! The short link you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}
