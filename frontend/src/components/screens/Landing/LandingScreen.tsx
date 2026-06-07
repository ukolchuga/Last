import { Logo } from "@/components/common/Logo";

export function LandingScreen({ onBook }: { onBook: () => void }) {
  return (
    <div
      id="landing-screen"
      className="notarity-gradient w-full min-h-screen flex flex-col"
    >
      <header className="w-full px-6 md:px-12 py-6 flex items-center justify-between max-w-[1400px] mx-auto">
        <Logo />
        <nav className="hidden md:flex items-center gap-10 text-ink/80 font-medium">
          <a href="#" className="hover:text-ink transition">For Business</a>
          <a href="#" className="hover:text-ink transition">For Individuals</a>
          <a href="#" className="hover:text-ink transition">How it works</a>
          <a href="#" className="hover:text-ink transition">About</a>
        </nav>
        <div className="flex items-center gap-6">
          <a href="#" className="text-accent font-semibold hidden sm:inline">Login</a>
          <button onClick={onBook} className="btn-accent text-sm md:text-base">
            Book an appointment
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center text-center px-6 pt-12 md:pt-20">
        <p className="text-ink tracking-[0.3em] text-sm font-semibold">
          ANYWHERE &amp; ANYTIME
        </p>
        <h1 className="mt-6 text-ink font-bold leading-[1.05] text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl">
          Notarise<br />Documents Online
        </h1>
        <p className="mt-8 text-ink/70 text-lg max-w-2xl">
          Simplify your business processes with our digital platform for all your global
          notarisation matters. Efficient, legally compliant, from anywhere and at anytime.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button onClick={onBook} className="btn-accent">Book a notary appointment</button>
          <button className="btn-outline">Book a Demo</button>
        </div>

        <div className="mt-16 relative w-full max-w-3xl h-[340px] md:h-[420px] mx-auto">
          <div className="absolute left-1/2 -translate-x-[140%] top-0 w-64 rounded-2xl bg-white shadow-2xl p-4 rotate-[-6deg]">
            <div className="flex items-center justify-between mb-3">
              <div className="h-2 w-12 rounded bg-gray-200" />
              <div className="text-xs font-semibold text-ink">April</div>
              <div className="h-6 w-12 rounded bg-[#501dff]/10" />
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-6 rounded text-[10px] flex items-center justify-center ${
                    i === 14
                      ? "bg-[#501dff] text-white font-semibold"
                      : "text-ink/60 bg-gray-50"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="mt-3 h-8 rounded-lg bg-[#501dff]/10" />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-4 w-[200px] h-[400px] rounded-[36px] bg-ink shadow-2xl p-2 rotate-[-3deg]">
            <div className="w-full h-full rounded-[30px] bg-white p-4 flex flex-col">
              <div className="text-[10px] font-bold text-ink leading-tight uppercase">
                Documents from everywhere & anytime.
              </div>
              <div className="mt-auto space-y-2">
                <div className="h-2 rounded bg-gray-100" />
                <div className="h-2 rounded bg-gray-100 w-3/4" />
                <div className="h-8 rounded-lg bg-[#501dff]/10 mt-3" />
              </div>
            </div>
          </div>

          <div className="absolute left-1/2 translate-x-[10%] top-10 w-[200px] h-[400px] rounded-[36px] bg-ink shadow-2xl p-2 rotate-[6deg]">
            <div className="w-full h-full rounded-[30px] bg-white p-3 flex flex-col gap-3">
              <div className="h-28 rounded-xl bg-gradient-to-br from-[#501dff]/20 to-[#501dff]/5 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#501dff]/30" />
              </div>
              <div className="h-28 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-amber-300/60" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
