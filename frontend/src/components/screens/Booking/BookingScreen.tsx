import { useState, type DragEvent } from "react";
import { Upload, Pencil } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function BookingScreen({
  onBack,
  onStartChat,
}: {
  onBack: () => void;
  onStartChat: (msg?: string, file?: File) => void;
}) {
  const [situation, setSituation] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const f = e.dataTransfer.files?.[0];
    if (f) {
      onStartChat(undefined, f);
    }
  };

  return (
    <div
      id="booking-screen"
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12"
      style={{ background: "var(--notarity-bg)" }}
    >
      <button
        onClick={onBack}
        aria-label="Back to home"
        className="absolute top-6 left-6 md:left-12 transition hover:opacity-80"
      >
        <Logo />
      </button>

      <div className="w-full max-w-5xl flex flex-col items-center text-center">
        <div className="hero-shift">
          <h1 className="booking-anim delay-1 whitespace-nowrap text-ink font-bold tracking-tight leading-[1.02] text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            I am <span className="text-accent">Noty</span>, your AI assistant.
          </h1>
          <h2 className="booking-anim delay-2 mt-4 whitespace-nowrap text-muted-ink font-bold tracking-tight leading-[1.02] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            Where should we begin?
          </h2>
        </div>

        <p className="booking-anim delay-3 mt-2 text-muted-ink text-lg md:text-xl max-w-xl">
          Drop a document for structure analysis, or describe your situation for a tailored
          notary solution.
        </p>

        <div className="booking-anim-cards mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Drop a document */}
          <label 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`group cursor-pointer rounded-2xl border-2 border-dashed transition p-10 flex flex-col items-center justify-center text-center min-h-[220px] ${
              isDragging 
                ? "border-accent bg-accent/5" 
                : "border-ink/15 bg-white/50 hover:border-accent hover:bg-white"
            }`}
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-200 ${isDragging ? "scale-110 bg-accent/20" : "bg-[#501dff]/10"}`}>
              <Upload className={`w-6 h-6 transition-colors ${isDragging ? "text-accent" : "text-accent"}`} />
            </div>
            <div className="text-ink font-bold text-lg">Drop a document</div>
            <div className="text-accent/70 text-sm mt-1">PDF, DOCX, or Images</div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.docx,image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onStartChat(undefined, f);
              }}
            />
          </label>

          {/* Describe situation */}
          <div className="rounded-2xl bg-white shadow-sm border border-ink/5 p-6 flex flex-col text-left min-h-[220px]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-ink font-bold text-lg">Describe situation</div>
              <Pencil className="w-5 h-5 text-accent" />
            </div>
            <textarea
              placeholder="e.g. I need to notarize a power of attorney for a property sale abroad..."
              className="flex-1 resize-none bg-transparent outline-none text-ink placeholder:text-muted-ink/60 text-base leading-relaxed"
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && situation.trim()) {
                  e.preventDefault();
                  onStartChat(situation.trim());
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
