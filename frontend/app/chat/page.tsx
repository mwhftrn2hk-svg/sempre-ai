import { auth, currentUser } from "@clerk/nextjs/server";
import ChatInterface from "@/components/ChatInterface";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function ChatPage() {
  const { getToken } = await auth();
  const user = await currentUser();
  const token = await getToken();

  return (
    <main className="flex h-screen bg-[#0F0F14] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 flex-shrink-0 bg-[#141418] border-r border-[#1E1E24] flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-[#1E1E24]">
          <div className="w-7 h-7 rounded-lg bg-[#1A1A2E] flex items-center justify-center flex-shrink-0">
            <span className="text-[#00D4AA] text-xs font-bold">S</span>
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">Sempre AI</span>
        </div>

        {/* New chat */}
        <div className="p-3">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-[#1E1E26] hover:text-gray-200 transition-colors border border-[#1E1E2E]">
            <span className="text-lg leading-none">+</span>
            <span>New conversation</span>
          </button>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User */}
        <div className="p-4 border-t border-[#1E1E24] flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-xs text-gray-500 truncate">{user?.emailAddresses[0]?.emailAddress}</span>
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface token={token || ""} />
      </div>
    </main>
  );
}
