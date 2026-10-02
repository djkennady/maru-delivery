export type CheckoutContactFields = {
  name: string;
  phone: string;
  address: string;
};

export type CheckoutFieldDirty = {
  name: boolean;
  phone: boolean;
  address: boolean;
};

export function applyLoadedProfile(
  fields: CheckoutContactFields,
  profile: CheckoutContactFields,
  dirty: CheckoutFieldDirty,
): CheckoutContactFields {
  return {
    name: dirty.name ? fields.name : profile.name || fields.name,
    phone: dirty.phone ? fields.phone : profile.phone || fields.phone,
    address: dirty.address ? fields.address : profile.address || fields.address,
  };
}

export function profileSnapshotKey(profile: CheckoutContactFields): string {
  return `${profile.name}\n${profile.phone}\n${profile.address}`;
}
