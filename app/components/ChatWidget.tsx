"use client";

import { useState, useRef, useEffect } from "react";
import { ChatFAB } from "./ChatFAB";
import { ChatPanel } from "./ChatPanel";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

function randomId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const sessionId = useRef(randomId());
  const nextId = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  // Clean up in-flight request on unmount
  useEffect(() => () => { abortRef.current?.abort(); }, []);

  function close() {
    setIsOpen(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const userMsg: Message = { id: nextId.current++, role: "user", text };
    const botId = nextId.current++;
    setMessages((prev) => [...prev, userMsg, { id: botId, role: "bot", text: "" }]);
    setInput("");
    setIsStreaming(true);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch(`/api/chat/${sessionId.current}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: abort.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (payload === "[DONE]") break;
          try {
            const { content } = JSON.parse(payload);
            setMessages((prev) =>
              prev.map((m) =>
                m.id === botId ? { ...m, text: m.text + content } : m,
              ),
            );
          } catch {
            // ignore malformed chunks
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botId ? { ...m, text: "Error: could not reach the chat server." } : m,
          ),
        );
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  return (
    <>
      <ChatPanel
        isOpen={isOpen}
        onClose={close}
        messages={messages}
        input={input}
        isStreaming={isStreaming}
        onInputChange={setInput}
        onSend={send}
      />
      <ChatFAB isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
    </>
  );
}
