export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[var(--bg)]" />

      <div className="animate-bg-blob-1 absolute -left-24 -top-16 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-orange-300/45 via-amber-200/25 to-transparent blur-3xl" />
      <div className="animate-bg-blob-2 absolute -right-24 top-[12%] h-[26rem] w-[26rem] rounded-full bg-gradient-to-bl from-emerald-300/40 via-teal-200/20 to-transparent blur-3xl" />
      <div className="animate-bg-blob-3 absolute bottom-[18%] left-[8%] h-[22rem] w-[22rem] rounded-full bg-gradient-to-tr from-rose-200/35 via-orange-200/20 to-transparent blur-3xl" />
      <div className="animate-bg-blob-4 absolute -bottom-20 right-[5%] h-[24rem] w-[24rem] rounded-full bg-gradient-to-tl from-amber-100/55 via-orange-300/30 to-transparent blur-3xl" />

      <div className="animate-bg-glow absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,146,60,0.14),transparent_42%),radial-gradient(circle_at_100%_60%,rgba(16,185,129,0.1),transparent_38%)]" />

      <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle_at_1px_1px,rgba(234,88,12,0.05)_1px,transparent_0)] bg-[length:22px_22px]" />

      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-orange-100/40 to-transparent" />
    </div>
  );
}
