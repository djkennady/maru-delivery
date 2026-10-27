export function DrinkitAmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(30,30,45,0.9),#000_55%)]" />

      <div className="drinkit-aurora absolute -left-1/4 top-[-10%] h-[75vmin] w-[75vmin] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.42),transparent_68%)] blur-3xl" />
      <div className="drinkit-aurora-delay absolute -right-1/4 top-[10%] h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.34),transparent_70%)] blur-3xl" />
      <div className="drinkit-aurora-slow absolute bottom-[-10%] left-[15%] h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.28),transparent_70%)] blur-3xl" />
      <div className="drinkit-aurora absolute bottom-[15%] right-[5%] h-[48vmin] w-[48vmin] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.26),transparent_70%)] blur-3xl" />
      <div className="drinkit-aurora-delay absolute left-[35%] top-[40%] h-[35vmin] w-[35vmin] rounded-full bg-[radial-gradient(circle,rgba(244,114,182,0.18),transparent_70%)] blur-3xl" />

      <div className="drinkit-beam absolute inset-y-0 left-[-20%] w-[45%] bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.07),transparent)]" />
      <div className="drinkit-beam-reverse absolute inset-y-0 right-[-25%] w-[50%] bg-[linear-gradient(75deg,transparent,rgba(96,165,250,0.09),transparent)]" />

      <div className="absolute inset-0 opacity-[0.22] [background-image:radial-gradient(rgba(255,255,255,0.4)_0.7px,transparent_0.7px)] [background-size:3.5px_3.5px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.25)_100%)]" />
    </div>
  );
}
