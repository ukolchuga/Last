type SuccessOverlayProps = {
  onBack: () => void;
};

export function SuccessOverlay({ onBack }: SuccessOverlayProps) {
  return (
    <div className="fixed inset-0 z-[120] bg-accent flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-8 animate-bounce">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6L9 17L4 12"/></svg>
      </div>
      <h2 className="text-white text-5xl md:text-7xl font-black leading-tight mb-6">
        Thank you<br/>for your application!
      </h2>
      <p className="text-white/80 text-xl md:text-2xl font-medium max-w-2xl">
        Our specialists will contact you shortly to finalize your notarization.
      </p>
      <button 
        onClick={onBack}
        className="mt-12 bg-white text-accent font-bold px-10 py-4 rounded-2xl hover:scale-105 transition shadow-2xl"
      >
        Back to Home
      </button>
    </div>
  );
}
