import { connection } from "next/server";
import { HomeContent } from "@/components/HomeContent";
import { SiteHeader } from "@/components/SiteHeader";

export default async function OrderPage() {
  await connection();

  return (
    <>
      <SiteHeader />
      <HomeContent />
      <div hidden data-deploy="bg-anim-2026-08-28" />
    </>
  );
}
