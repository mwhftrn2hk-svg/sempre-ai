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
    const wsUrl = apiUrl.replace("https", "wss").replace("http", "ws");
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
        setMessages((prev) => [...prev, { role: "system", content: data.message }]);
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
    <div className="flex flex-col flex-1 max-w-3xl w-full mx-auto px-4 h-[calc(100vh-57px)]">
      {connecting && (
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-[#00D4AA] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Connecting to your agent...</p>
          </div>
        </div>
      )}

      {!connecting && (
        <>
          <div className="flex-1 overflow-y-auto py-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-2xl bg-[#1A1A2E] flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#00D4AA] text-lg font-bold">S</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Sempre AI</h2>
                <p className="text-sm text-gray-400">Your dedicated agent is ready. Ask anything.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-[#1A1A2E] flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-[#00D4AA] text-xs font-bold">S</span>
                  </div>
                )}
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-[#1A1A2E] text-white"
                    : msg.role === "system"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-gray-50 text-gray-800 border border-gray-100"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="pb-6">
            <div className="flex gap-3 items-end border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-gray-300 bg-white shadow-sm">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Sempre AI..."
                disabled={!connected}
                rows={1}
                className="flex-1 text-sm resize-none focus:outline-none placeholder-gray-400 text-gray-900 bg-transparent disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!connected || !input.trim()}
                className="w-8 h-8 bg-[#1A1A2E] text-white rounded-xl text-sm flex items-center justify-center hover:bg-[#2d2d4e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
              >
                ↑
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              {connected ? "● Connected" : "○ Disconnected"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
