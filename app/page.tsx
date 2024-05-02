import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-300">
        <div className="flex flex-col items-center justify-center gap-4">
          <Link href="/login">
            <button className="bg-blue-500 text-white rounded-md p-2">Login</button>
          </Link>
          <Link href="/register">
            <button className="bg-blue-500 text-white rounded-md p-2">Register</button>
          </Link>
        </div>
    </main>
  );
}
