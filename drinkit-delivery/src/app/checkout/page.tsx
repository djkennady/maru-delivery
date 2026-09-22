import { SiteHeader } from "@/components/SiteHeader";
import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <>
      <SiteHeader showBack backHref="/order" backLabel="Корзина" />
      <CheckoutForm />
    </>
  );
}
