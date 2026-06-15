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

        <p style={{fontSize:"18px", color:"#6B7280", lineHeight:1.7, maxWidth:"520px", margin:"0 auto 16px"}}>
          Sempre AI gives you a private AI agent running on its own cloud server. Execute code, manage files, and get real work done — securely.
        </p>

        <p style={{fontSize:"15px", color:"#9CA3AF", lineHeight:1.7, maxWidth:"480px", margin:"0 auto 40px"}}>
          Unlike shared AI services, your Sempre agent runs in complete isolation on dedicated infrastructure. It knows your work style, adapts to your needs, and is available the moment you need it.
        </p>

        <div style={{display:"flex", alignItems:"center", gap:"12px", justifyContent:"center", marginBottom:"80px"}}>
          <Link href="/sign-up" style={{background:"#1A1A2E", color:"#FFFFFF", padding:"12px 24px", borderRadius:"10px", textDecoration:"none", fontWeight:500, fontSize:"15px"}}>Start for free</Link>
          <Link href="/sign-in" style={{color:"#6B7280", padding:"12px 24px", borderRadius:"10px", textDecoration:"none", fontWeight:500, fontSize:"15px", border:"1px solid #E5E7EB"}}>Sign in</Link>
        </div>
      </div>

      <div style={{maxWidth:"960px", margin:"0 auto", padding:"0 48px 80px"}}>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:"24px", marginBottom:"64px"}}>
          <div style={{background:"#F9FAFB", borderRadius:"14px", padding:"28px", border:"1px solid #F3F4F6"}}>
            <div style={{width:"40px", height:"40px", background:"#EEF2FF", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px", fontSize:"20px"}}>&#x1F5A5;</div>
            <h3 style={{fontWeight:600, color:"#111827", fontSize:"15px", marginBottom:"8px"}}>Dedicated Instance</h3>
            <p style={{fontSize:"13px", color:"#6B7280", lineHeight:1.6}}>Your own EC2 server. No shared resources, complete process and filesystem isolation from every other user.</p>
          </div>
          <div style={{background:"#F9FAFB", borderRadius:"14px", padding:"28px", border:"1px solid #F3F4F6"}}>
            <div style={{width:"40px", height:"40px", background:"#FFF7ED", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px", fontSize:"20px"}}>&#x26A1;</div>
            <h3 style={{fontWeight:600, color:"#111827", fontSize:"15px", marginBottom:"8px"}}>Shell Access</h3>
            <p style={{fontSize:"13px", color:"#6B7280", lineHeight:1.6}}>Your agent can execute commands, manage files, run scripts, and interact with the OS — with security controls built in.</p>
          </div>
          <div style={{background:"#F9FAFB", borderRadius:"14px", padding:"28px", border:"1px solid #F3F4F6"}}>
            <div style={{width:"40px", height:"40px", background:"#F0FBF8", borderRadius:"10px", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"16px", fontSize:"20px"}}>&#x1F512;</div>
            <h3 style={{fontWeight:600, color:"#111827", fontSize:"15px", marginBottom:"8px"}}>Enterprise Security</h3>
            <p style={{fontSize:"13px", color:"#6B7280", lineHeight:1.6}}>HTTPS with Let's Encrypt, JWT auth, IAM least-privilege, CloudWatch logging, and shell execution hardening.</p>
          </div>
        </div>

        <div style={{borderTop:"1px solid #F3F4F6", paddingTop:"64px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"48px", alignItems:"center", marginBottom:"64px"}}>
          <div>
            <h2 style={{fontSize:"28px", fontWeight:700, color:"#111827", lineHeight:1.3, marginBottom:"16px", letterSpacing:"-0.5px"}}>An agent that knows you.</h2>
            <p style={{fontSize:"15px", color:"#6B7280", lineHeight:1.8, marginBottom:"16px"}}>Sempre AI is built around the idea that your AI agent should feel personal, not generic. It learns your work patterns, adapts to your communication style, and uses its resources intelligently based on who you are and how you work.</p>
            <p style={{fontSize:"15px", color:"#6B7280", lineHeight:1.8}}>Whether you need a quick answer in the middle of a meeting or a deep technical walkthrough at your desk, Sempre adjusts. It's the difference between a tool and a collaborator.</p>
          </div>
          <div style={{background:"#F9FAFB", borderRadius:"16px", padding:"32px", border:"1px solid #F3F4F6"}}>
            <div style={{display:"flex", flexDirection:"column", gap:"20px"}}>
              {[
                {icon:"&#x1F50A;", title:"Voice input", desc:"Speak naturally. Your agent listens."},
                {icon:"&#x1F3AD;", title:"Personalized personality", desc:"Customize how your agent communicates."},
                {icon:"&#x1F9E0;", title:"Adaptive intelligence", desc:"Learns your patterns and anticipates needs."},
                {icon:"&#x1F4F7;", title:"Emotion awareness", desc:"Reads tone and context, not just words."},
              ].map((item, i) => (
                <div key={i} style={{display:"flex", gap:"14px", alignItems:"flex-start"}}>
                  <div style={{width:"36px", height:"36px", background:"#FFFFFF", borderRadius:"8px", border:"1px solid #E5E7EB", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"16px"}} dangerouslySetInnerHTML={{__html:item.icon}} />
                  <div>
                    <p style={{fontWeight:600, color:"#111827", fontSize:"14px", marginBottom:"2px"}}>{item.title}</p>
                    <p style={{fontSize:"13px", color:"#9CA3AF"}}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{background:"#1A1A2E", borderRadius:"16px", padding:"48px", textAlign:"center"}}>
          <h2 style={{fontSize:"26px", fontWeight:700, color:"#FFFFFF", marginBottom:"12px"}}>Built on AWS. Secured by design.</h2>
          <p style={{fontSize:"15px", color:"#9CA3AF", lineHeight:1.7, maxWidth:"520px", margin:"0 auto 32px"}}>Every Sempre instance runs on AWS infrastructure with enterprise-grade security baked in from the start — not bolted on after. IAM least-privilege, real TLS certificates, shell execution hardening, and full audit logging.</p>
          <Link href="/sign-up" style={{background:"#00D4AA", color:"#082E22", padding:"12px 28px", borderRadius:"10px", textDecoration:"none", fontWeight:600, fontSize:"15px", display:"inline-block"}}>Get started for free</Link>
        </div>
      </div>

      <div style={{borderTop:"1px solid #F3F4F6", padding:"24px 48px", textAlign:"center"}}>
        <p style={{fontSize:"13px", color:"#9CA3AF"}}>Sempre AI · Always There. Always Secure.</p>
      </div>

    </main>
  );
}
