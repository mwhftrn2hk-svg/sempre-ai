"use client";

import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function ChatInterface({ token }: { token: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const wsUrl = apiUrl.replace("http", "ws");
    const ws = new WebSocket(`${wsUrl}/chat/ws?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setConnecting(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "connected") {
        setConnected(true);
        setMessages([{ role: "assistant", content: data.message }]);
      } else if (data.type === "message") {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } else if (data.type === "error") {
        setMessages((prev) => [...prev, { role: "system", content: `Error: ${data.message}` }]);
      }
    };

    ws.onclose = () => { setConnected(false); setConnecting(false); };
    ws.onerror = () => {
      setConnecting(false);
      setMessages([{ role: "system", content: "Could not connect to agent. Please refresh." }]);
    };

    return () => ws.close();
  }, [token, apiUrl]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    const message = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    wsRef.current.send(JSON.stringify({ message }));
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-4xl w-full mx-auto px-4 py-6 h-[calc(100vh-65px)]">
      {connecting && (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="text-[#00D4AA] text-lg mb-2">Connecting to your agent...</div>
            <div className="text-gray-500 text-sm">This may take a moment</div>
          </div>
        </div>
      )}
      {!connecting && (
        <>
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#00D4AA] text-[#1A1A2E] font-medium"
                    : msg.role === "system"
                    ? "bg-red-900/30 text-red-400 border border-red-800"
                    : "bg-gray-800 text-gray-200"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={connected ? "Message Sempre AI..." : "Reconnecting..."}
              disabled={!connected}
              rows={1}
              className="flex-1 bg-gray-800 text-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#00D4AA] placeholder-gray-500 disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!connected || !input.trim()}
              className="px-5 py-3 bg-[#00D4AA] text-[#1A1A2E] font-semibold rounded-xl text-sm hover:bg-[#00bfa0] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className={`text-xs ${connected ? "text-[#00D4AA]" : "text-gray-600"}`}>
              {connected ? "● Connected" : "○ Disconnected"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
