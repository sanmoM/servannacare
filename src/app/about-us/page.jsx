import AboutClient from "@/components/AboutClient/AboutClient";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getPageMetadata("/abouts");
}

export default function page() {
  return <AboutClient />;
}
