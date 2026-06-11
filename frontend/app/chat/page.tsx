import { auth, currentUser } from "@clerk/nextjs/server";
import ChatInterface from "@/components/ChatInterface";
import { UserButton } from "@clerk/nextjs";

export default async function ChatPage() {
  const { getToken } = await auth();
  const user = await currentUser();
  const token = await getToken();

  return (
    <main className="flex h-screen bg-[#0F0F14] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#111116] border-r border-[#1E1E26] flex flex-col">
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="w-8 h-8 rounded-xl bg-[#1A1A2E] flex items-center justify-center flex-shrink-0 border border-[#2A2A3E]">
            <span className="text-[#00D4AA] text-sm font-bold">S</span>
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">Sempre AI</span>
        </div>

        <div className="px-3 mb-4">
          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-[#1A1A22] hover:text-gray-300 transition-colors border border-[#1E1E26]">
            <span className="text-base leading-none pb-0.5">+</span>
            <span>New conversation</span>
          </button>
        </div>

        <div className="flex-1" />

        <div className="p-4 border-t border-[#1E1E26] flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatInterface token={token || ""} />
      </div>
    </main>
  );
}
