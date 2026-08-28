const PARTICLES = [
  { left: "8%", delay: "0s", size: 10, duration: 9, hue: "orange" },
  { left: "18%", delay: "-2s", size: 14, duration: 11, hue: "mint" },
  { left: "26%", delay: "-5s", size: 8, duration: 8, hue: "orange" },
  { left: "34%", delay: "-1s", size: 12, duration: 10, hue: "amber" },
  { left: "42%", delay: "-4s", size: 16, duration: 12, hue: "orange" },
  { left: "50%", delay: "-7s", size: 9, duration: 9, hue: "mint" },
  { left: "58%", delay: "-3s", size: 13, duration: 11, hue: "amber" },
  { left: "66%", delay: "-6s", size: 11, duration: 10, hue: "orange" },
  { left: "74%", delay: "-2s", size: 15, duration: 13, hue: "mint" },
  { left: "82%", delay: "-8s", size: 8, duration: 8, hue: "orange" },
  { left: "90%", delay: "-4s", size: 12, duration: 10, hue: "amber" },
  { left: "96%", delay: "-1s", size: 10, duration: 9, hue: "mint" },
] as const;

const SPARKLES = [
  { top: "14%", left: "10%", delay: "0s" },
  { top: "22%", left: "78%", delay: "-1.2s" },
  { top: "38%", left: "24%", delay: "-2.4s" },
  { top: "48%", left: "62%", delay: "-0.8s" },
  { top: "58%", left: "88%", delay: "-1.6s" },
  { top: "68%", left: "14%", delay: "-2s" },
  { top: "76%", left: "52%", delay: "-0.4s" },
  { top: "86%", left: "72%", delay: "-1.8s" },
] as const;

const STEAM = [
  { left: "20%", delay: "0s", w: 48 },
  { left: "55%", delay: "-3s", w: 56 },
  { left: "78%", delay: "-6s", w: 44 },
] as const;

const particleClass = {
  orange: "bg-orange-400/75 shadow-[0_0_14px_rgba(251,146,60,0.85)]",
  mint: "bg-emerald-300/70 shadow-[0_0_12px_rgba(52,211,153,0.75)]",
  amber: "bg-amber-300/75 shadow-[0_0_12px_rgba(251,191,36,0.8)]",
} as const;

export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[var(--bg)]" />

      {/* Aurora mesh — stronger & faster */}
      <div className="animate-bg-aurora absolute -inset-[50%] opacity-100">
        <div className="absolute left-[5%] top-[8%] h-[58vmin] w-[58vmin] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.55)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute right-[2%] top-[14%] h-[52vmin] w-[52vmin] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.4)_0%,transparent_68%)] blur-3xl" />
        <div className="absolute bottom-[10%] left-[15%] h-[54vmin] w-[54vmin] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.28)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[6%] right-[8%] h-[48vmin] w-[48vmin] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.48)_0%,transparent_66%)] blur-3xl" />
      </div>

      {/* Drifting blobs — bigger motion */}
      <div className="animate-bg-blob-1 absolute -left-24 -top-16 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-orange-300/60 via-amber-200/40 to-transparent blur-3xl" />
      <div className="animate-bg-blob-2 absolute -right-20 top-[10%] h-[30rem] w-[30rem] rounded-full bg-gradient-to-bl from-emerald-300/55 via-teal-200/35 to-transparent blur-3xl" />
      <div className="animate-bg-blob-3 absolute bottom-[12%] left-[2%] h-[26rem] w-[26rem] rounded-full bg-gradient-to-tr from-rose-300/45 via-orange-200/35 to-transparent blur-3xl" />
      <div className="animate-bg-blob-4 absolute -bottom-20 right-[2%] h-[28rem] w-[28rem] rounded-full bg-gradient-to-tl from-amber-100/70 via-orange-300/45 to-transparent blur-3xl" />

      {/* Light sweep — brighter */}
      <div className="animate-bg-sweep absolute -inset-x-1/4 inset-y-0 bg-[linear-gradient(105deg,transparent_0%,rgba(255,255,255,0.08)_30%,rgba(255,237,213,0.45)_48%,rgba(255,255,255,0.12)_58%,transparent_75%)]" />
      <div className="animate-bg-sweep-reverse absolute -inset-x-1/4 inset-y-0 bg-[linear-gradient(75deg,transparent_0%,rgba(167,243,208,0.2)_42%,transparent_68%)] opacity-80" />

      {/* Steam wisps */}
      {STEAM.map((s, i) => (
        <div
          key={`steam-${i}`}
          className="animate-bg-steam absolute bottom-[-15%] rounded-full bg-gradient-to-t from-orange-200/50 via-white/25 to-transparent blur-xl"
          style={{
            left: s.left,
            width: s.w,
            height: s.w * 2.2,
            animationDelay: s.delay,
          }}
        />
      ))}

      {/* Rising particles — larger & glowing */}
      <div className="absolute inset-0">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`animate-bg-particle absolute bottom-[-8%] rounded-full ${particleClass[p.hue]}`}
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Twinkling sparkles */}
      <div className="absolute inset-0">
        {SPARKLES.map((s, i) => (
          <span
            key={`spark-${i}`}
            className="animate-bg-sparkle absolute h-1.5 w-1.5 rounded-full bg-orange-300/90 shadow-[0_0_8px_rgba(251,146,60,0.9)]"
            style={{
              top: s.top,
              left: s.left,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      {/* Ambient glow pulse */}
      <div className="animate-bg-glow absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,146,60,0.22),transparent_42%),radial-gradient(circle_at_100%_50%,rgba(16,185,129,0.16),transparent_38%),radial-gradient(circle_at_0%_75%,rgba(251,191,36,0.14),transparent_36%)]" />

      {/* Dot grid — visible + drifting */}
      <div className="animate-bg-dots absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_1px_1px,rgba(234,88,12,0.14)_1.5px,transparent_0)] bg-[length:20px_20px]" />

      {/* Film grain — two layers, clearly visible */}
      <div className="animate-bg-grain absolute inset-[-20%] opacity-[0.14] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjgiIG51bU9jdGF2ZXM9IjUiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjEiLz48L3N2Zz+')]" />
      <div className="animate-bg-grain-reverse absolute inset-[-10%] opacity-[0.08] mix-blend-soft-light bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMS4yIiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIxIi8+PC9zdmc+')]" />

      {/* Soft vignettes — lighter so effects show through */}
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-orange-100/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg)]/60 to-transparent" />
    </div>
  );
}
