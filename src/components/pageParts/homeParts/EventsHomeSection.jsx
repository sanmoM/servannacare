"use client";

import React from "react";
import EventsSection from "@/components/EventsClient/EventsSection";
import { useFetch } from "@/hooks/useFetch";

/**
 * Events Home Section component
 * Ready to drop into HomeClient or landing pages.
 */
export default function EventsHomeSection() {
  const { data, isLoading } = useFetch("/events");

  const resolvedEvents = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.events)) return data.data.events;
    if (Array.isArray(data?.events)) return data.events;
    return [];
  }, [data]);

  if (isLoading || resolvedEvents.length === 0) return null;

  return (
    <div className="bg-[#FAF7F9]/60 border-t border-b border-purple-100/60">
      <EventsSection
        events={resolvedEvents}
        showHero={true}
        showPartners={true}
        showCta={false}
      />
    </div>
  );
}
