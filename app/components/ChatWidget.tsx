"use client";

import { useState, useRef } from "react";
import { ChatFAB } from "./ChatFAB";
import { ChatPanel } from "./ChatPanel";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(0);

  function open() { setIsOpen(true); }
  function close() { setIsOpen(false); }
  function toggle() { setIsOpen((v) => !v); }

  function send() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: nextId.current++, role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg: Message = { id: nextId.current++, role: "bot", text: `Echo: ${text}` };
      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  }

  return (
    <>
      <ChatPanel
        isOpen={isOpen}
        onClose={close}
        messages={messages}
        input={input}
        onInputChange={setInput}
        onSend={send}
      />
      <ChatFAB isOpen={isOpen} onClick={toggle} />
    </>
  );
}
