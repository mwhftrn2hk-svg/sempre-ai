import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-2 text-[#00D4AA] text-sm tracking-[0.3em] uppercase">
          Always There
        </div>
        <h1 className="text-7xl font-bold text-white tracking-wider mb-2">
          SEMPRE
        </h1>
        <h2 className="text-3xl font-light text-[#00D4AA] tracking-[0.5em] mb-8">
          AI
        </h2>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed">
          Your dedicated AI agent running on its own private server.
          Always on. Always yours.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-up"
            className="px-8 py-3 bg-[#00D4AA] text-[#1A1A2E] font-semibold rounded-lg hover:bg-[#00bfa0] transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-3 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-400 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
      <div className="absolute bottom-8 text-gray-600 text-sm">
        Sempre AI · Always There. Always Secure.
      </div>
    </main>
  );
}
