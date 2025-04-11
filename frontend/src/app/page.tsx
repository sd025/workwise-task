import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Train Ticket Booking
      </h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/auth/login" className="px-6 py-3 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
            Login
        </Link>
        <Link href="/auth/signup" className="px-6 py-3 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition">
            Signup
        </Link>
      </div>
    </main>
  );
}
