import { DeliveryHeader } from "@/components/delivery/DeliveryHeader";
import { CheckoutForm } from "@/components/delivery/CheckoutForm";

export default function DeliveryCheckoutPage() {
  return (
    <>
      <DeliveryHeader showBack />
      <CheckoutForm />
    </>
  );
}
