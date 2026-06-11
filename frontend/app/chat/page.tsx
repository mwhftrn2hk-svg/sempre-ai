import { auth, currentUser } from "@clerk/nextjs/server";
import ChatInterface from "@/components/ChatInterface";

export default async function ChatPage() {
  const { getToken } = auth();
  const user = await currentUser();
  const token = await getToken();

  return (
    <main className="min-h-screen bg-[#0F0F1A] flex flex-col">
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold tracking-widest">SEMPRE</span>
          <span className="text-[#00D4AA] text-sm tracking-widest">AI</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {user?.emailAddresses[0]?.emailAddress}
          </span>
        </div>
      </nav>
      <ChatInterface token={token || ""} />
    </main>
  );
}
