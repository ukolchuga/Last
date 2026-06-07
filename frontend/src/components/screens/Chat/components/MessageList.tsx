import React, { useEffect, useRef } from "react";
import type { Message } from "../hooks/useChatLogic";

type MessageListProps = {
  messages: Message[];
  rendered: any[];
  parseContent: (text: string) => React.ReactNode;
};

export function MessageList({ messages, rendered, parseContent }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, rendered]);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-6 py-12 scrollbar-hide scroll-smooth"
    >
      <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-32">
        {rendered.map((msg) => {
          let content: React.ReactNode;
          if (msg.isTyping) {
            content = (
              <span className="flex gap-2 items-center h-6 px-1">
                <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: msg.role === "assistant" ? "rgba(255,255,255,0.65)" : "rgba(19,4,79,0.3)" }} />
                <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: msg.role === "assistant" ? "rgba(255,255,255,0.65)" : "rgba(19,4,79,0.3)" }} />
                <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: msg.role === "assistant" ? "rgba(255,255,255,0.65)" : "rgba(19,4,79,0.3)" }} />
              </span>
            );
          } else if (msg.displayContent !== undefined || msg.isRevealing) {
            content = (
              <>
                {msg.displayContent ?? ""}
                {msg.isRevealing && <span className="cursor-blink inline-block w-0.5 h-[1.1em] rounded-full ml-1 align-middle" style={{ backgroundColor: msg.role === "assistant" ? "rgba(255,255,255,0.85)" : "rgba(19,4,79,0.85)" }} />}
              </>
            );
          } else {
            content = parseContent(msg.content);
          }

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg,#501dff,#6d35ff)", color: "#fff", boxShadow: "0 4px 14px rgba(80,29,255,0.28)" }}>N</div>
              )}
              <div
                className="text-lg leading-relaxed shadow-xl transition-all duration-300"
                style={{
                  ...(msg.role === "assistant"
                    ? { background: "linear-gradient(135deg,#501dff 0%,#6b2fff 100%)", color: "#fff", borderRadius: "24px 24px 24px 6px" }
                    : { background: "#fff", color: "#13044f", borderRadius: "24px 24px 6px 24px", border: "1px solid rgba(19,4,79,0.05)" }),
                  maxWidth: "85%",
                  padding: "1.2rem 1.6rem",
                }}
              >
                {content}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
