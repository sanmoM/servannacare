import Search from "@/components/SpecialistClient/SpecialistClient";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata(props) {
  const searchParams = await props?.searchParams;
  const params = await props?.params;
  return getPageMetadata("/specialist", { ...params, ...searchParams });
}


export default function Page() {
  return <Search />;
}