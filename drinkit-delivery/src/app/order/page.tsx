import { connection } from "next/server";
import { HomeContent } from "@/components/HomeContent";
import { SiteHeader } from "@/components/SiteHeader";

export default async function OrderPage() {
  await connection();

  return (
    <div className="drinkit-skin relative isolate min-h-full">
      <SiteHeader variant="drinkit" />
      <HomeContent />
    </div>
  );
}
