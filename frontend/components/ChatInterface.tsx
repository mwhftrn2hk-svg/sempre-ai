"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="my-3 rounded-xl bg-[#0A0A0F] border border-[#2A2A3A] overflow-hidden">
      <div className="px-4 py-2 border-b border-[#2A2A3A] flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#00D4AA] opacity-80"></div>
        <span className="text-xs text-gray-600 font-mono">output</span>
      </div>
      <pre className="px-4 py-3 text-xs text-[#9CA3AF] overflow-x-auto font-mono leading-6">{code}</pre>
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
        return <span key={i} className="whitespace-pre-wrap">{part}</span>;
      })}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[72%] px-5 py-3 rounded-2xl text-sm leading-relaxed bg-[#00D4AA] text-[#082E22] font-medium">
          {msg.content}
        </div>
      </div>
    );
  }

  if (msg.role === "system") {
    return (
      <div className="flex justify-center">
        <div className="px-4 py-2 rounded-lg text-xs text-red-400 bg-red-950/20 border border-red-900/20">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-xl bg-[#1A1A2E] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#2A2A3E]">
        <span className="text-[#00D4AA] text-xs font-bold">S</span>
      </div>
      <div className="max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed bg-[#16161E] text-[#D4D4E8] border border-[#222230]">
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
    <div className="flex flex-col h-full">
      <div className="px-8 py-4 border-b border-[#1E1E26] flex items-center gap-2.5">
        <div className={`w-2 h-2 rounded-full transition-colors ${connected ? "bg-[#00D4AA]" : "bg-gray-700"}`}></div>
        <span className="text-sm text-gray-500">{connected ? "Agent connected" : connecting ? "Connecting..." : "Disconnected"}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-5">
        {connecting && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Starting your agent...</p>
            </div>
          </div>
        )}

        {!connecting && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1A1A2E] flex items-center justify-center mx-auto mb-5 border border-[#2A2A3E]">
                <span className="text-[#00D4AA] text-2xl font-bold">S</span>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Sempre AI</h2>
              <p className="text-sm text-gray-600 max-w-xs leading-relaxed">Your dedicated agent is ready. Run code, manage files, answer questions.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

        {thinking && (
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-xl bg-[#1A1A2E] flex items-center justify-center flex-shrink-0 border border-[#2A2A3E]">
              <span className="text-[#00D4AA] text-xs font-bold">S</span>
            </div>
            <div className="px-5 py-3.5 rounded-2xl bg-[#16161E] border border-[#222230] flex items-center gap-1.5">
              {[0, 150, 300].map((delay, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-gray-600 animate-bounce" style={{animationDelay:`${delay}ms`}}></span>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-8 pb-8 pt-4">
        <div className="flex gap-3 items-end bg-[#111116] border border-[#222230] rounded-2xl px-5 py-4 focus-within:border-[#2A2A3E] transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={connected ? "Message Sempre AI..." : "Connecting..."}
            disabled={!connected}
            rows={1}
            className="flex-1 text-sm resize-none focus:outline-none placeholder-gray-700 text-[#D4D4E8] bg-transparent disabled:opacity-40 leading-relaxed"
            style={{maxHeight:"160px"}}
          />
          <button
            onClick={sendMessage}
            disabled={!connected || !input.trim()}
            className="w-9 h-9 bg-[#00D4AA] text-[#082E22] rounded-xl flex items-center justify-center hover:bg-[#00bfa0] transition-colors disabled:opacity-20 disabled:cursor-not-allowed flex-shrink-0 font-bold text-base"
          >
            ↑
          </button>
        </div>
        <p className="text-xs text-gray-700 text-center mt-3">Sempre AI may make mistakes. Verify important commands before running.</p>
      </div>
    </div>
  );
}
