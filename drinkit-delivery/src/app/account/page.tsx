import { SiteHeader } from "@/components/SiteHeader";
import { AccountContent } from "@/components/AccountContent";

export default function AccountPage() {
  return (
    <>
      <SiteHeader showBack backLabel="Личный кабинет" />
      <AccountContent />
    </>
  );
}
