import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full h-full bg-[#020617] overflow-hidden flex flex-col p-12">
      {/* High-Impact 4K Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2832&auto=format&fit=crop"
          alt="High Definition AI Concept"
          className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-screen"
          style={{
            animation: "slowZoom 22s ease-in-out infinite",
            transformOrigin: "center",
          }}
        />

        {/* Deep Multi-Layered Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-950/40 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_70%)]"></div>

        {/* Animated Glow Elements */}
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center">
        {/* Floating Feature Cards with higher glassmorphism */}
        <div className="flex gap-8 mb-20">
          <div className="group bg-white/5 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-white/10 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-indigo-500/30">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-400/20 group-hover:rotate-6 transition-transform">
              <span className="text-3xl">🤖</span>
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-black text-indigo-400 tracking-[0.25em] mb-1">
                Inteligência
              </p>
              <p className="text-base font-bold text-white tracking-tight">
                Agentes Autônomos
              </p>
            </div>
          </div>

          <div className="group bg-white/5 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 border border-white/10 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-purple-500/30 translate-y-6">
            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-400/20 group-hover:-rotate-6 transition-transform">
              <span className="text-3xl">✨</span>
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-black text-purple-400 tracking-[0.25em] mb-1">
                Processos
              </p>
              <p className="text-base font-bold text-white tracking-tight">
                Workflows Ativos
              </p>
            </div>
          </div>
        </div>

        {/* Sharper, High-Contrast Typography */}
        <div className="space-y-8 max-w-4xl px-4">
          <h1 className="text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter drop-shadow-2xl">
            O futuro da IA <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300 bg-[length:200%_auto] animate-[shimmer_5s_infinite_linear]">
              chegou agora.
            </span>
          </h1>

          <p className="text-2xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
            Simplifique o complexo. Automatize o impossível. <br />
            Tudo em uma única plataforma integrada.
          </p>
        </div>

        {/* Sophisticated UI Indicator */}
        <div className="mt-24 flex flex-col items-center gap-4">
          <div className="w-px h-20 bg-gradient-to-b from-indigo-500 to-transparent opacity-40"></div>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400/60">
            Kolpy Systems
          </span>
        </div>
      </div>

      {/* Refined Footer Detail */}
      <div className="relative z-10 flex justify-between items-center w-full px-2">
        <div className="flex gap-2">
          <div className="w-8 h-1 rounded-full bg-indigo-500"></div>
          <div className="w-4 h-1 rounded-full bg-white/10"></div>
          <div className="w-4 h-1 rounded-full bg-white/10"></div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            v4.0 Alpha Release
          </span>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        </div>
      </div>

      <style>{`
  @keyframes slowZoom {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.12);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
`}</style>
    </div>
  );
};

export default HeroSection;
