
import EventsClient from "@/components/EventsClient/EventsClients";
import { getPageMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getPageMetadata("/events");
}

export default function page() {
  return <EventsClient />;
}
