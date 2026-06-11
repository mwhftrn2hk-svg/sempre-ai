"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div style={{margin:"12px 0", borderRadius:"10px", background:"#0A0A0F", border:"1px solid #2A2A3A", overflow:"hidden"}}>
      <div style={{padding:"8px 16px", borderBottom:"1px solid #2A2A3A", display:"flex", alignItems:"center", gap:"8px"}}>
        <div style={{width:"8px", height:"8px", borderRadius:"50%", background:"#00D4AA", opacity:0.8}}></div>
        <span style={{fontSize:"11px", color:"#4B4B5A", fontFamily:"monospace"}}>output</span>
      </div>
      <pre style={{padding:"16px", fontSize:"12px", color:"#9CA3AF", overflowX:"auto", fontFamily:"monospace", lineHeight:1.6}}>{code}</pre>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div>
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
          return <CodeBlock key={i} code={code} />;
        }
        return <span key={i} style={{whiteSpace:"pre-wrap"}}>{part}</span>;
      })}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    return (
      <div style={{display:"flex", justifyContent:"flex-end", marginBottom:"20px"}}>
        <div style={{maxWidth:"68%", padding:"14px 18px", borderRadius:"18px", fontSize:"14px", lineHeight:1.6, background:"#00D4AA", color:"#082E22", fontWeight:500}}>
          {msg.content}
        </div>
      </div>
    );
  }
  if (msg.role === "system") {
    return (
      <div style={{display:"flex", justifyContent:"center", marginBottom:"20px"}}>
        <div style={{padding:"8px 16px", borderRadius:"8px", fontSize:"12px", color:"#F87171", background:"rgba(127,29,29,0.2)", border:"1px solid rgba(127,29,29,0.3)"}}>
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div style={{display:"flex", gap:"14px", alignItems:"flex-start", marginBottom:"20px"}}>
      <div style={{width:"34px", height:"34px", borderRadius:"10px", background:"#1A1A2E", border:"1px solid #2A2A3E", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"2px"}}>
        <span style={{color:"#00D4AA", fontSize:"12px", fontWeight:"bold"}}>S</span>
      </div>
      <div style={{maxWidth:"74%", padding:"14px 18px", borderRadius:"18px", fontSize:"14px", lineHeight:1.6, background:"#17171F", color:"#D4D4E8", border:"1px solid #222230"}}>
        <MessageContent content={msg.content} />
      </div>
    </div>
  );
}

export default function ChatInterface({ token }: { token: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [thinking, setThinking] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const wsUrl = apiUrl.replace("https", "wss").replace("http", "ws");
    const ws = new WebSocket(`${wsUrl}/chat/ws?token=${token}`);
    wsRef.current = ws;
    ws.onopen = () => setConnecting(false);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setThinking(false);
      if (data.type === "connected") {
        setConnected(true);
        setMessages([{ role: "assistant", content: data.message }]);
      } else if (data.type === "message") {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } else if (data.type === "error") {
        setMessages((prev) => [...prev, { role: "system", content: data.message }]);
      }
    };
    ws.onclose = () => { setConnected(false); setConnecting(false); setThinking(false); };
    ws.onerror = () => {
      setConnecting(false);
      setThinking(false);
      setMessages([{ role: "system", content: "Could not connect to agent. Please refresh." }]);
    };
    return () => ws.close();
  }, [token, apiUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const message = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setThinking(true);
    wsRef.current.send(JSON.stringify({ message }));
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div style={{display:"flex", flexDirection:"column", height:"100%"}}>
      <div style={{padding:"16px 32px", borderBottom:"1px solid #1E1E28", display:"flex", alignItems:"center", gap:"10px"}}>
        <div style={{width:"8px", height:"8px", borderRadius:"50%", background: connected ? "#00D4AA" : "#374151"}}></div>
        <span style={{fontSize:"13px", color:"#6B7280"}}>{connected ? "Agent connected" : connecting ? "Connecting..." : "Disconnected"}</span>
      </div>

      <div style={{flex:1, overflowY:"auto", padding:"40px 32px 20px"}}>
        {connecting && (
          <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100%"}}>
            <div style={{textAlign:"center"}}>
              <div style={{width:"32px", height:"32px", border:"2px solid #00D4AA", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 1s linear infinite", margin:"0 auto 16px"}}></div>
              <p style={{fontSize:"13px", color:"#4B4B5A"}}>Starting your agent...</p>
            </div>
          </div>
        )}

        {!connecting && messages.length === 0 && (
          <div style={{display:"flex", alignItems:"center", justifyContent:"center", height:"100%"}}>
            <div style={{textAlign:"center"}}>
              <div style={{width:"64px", height:"64px", borderRadius:"18px", background:"#1A1A2E", border:"1px solid #2A2A3E", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px"}}>
                <span style={{color:"#00D4AA", fontSize:"24px", fontWeight:"bold"}}>S</span>
              </div>
              <h2 style={{fontSize:"18px", fontWeight:600, color:"#FFFFFF", marginBottom:"8px"}}>Sempre AI</h2>
              <p style={{fontSize:"13px", color:"#4B4B5A", maxWidth:"280px", lineHeight:1.6}}>Your dedicated agent is ready. Run code, manage files, answer questions.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

        {thinking && (
          <div style={{display:"flex", gap:"14px", alignItems:"flex-start", marginBottom:"20px"}}>
            <div style={{width:"34px", height:"34px", borderRadius:"10px", background:"#1A1A2E", border:"1px solid #2A2A3E", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
              <span style={{color:"#00D4AA", fontSize:"12px", fontWeight:"bold"}}>S</span>
            </div>
            <div style={{padding:"14px 18px", borderRadius:"18px", background:"#17171F", border:"1px solid #222230", display:"flex", gap:"6px", alignItems:"center"}}>
              <span style={{width:"6px", height:"6px", borderRadius:"50%", background:"#4B4B5A", display:"inline-block", animation:"bounce 1.2s infinite"}}></span>
              <span style={{width:"6px", height:"6px", borderRadius:"50%", background:"#4B4B5A", display:"inline-block", animation:"bounce 1.2s 0.2s infinite"}}></span>
              <span style={{width:"6px", height:"6px", borderRadius:"50%", background:"#4B4B5A", display:"inline-block", animation:"bounce 1.2s 0.4s infinite"}}></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={{padding:"20px 32px 28px"}}>
        <div style={{display:"flex", gap:"12px", alignItems:"flex-end", background:"#17171F", border:"1px solid #2A2A3A", borderRadius:"16px", padding:"16px 18px"}}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={connected ? "Message Sempre AI..." : "Connecting..."}
            disabled={!connected}
            rows={1}
            style={{flex:1, fontSize:"14px", resize:"none", outline:"none", color:"#E2E2F0", background:"transparent", border:"none", lineHeight:1.6, fontFamily:"inherit", maxHeight:"160px", placeholder:"#3A3A4A"}}
          />
          <button
            onClick={sendMessage}
            disabled={!connected || !input.trim()}
            style={{width:"36px", height:"36px", background:"#00D4AA", color:"#082E22", borderRadius:"10px", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontWeight:"bold", fontSize:"16px", opacity: (!connected || !input.trim()) ? 0.3 : 1}}
          >
            ↑
          </button>
        </div>
        <p style={{fontSize:"11px", color:"#2A2A3A", textAlign:"center", marginTop:"10px"}}>Sempre AI may make mistakes. Verify important commands before running.</p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        textarea::placeholder { color: #3A3A4A; }
      `}</style>
    </div>
  );
}
