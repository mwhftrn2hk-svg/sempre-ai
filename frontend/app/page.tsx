import Link from "next/link";

export default function Home() {
  return (
    <main style={{minHeight:"100vh", background:"#FFFFFF", fontFamily:"-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"}}>

      <nav style={{borderBottom:"1px solid #F3F4F6", padding:"16px 48px", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
          <div style={{width:"30px", height:"30px", borderRadius:"8px", background:"#1A1A2E", display:"flex", alignItems:"center", justifyContent:"center"}}>
            <span style={{color:"#00D4AA", fontSize:"13px", fontWeight:"bold"}}>S</span>
          </div>
          <span style={{fontWeight:600, color:"#111827", fontSize:"15px"}}>Sempre AI</span>
        </div>
        <div style={{display:"flex", alignItems:"center", gap:"16px"}}>
          <Link href="/sign-in" style={{fontSize:"14px", color:"#6B7280", textDecoration:"none"}}>Sign in</Link>
          <Link href="/sign-up" style={{fontSize:"14px", background:"#1A1A2E", color:"#FFFFFF", padding:"8px 18px", borderRadius:"8px", textDecoration:"none", fontWeight:500}}>Get started</Link>
        </div>
      </nav>

      <div style={{maxWidth:"800px", margin:"0 auto", padding:"96px 48px 64px", textAlign:"center"}}>
        <div style={{display:"inline-flex", alignItems:"center", gap:"8px", background:"#F0FBF8", color:"#0F6E56", fontSize:"12px", fontWeight:500, padding:"6px 14px", borderRadius:"20px", marginBottom:"32px"}}>
          <div style={{width:"6px", height:"6px", borderRadius:"50%", background:"#00D4AA"}}></div>
          Powered by AWS Bedrock + Claude
        </div>

        <h1 style={{fontSize:"52px", fontWeight:700, color:"#111827", lineHeight:1.15, marginBottom:"24px", letterSpacing:"-1px"}}>
          Your dedicated AI agent.<br />
          <span style={{color:"#00D4AA"}}>Always there.</span>
        </h1>

        <p style={{fontSize:"18px", color:"#6B7280", marginBottom:"40px", lineHeight:1.7, maxWidth:"520px", margin:"0 auto 40px"}}>
          Sempre AI gives you a private AI agent running on its own cloud server. Execute code, manage files, and get real work done securely.
        </p>

        <div style={{display:"flex", alignItems:"center", gap:"12px", justifyContent:"center"}}>
          <Link href="/sign-up" style={{background:"#1A1A2E", color:"#FFFFFF", padding:"12px 24px", borderRadius:"10px", textDecoration:"none", fontWeight:500, fontSize:"15px"}}>Start for free</Link>
          <Link href="/sign-in" style={{color:"#6B7280", padding:"12px 24px", borderRadius:"10px", textDecoration:"none", fontWeight:500, fontSize:"15px", border:"1px solid #E5E7EB"}}>Sign in</Link>
        </div>
      </div>

      <div style={{maxWidth:"900px", margin:"0 auto", padding:"0 48px 96px"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"24px"}}>
          <div style={{background:"#F9FAFB", borderRadius:"14px", padding:"28px", border:"1px solid #F3F4F6"}}>
            <div style={{width:"40px", height:"40px", background:"#EEF2FF", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px", fontSize:"20px"}}>
              <span>&#x1F5A5;</span>
            </div>
            <h3 style={{fontWeight:600, color:"#111827", fontSize:"15px", marginBottom:"8px"}}>Dedicated Instance</h3>
            <p style={{fontSize:"13px", color:"#6B7280", lineHeight:1.6}}>Your own EC2 server. No shared resources, complete process and filesystem isolation.</p>
          </div>
          <div style={{background:"#F9FAFB", borderRadius:"14px", padding:"28px", border:"1px solid #F3F4F6"}}>
            <div style={{width:"40px", height:"40px", background:"#FFF7ED", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px", fontSize:"20px"}}>
              <span>&#x26A1;</span>
            </div>
            <h3 style={{fontWeight:600, color:"#111827", fontSize:"15px", marginBottom:"8px"}}>Shell Access</h3>
            <p style={{fontSize:"13px", color:"#6B7280", lineHeight:1.6}}>Your agent can execute commands, manage files, run scripts, and interact with the OS directly.</p>
          </div>
          <div style={{background:"#F9FAFB", borderRadius:"14px", padding:"28px", border:"1px solid #F3F4F6"}}>
            <div style={{width:"40px", height:"40px", background:"#F0FBF8", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px", fontSize:"20px"}}>
              <span>&#x1F512;</span>
            </div>
            <h3 style={{fontWeight:600, color:"#111827", fontSize:"15px", marginBottom:"8px"}}>Enterprise Security</h3>
            <p style={{fontSize:"13px", color:"#6B7280", lineHeight:1.6}}>HTTPS with Let's Encrypt, JWT auth, IAM least-privilege, CloudWatch logging, and CloudTrail.</p>
          </div>
        </div>
      </div>

      <div style={{borderTop:"1px solid #F3F4F6", padding:"24px 48px", textAlign:"center"}}>
        <p style={{fontSize:"13px", color:"#9CA3AF"}}>Sempre AI · Always There. Always Secure.</p>
      </div>

    </main>
  );
}
