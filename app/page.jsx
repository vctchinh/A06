import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 space-y-4">
      <h1 className="text-4xl font-bold">Welcome to User System</h1>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
