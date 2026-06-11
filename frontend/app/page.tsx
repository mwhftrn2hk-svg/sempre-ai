import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1A1A2E] flex items-center justify-center">
            <span className="text-[#00D4AA] text-xs font-bold">S</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">Sempre AI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Sign in
          </Link>
          <Link href="/sign-up" className="text-sm bg-[#1A1A2E] text-white px-4 py-2 rounded-lg hover:bg-[#2d2d4e] transition-colors">
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F0FBF8] text-[#0F6E56] text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]"></div>
          Powered by AWS Bedrock + Claude
        </div>

        <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
          Your dedicated AI agent.
          <br />
          <span className="text-[#00D4AA]">Always there.</span>
        </h1>

        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Sempre AI gives you a private AI agent running on its own cloud server.
          Execute code, manage files, and get real work done — securely.
        </p>

        <div className="flex items-center gap-4 justify-center">
          <Link href="/sign-up" className="bg-[#1A1A2E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d2d4e] transition-colors">
            Start for free
          </Link>
          <Link href="/sign-in" className="text-gray-500 px-6 py-3 rounded-lg font-medium hover:text-gray-900 transition-colors border border-gray-200 hover:border-gray-300">
            Sign in
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto px-8 pb-24">
        <div className="grid grid-cols-3 gap-6">
          {[
            { title: "Dedicated Instance", desc: "Your own EC2 server. No shared resources, complete isolation.", icon: "🖥️" },
            { title: "Shell Access", desc: "Your agent can execute commands, manage files, and run scripts.", icon: "⚡" },
            { title: "Enterprise Security", desc: "HTTPS, JWT auth, IAM least-privilege, CloudWatch logging.", icon: "🔒" },
          ].map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-8 py-6 text-center">
        <p className="text-sm text-gray-400">Sempre AI · Always There. Always Secure.</p>
      </div>
    </main>
  );
}
