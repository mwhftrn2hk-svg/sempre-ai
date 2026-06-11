"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const isSystem = msg.role === "system";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap bg-[#00D4AA] text-[#0A3D2E] font-medium">
          {msg.content}
        </div>
      </div>
    );
  }

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="px-4 py-2 rounded-lg text-xs text-red-400 bg-red-950/30 border border-red-900/30">
          {msg.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-lg bg-[#1A1A2E] flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[#00D4AA] text-xs font-bold">S</span>
      </div>
      <div className="max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed bg-[#1A1A2E] text-[#E2E2EC] border border-[#2A2A3E]">
        {msg.content.includes("```") ? (
          <FormattedMessage content={msg.content} />
        ) : (
          msg.content
        )}
      </div>
    </div>
  );
}

function FormattedMessage({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("```")) {
          const code = part.replace(/```\w*\n?/, "").replace(/```$/, "");
          return (
            <div key={i} className="my-2 rounded-lg bg-[#0D0D12] border border-[#2A2A3E] overflow-hidden">
              <div className="px-3 py-1.5 border-b border-[#2A2A3E] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00D4AA]"></div>
                <span className="text-xs text-gray-500">output</span>
              </div>
              <pre className="px-4 py-3 text-xs text-[#9CA3AF] overflow-x-auto font-mono leading-relaxed">{code}</pre>
            </div>
          );
        }
        return <span key={i} className="whitespace-pre-wrap">{part}</span>;
      })}
    </>
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-3 border-b border-[#1E1E24] flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-[#00D4AA]" : "bg-gray-600"}`}></div>
          <span className="text-sm text-gray-400">{connected ? "Agent connected" : "Connecting..."}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {connecting && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-500">Starting your agent...</p>
            </div>
          </div>
        )}

        {!connecting && messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A2E] flex items-center justify-center mx-auto mb-4 border border-[#2A2A3E]">
                <span className="text-[#00D4AA] text-2xl font-bold">S</span>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Sempre AI</h2>
              <p className="text-sm text-gray-500 max-w-xs">Your dedicated agent is ready. Ask anything — run code, manage files, get answers.</p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}

        {thinking && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-[#1A1A2E] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#00D4AA] text-xs font-bold">S</span>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-[#1A1A2E] border border-[#2A2A3E] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:"0ms"}}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:"150ms"}}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:"300ms"}}></span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-3">
        <div className="flex gap-3 items-end bg-[#141418] border border-[#2A2A3E] rounded-2xl px-4 py-3 focus-within:border-[#3A3A4E] transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={connected ? "Message Sempre AI..." : "Connecting..."}
            disabled={!connected}
            rows={1}
            className="flex-1 text-sm resize-none focus:outline-none placeholder-gray-600 text-[#E2E2EC] bg-transparent disabled:opacity-40"
            style={{maxHeight:"160px"}}
          />
          <button
            onClick={sendMessage}
            disabled={!connected || !input.trim()}
            className="w-8 h-8 bg-[#00D4AA] text-[#0A3D2E] rounded-xl text-sm flex items-center justify-center hover:bg-[#00bfa0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0 font-bold"
          >
            ↑
          </button>
        </div>
        <p className="text-xs text-gray-600 text-center mt-2">Sempre AI may make mistakes. Always verify important commands.</p>
      </div>
    </div>
  );
}
