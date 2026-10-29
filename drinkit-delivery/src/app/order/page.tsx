import { permanentRedirect } from "next/navigation";

/** Legacy pickup URL — shop lives at `/`. */
export default function OrderPage() {
  permanentRedirect("/");
}
