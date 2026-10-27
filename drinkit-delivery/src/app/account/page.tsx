import { SiteHeader } from "@/components/SiteHeader";
import { AccountContent } from "@/components/AccountContent";
import { DrinkitAmbientBackground } from "@/components/DrinkitAmbientBackground";

export default function AccountPage() {
  return (
    <div className="drinkit-skin relative isolate min-h-full">
      <DrinkitAmbientBackground />
      <SiteHeader
        variant="drinkit"
        showBack
        backHref="/order"
        backLabel="Личный кабинет"
      />
      <AccountContent />
    </div>
  );
}
