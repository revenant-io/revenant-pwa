"use client";

interface ChatFABProps {
  isOpen: boolean;
  onClick: () => void;
}

export function ChatFAB({ isOpen, onClick }: ChatFABProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      className="fixed z-50 right-4 bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px)+0.75rem)] lg:bottom-6 lg:right-6
        w-14 h-14 rounded-full bg-[#A6553A] hover:bg-[#C16A4D] active:bg-[#8E4A33]
        shadow-[0_8px_24px_rgba(42,27,14,0.22)] flex items-center justify-center
        transition-colors duration-[220ms]"
    >
      {isOpen ? (
        <svg className="w-6 h-6 text-[#FBF7F0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-[#FBF7F0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 16c0 1.1-.9 2-2 2H7l-4 4V6a2 2 0 012-2h14a2 2 0 012 2v10z" />
        </svg>
      )}
    </button>
  );
}
