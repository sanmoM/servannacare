import ServicesClient from "@/components/ServiceClient/ServicesClient";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getPageMetadata("/services");
}

const Page = () => {
  return <ServicesClient />;
};

export default Page;
