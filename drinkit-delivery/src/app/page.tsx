import { connection } from "next/server";
import { HomeContent } from "@/components/HomeContent";
import { SiteHeader } from "@/components/SiteHeader";

export default async function HomePage() {
  await connection();

  return (
    <>
      <SiteHeader />
      <HomeContent />
      {/* deploy marker: bg-anim-2026-08-28 */}
      <div hidden data-deploy="bg-anim-2026-08-28" />
    </>
  );
}
