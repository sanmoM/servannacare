
import EventsClient from "@/components/EventsClient/EventsClients";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getPageMetadata("/home");
}

export default function page() {
  return <EventsClient />;
}
