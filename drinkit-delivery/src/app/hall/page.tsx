import { permanentRedirect } from "next/navigation";

/** Hub lives at `/` again — keep old /hall links working. */
export default function HallHubRedirectPage() {
  permanentRedirect("/");
}
