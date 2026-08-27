import { DeliveryHeader } from "@/components/delivery/DeliveryHeader";
import { DeliveryHero } from "@/components/delivery/DeliveryHero";
import { DeliveryMenu } from "@/components/delivery/DeliveryMenu";
import { CartBar } from "@/components/delivery/CartBar";

export default function DeliveryPage() {
  return (
    <>
      <DeliveryHeader />
      <DeliveryHero />
      <DeliveryMenu />
      <CartBar />
    </>
  );
}
