import { SiteHeader } from "@/components/SiteHeader";
import { CheckoutForm } from "@/components/CheckoutForm";
import { DrinkitAmbientBackground } from "@/components/DrinkitAmbientBackground";

export default function CheckoutPage() {
  return (
    <div className="drinkit-skin relative isolate min-h-full">
      <DrinkitAmbientBackground />
      <div className="relative z-10">
        <SiteHeader
          variant="drinkit"
          showBack
          backHref="/order"
          backLabel="К меню"
        />
        <CheckoutForm />
      </div>
    </div>
  );
}
