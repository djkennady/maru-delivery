import { connection } from "next/server";
import { HomeContent } from "@/components/HomeContent";
import { SiteHeader } from "@/components/SiteHeader";

export default async function HomePage() {
  await connection();

  return (
    <>
      <SiteHeader />
      <HomeContent />
      {/* deploy marker: layout-fix-2026-08-27d */}
      <div hidden data-deploy="layout-fix-2026-08-27d" />
    </>
  );
}
