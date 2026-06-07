type ChatInputProps = {
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  disabled?: boolean;
};

export function ChatInput({ input, setInput, handleSend, disabled }: ChatInputProps) {
  if (disabled) return null;

  return (
    <div className="flex gap-3 items-center px-5 py-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(14px)", boxShadow: "0 8px 40px rgba(19,4,79,0.1),0 2px 8px rgba(19,4,79,0.06)" }}>
      <input 
        autoFocus 
        type="text" 
        className="flex-1 text-base outline-none bg-transparent" 
        style={{ color: "#13044f" }} 
        placeholder="Type your answer…" 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }} 
      />
      <button 
        className="w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center transition-all duration-200 hover:scale-105 disabled:opacity-25 disabled:scale-100" 
        style={{ background: "linear-gradient(135deg,#501dff,#6d35ff)", boxShadow: input.trim() ? "0 4px 16px rgba(80,29,255,0.35)" : "none" }} 
        onClick={handleSend} 
        disabled={!input.trim()}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  );
}
