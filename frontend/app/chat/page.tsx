import { auth, currentUser } from "@clerk/nextjs/server";
import ChatInterface from "@/components/ChatInterface";
import { UserButton } from "@clerk/nextjs";

export default async function ChatPage() {
  const { getToken } = await auth();
  const user = await currentUser();
  const token = await getToken();

  return (
    <main style={{display:"flex", height:"100vh", background:"#0D0D12", overflow:"hidden"}}>
      <aside style={{width:"240px", flexShrink:0, background:"#111118", borderRight:"1px solid #1E1E28", display:"flex", flexDirection:"column"}}>
        <div style={{padding:"24px 20px", borderBottom:"1px solid #1E1E28", display:"flex", alignItems:"center", gap:"12px"}}>
          <div style={{width:"34px", height:"34px", borderRadius:"10px", background:"#1A1A2E", border:"1px solid #2A2A3E", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
            <span style={{color:"#00D4AA", fontSize:"13px", fontWeight:"bold"}}>S</span>
          </div>
          <span style={{fontWeight:600, color:"#FFFFFF", fontSize:"15px", letterSpacing:"-0.3px"}}>Sempre AI</span>
        </div>
        <div style={{padding:"16px"}}>
          <button style={{width:"100%", display:"flex", alignItems:"center", gap:"10px", padding:"10px 14px", borderRadius:"10px", fontSize:"13px", color:"#6B7280", background:"transparent", border:"1px solid #1E1E28", cursor:"pointer"}}>
            <span style={{fontSize:"18px", lineHeight:1, marginBottom:"1px"}}>+</span>
            <span>New conversation</span>
          </button>
        </div>
        <div style={{flex:1}} />
        <div style={{padding:"16px 20px", borderTop:"1px solid #1E1E28", display:"flex", alignItems:"center", gap:"12px"}}>
          <UserButton afterSignOutUrl="/" />
          <p style={{fontSize:"12px", color:"#4B4B5A", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{user?.emailAddresses[0]?.emailAddress}</p>
        </div>
      </aside>
      <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
        <ChatInterface token={token || ""} />
      </div>
    </main>
  );
}
