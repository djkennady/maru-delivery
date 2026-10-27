import { SiteHeader } from "@/components/SiteHeader";
import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="drinkit-skin min-h-full">
      <SiteHeader
        variant="drinkit"
        showBack
        backHref="/order"
        backLabel="К меню"
      />
      <CheckoutForm />
    </div>
  );
}
