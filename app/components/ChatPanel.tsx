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

  const showTyping = isStreaming &&
    messages[messages.length - 1]?.role === "bot" &&
    messages[messages.length - 1]?.text === "";

  const panelContent = (
    <div className="flex flex-col h-full bg-[#F5EFE6]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 shrink-0 bg-[#FBF7F0] border-b border-[#DCCFB5] rounded-t-2xl">
        <span
          className="text-[#2A1B0E] text-base font-medium tracking-[-0.01em]"
          style={{ fontFamily: "var(--font-fraunces), 'Iowan Old Style', Georgia, serif" }}
        >
          Revenant
        </span>
        <button
          onClick={onClose}
          aria-label="Close chat"
          className="p-1.5 rounded-lg text-[#8A6F4F] hover:text-[#2A1B0E] hover:bg-[#ECE3D2] transition-colors duration-[140ms]"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-[#8A6F4F] text-sm text-center mt-8">
            Nothing here yet. Send a message to get started.
          </p>
        )}
        {messages.map((msg) => {
          // Don't render an empty bot bubble while the typing indicator is active
          if (msg.role === "bot" && msg.text === "" && isStreaming) return null;
          return (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#A6553A] text-[#FBF7F0] rounded-br-sm"
                    : "bg-[#FBF7F0] text-[#54422D] border border-[#DCCFB5] rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        {showTyping && (
          <div className="flex justify-start">
            <div className="bg-[#FBF7F0] border border-[#DCCFB5] px-3 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-[#B5A084] rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-[#B5A084] rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-[#B5A084] rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="shrink-0 pt-3 px-3 border-t border-[#DCCFB5] bg-[#FBF7F0]"
        style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            className="flex-1 bg-[#ECE3D2] text-[#2A1B0E] placeholder-[#B5A084] text-sm px-3 py-2 rounded-[6px]
              border border-[#B5A084] focus:outline-none focus:border-[#A6553A] focus:ring-1 focus:ring-[#A6553A]
              transition-colors duration-[140ms]"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isStreaming}
            aria-label="Send"
            className="w-9 h-9 shrink-0 rounded-full bg-[#A6553A] hover:bg-[#C16A4D] active:bg-[#8E4A33]
              disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center
              transition-colors duration-[140ms]"
          >
            <svg className="w-4 h-4 text-[#FBF7F0] translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
            transition-transform duration-[220ms] ease-out ${
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
          className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-[220ms] ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        />
        {/* Panel */}
        <div
          className={`fixed bottom-20 right-6 z-50 w-[380px] h-[520px] rounded-2xl overflow-hidden
            shadow-[0_32px_80px_rgba(42,27,14,0.16),_0_8px_16px_rgba(42,27,14,0.06)]
            transition-all duration-[220ms] origin-bottom-right ${
              isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
            }`}
        >
          {panelContent}
        </div>
      </div>
    </>
  );
}
