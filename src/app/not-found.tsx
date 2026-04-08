import { Header } from "@/components/header";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center  text-center px-4">
        <h2 className="text-orange-600 text-xl font-semibold">Error Page</h2>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-primary">
          Oops! That Page Can’t Be Found.
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          Unfortunately, something went wrong and this page does not exist. Try
          using the search or return to the previous page.
        </p>
        <Link
          href="/"
          className="bg-primary hover:bg-orange-600 text-white font-medium py-2 px-6 rounded-md transition duration-200"
        >
          RETURN TO HOME
        </Link>

        {/* Image Section */}
        <div className="mt-10 w-full max-w-lg">
          <Image
            src="/404.png"
            alt="404 Illustration"
            className="w-full h-auto"
            width={500}
            height={500}
          />
        </div>
      </div>
    </>
  );
}
