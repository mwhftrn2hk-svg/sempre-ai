import { auth, currentUser } from "@clerk/nextjs/server";
import ChatInterface from "@/components/ChatInterface";
import { UserButton } from "@clerk/nextjs";

export default async function ChatPage() {
  const { getToken } = await auth();
  const user = await currentUser();
  const token = await getToken();

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1A1A2E] flex items-center justify-center">
            <span className="text-[#00D4AA] text-xs font-bold">S</span>
          </div>
          <span className="font-semibold text-gray-900 tracking-tight">Sempre AI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">{user?.emailAddresses[0]?.emailAddress}</span>
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
      <ChatInterface token={token || ""} />
    </main>
  );
}
