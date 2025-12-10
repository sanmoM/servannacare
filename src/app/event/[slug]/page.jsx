"use client";

import BlogCardSecond from "@/components/pageParts/blogParts/BlogCardSecond";
import Container from "@/components/shared/Container";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { blogs, tfbEvents } from "@/utilities/data";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import React from "react";

const EventDetails = () => {
  const serarchParams = useSearchParams();
  const paramsId = serarchParams.get("id");
  const event = tfbEvents.find((event) => event.id === parseInt(paramsId));
  const slug = event.title.toLocaleLowerCase().replace(/ /g, "-");
  if (!event) {
    return notFound();
  }
  return (
    <div>
      <PageBanner title="Event Details" />

      <Container className={" py-6 md:py-10 lg:py-16"}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-7">
          <div className="md:col-span-5">
            <h2 className="sectionHeading mb-4 lg:mb-6">{event.title}</h2>
            <p className="text-gray-700 text-justify text-sm">
              {event.description}
            </p>
            <p className="text-gray-700 mt-3 text-justify text-sm">
              {event.description}
            </p>
            <div className="flex flex-col md:flex-row gap-4 my-10">
              <div className="w-full">
                <Image
                  alt="blog"
                  src={event?.image}
                  width={500}
                  height={200}
                  className="w-full rounded-md"
                />
              </div>
              <div className="w-full">
                <Image
                  alt="blog"
                  src={event?.image}
                  width={500}
                  height={200}
                  className="w-full rounded-md"
                />
              </div>
            </div>

            {event.title2 && (
              <>
                <h2 className="sectionHeading">{event.title2}</h2>
                <p className="text-gray-700 mt-4 text-justify text-sm">
                  {event.description2}
                </p>
              </>
            )}

            {event.more && (
              <div className="mt-6 space-y-4">
                {event.more.map((item, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {event.title3 && (
              <>
                <h2 className="sectionHeading mt-8">{event.title3}</h2>
                <p className="text-gray-700 mt-4 text-justify text-sm">
                  {event.description3}
                </p>
              </>
            )}

            {event.more2 && (
              <div className="mt-6 space-y-4">
                {event.more2.map((item, index) => (
                  <div key={index}>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {event.title4 && (
              <>
                <h2 className="sectionHeading mt-8">{event.title4}</h2>
                <p className="text-sm text-gray-700 mt-2">{event.description4}</p>
              </>
            )}


            {event.title5 && (
              <>
                <h2 className="sectionHeading mt-6">{event.title5}</h2>
                <p className="text-sm text-gray-700 mt-2">{event.description5}</p>
              </>
            )}

            <div>
              <div className="text-center my-10">
                <h2 className="sectionHeading mb-3">Our Event Partners</h2>
                <p className="text-sm  text-gray-700">
                  Trusted by leading organizations
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {event.sponsor.map((partner) => (
                  <div
                    data-aos="fade-up"
                    key={partner}
                    className=" p-6 rounded-lg border cursor-pointer bg-gray-200 hover:text-white hover:bg-primary duration-500"
                  >
                    <p className="text-center font-semibold  text-sm">
                      {partner}
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
                {tfbEvents.slice(0, 5).map((evn, indx) => (
                  <div key={indx} className="grid grid-cols-4 gap-2">
                    <div className="h-20 md:h-16 col-span-1">
                      <Link className="" href={`/event/${slug}?id=${evn.id}`}>
                        <Image
                          src={evn.image}
                          height={100}
                          width={100}
                          quality={100}
                          alt="blog image"
                          className="h-full"
                        />
                      </Link>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <Calendar width={14} />
                        <p className="text-xs">{evn.date}</p>
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
