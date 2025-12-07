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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
              quod dolore modi neque. Accusamus dolorem maiores non commodi
              maxime? Dolorum tempora magni impedit totam, mollitia ea itaque et
              possimus eligendi vel recusandae nesciunt ab deserunt a vitae
              ipsum sed earum quibusdam corporis cumque? Ipsum iusto quo et enim
              nisi repudiandae alias! Quibusdam ratione odio vel ea quo, et
              voluptas sunt suscipit cumque obcaecati fugit deserunt nesciunt
              repellendus ipsam, similique optio. Est excepturi voluptatum ipsam
              accusamus tempora, eligendi tenetur reiciendis facere sit, atque
              sed molestiae dolore. Cum aperiam dolores dolorem explicabo
              similique blanditiis officia accusantium vitae porro iusto?
              Commodi, ipsam nobis.
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
            <h2 className="sectionHeading ">{event.title}</h2>
            <p className="text-gray-700 mt-4 lg:mt-6 text-justify text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
              accusamus quisquam saepe amet sequi ab aspernatur inventore
              voluptatem. Eius corrupti magni recusandae fuga ab, necessitatibus
              error eaque, quisquam dicta officiis laboriosam fugit ipsa sint
              sapiente cumque? Aut autem, necessitatibus facere ab nihil
              doloribus, delectus aliquam quasi sapiente nemo minus, voluptatem
              nam ut omnis vitae. Eum, distinctio fuga! Numquam earum, harum,
              assumenda repellat quo eligendi, ducimus nulla veniam sint aliquid
              odit!
            </p>
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
