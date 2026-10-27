export function DrinkitAmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,30,45,0.9),#000_55%)]" />

      <div className="drinkit-aurora absolute -left-1/4 top-[-10%] h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.28),transparent_68%)] blur-3xl" />
      <div className="drinkit-aurora-delay absolute -right-1/4 top-[15%] h-[65vmin] w-[65vmin] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.22),transparent_70%)] blur-3xl" />
      <div className="drinkit-aurora-slow absolute bottom-[-10%] left-[20%] h-[55vmin] w-[55vmin] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.16),transparent_70%)] blur-3xl" />
      <div className="drinkit-aurora absolute bottom-[20%] right-[10%] h-[40vmin] w-[40vmin] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.14),transparent_70%)] blur-3xl" />

      <div className="drinkit-beam absolute inset-y-0 left-[-20%] w-[40%] bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.04),transparent)]" />
      <div className="drinkit-beam-reverse absolute inset-y-0 right-[-25%] w-[45%] bg-[linear-gradient(75deg,transparent,rgba(96,165,250,0.05),transparent)]" />

      <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgba(255,255,255,0.35)_0.6px,transparent_0.6px)] [background-size:3px_3px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.35)_100%)]" />
    </div>
  );
}
