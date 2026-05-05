"use client";

import { useEffect, useRef } from "react";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  input: string;
  isStreaming: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export function ChatPanel({ isOpen, onClose, messages, input, isStreaming, onInputChange, onSend }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  const panelContent = (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 shrink-0 bg-slate-800 border-b border-slate-700 rounded-t-2xl">
        <span className="font-semibold text-white">Chat</span>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-slate-500 text-sm text-center mt-8">Send a message to start chatting.</p>
        )}
        {isStreaming && messages[messages.length - 1]?.role === "bot" && messages[messages.length - 1]?.text === "" && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-100 px-3 py-2 rounded-2xl rounded-bl-sm text-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-slate-700 text-slate-100 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 p-3 border-t border-slate-700 bg-slate-800 safe-bottom lg:pb-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="flex-1 bg-slate-700 text-white placeholder-slate-400 text-sm px-3 py-2 rounded-xl
              border border-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isStreaming}
            aria-label="Send"
            className="w-9 h-9 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40
              disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-white translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: slide-up sheet */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />
        {/* Sheet */}
        <div
          className={`fixed inset-x-0 bottom-0 z-50 h-[85dvh] rounded-t-2xl overflow-hidden
            transition-transform duration-300 ease-out ${
              isOpen ? "translate-y-0" : "translate-y-full"
            }`}
          style={{ height: "calc(var(--vh-ios, 1dvh) * 85)" }}
        >
          {panelContent}
        </div>
      </div>

      {/* Desktop: floating panel */}
      <div className="hidden lg:block">
        {/* Backdrop */}
        <div
          onClick={onClose}
          className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-200 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />
        {/* Panel */}
        <div
          className={`fixed bottom-20 right-6 z-50 w-[380px] h-[520px] rounded-2xl overflow-hidden shadow-2xl shadow-black/60
            transition-all duration-200 origin-bottom-right ${
              isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
        >
          {panelContent}
        </div>
      </div>
    </>
  );
}
