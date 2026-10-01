import HomeClient from "@/components/shared/HomeClient";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getPageMetadata("/home");
}

export default function Home() {
  return <HomeClient />;
}
