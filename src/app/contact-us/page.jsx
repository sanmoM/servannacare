import ContactClient from "@/components/ContactClient/ContactClient";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getPageMetadata("/contacts");
}

export default function page() {
  return <ContactClient />;
}
