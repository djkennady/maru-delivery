import { describe, expect, it } from "vitest";
import {
  applyLoadedProfile,
  type CheckoutContactFields,
  type CheckoutFieldDirty,
} from "@/lib/checkout-profile-fields";

const empty: CheckoutContactFields = { name: "", phone: "", address: "" };
const saved: CheckoutContactFields = {
  name: "Иван",
  phone: "+79990001122",
  address: "Цех 1",
};
const clean: CheckoutFieldDirty = { name: false, phone: false, address: false };

describe("applyLoadedProfile", () => {
  it("fills empty pristine fields after the profile loads", () => {
    expect(applyLoadedProfile(empty, saved, clean)).toEqual(saved);
  });

  it("does not restore a field the user cleared", () => {
    const dirty: CheckoutFieldDirty = { name: true, phone: false, address: false };
    const fields: CheckoutContactFields = {
      name: "",
      phone: saved.phone,
      address: saved.address,
    };
    expect(applyLoadedProfile(fields, saved, dirty)).toEqual(fields);
  });

  it("keeps values typed before the profile hydrates", () => {
    const dirty: CheckoutFieldDirty = { name: true, phone: true, address: true };
    const typed: CheckoutContactFields = {
      name: "Пётр",
      phone: "+79001112233",
      address: "Другое",
    };
    expect(applyLoadedProfile(typed, saved, dirty)).toEqual(typed);
  });
});
