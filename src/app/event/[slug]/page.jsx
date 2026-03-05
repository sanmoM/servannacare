"use client";

import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { useFetch } from "@/hooks/useFetch";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const EventDetails = () => {
  const searchParams = useSearchParams();
  const paramsId = searchParams.get("id");

  const [events, setEvents] = useState(null);

  const { data, isLoading, error } = useFetch("/events");

  useEffect(() => {
    if (data) {
      setEvents(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  if (!events || !paramsId) return null;

  const event = events?.find((event) => event.id === parseInt(paramsId));

  if (!event) {
    return notFound();
  }

  const slug = event.title.toLowerCase().replace(/ /g, "-");

  if (!event) {
    return notFound();
  }

  return (
    <div>
      <PageBanner title="Event Details" />

      <Container className={" py-6 md:py-10 lg:py-16"}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-7">
          <div className="md:col-span-5">
            <div className="flex flex-col md:flex-row gap-4 my-10">
              <div className="w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${event?.image}`}
                  alt={event?.title}
                  // fill
                  width={500}
                  height={200}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-md"
                />
              </div>
              <div className="w-full">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${event?.image}`}
                  alt={event?.title}
                  // fill
                  width={500}
                  height={200}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-md"
                />
              </div>
            </div>
            <h2 className="sectionHeading mb-4 lg:mb-6">{event.title}</h2>
            <p className="text-gray-700 text-justify text-sm">
              {event.description}
            </p>
            <p className="text-gray-700 mt-3 text-justify text-sm">
              {event.description}
            </p>

            <div>
              <div className="text-center my-10">
                <h2 className="sectionHeading mb-3">Our Event Partners</h2>
                <p className="text-sm  text-gray-700">
                  Trusted by leading organizations
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {event?.items?.map((partner) => (
                  <div
                    key={partner.id}
                    className="p-6 rounded-lg border cursor-pointer bg-gray-200 hover:text-white hover:bg-primary duration-500"
                  >
                    <p className="text-center font-semibold text-sm">
                      {partner.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="md:sticky md:top-10 ">
              <h4 className="sectionHeading">Recent Event</h4>
              <hr />
              <div className="space-y-6 pt-6">
                {events?.slice(0, 5).map((evn, indx) => (
                  <div key={indx} className="grid grid-cols-4 gap-2">
                    <div className="h-20 md:h-16 col-span-1">
                      <Link className="" href={`/event/${slug}?id=${evn.id}`}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${evn?.image}`}
                          alt={evn?.title}
                          width={500}
                          height={200}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="rounded-md"
                        />
                      </Link>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <Calendar width={14} />
                        <p className="text-xs">
                          {(() => {
                            const date = new Date(evn?.created_at);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0",
                            );
                            const year = String(date.getFullYear()).slice(-2);
                            return `${day}-${month}-${year}`;
                          })()}
                        </p>
                      </div>
                      <Link
                        href={`/event/${slug}?id=${evn.id}`}
                        className="text-sm  font-semibold cursor-pointer hover:text-primary"
                      >
                        {evn.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EventDetails;
