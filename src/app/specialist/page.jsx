import Search from "@/components/shared/SpecialistClient";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getPageMetadata("/specialist");
}


export default function Page() {
  return <Search />;
}