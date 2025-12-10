import Container from "@/components/shared/Container";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  const tfbEvents = [
    {
      id: 1,
      title: "Transformed for Better – Employer Edition 1 (May 2024)",
      description:
        "The Transformed for Better workshop brought together a powerful .....",
      image: "https://servannacare.com/img/moja.jpg",
    },
    {
      id: 2,
      title: "Transformed for Better – House Managers Edition (Nov 2024)",
      description:
        "On 17th November 2024, the Transformed for Better – House Managers Edition....",
      image: "https://servannacare.com/img/11.jpg",
    },
  ];

  return (
    <div>
      <PageBanner image="https://www.goodwin.edu/landingpages/files/images/nursing-programs-main-header.jpg" title="Transformed For Better Event" />
      <Container className="py-10 lg:py-16">
        <div className="pb-6">
          <h4 className="md:text-sm mb-3  text-xs font-semibold text-primary">
            TFB Events
          </h4>
          <h2 className="sectionHeading ">TRANSFORMED FOR BETTER EVENTS</h2>
        </div>
        <div className="lg:flex gap-6">
          <div data-aos="fade-up" className="flex-1">
            <Image
              src={"https://servannacare.com/img/11.jpg"}
              quality={100}
              alt="event"
              width={500}
              height={400}
              className="w-full rounded-xl"
            />
          </div>
          <div data-aos="fade-up" className="flex-1 lg:mt-0 mt-6">
            <div className="text-gray-700  text-sm">
              <p>
                Transformed for Better is Servanna’s mission-driven initiative
                designed to educate employers on fostering positive and
                effective working relationships with their domestic workers.
              </p>
              <p className="mt-4">
                Through Transformed for Better, we aim to reshape the prevailing
                narrative around domestic and childcare work...
              </p>
            </div>
            <div className="space-y-3 mt-6">
              <div>
                <h4 className="subHeading">VISION</h4>
                <p className="text-sm text-gray-700">
                  To lead the movement in de-stigmatizing, humanizing, and
                  professionalizing domestic work, fostering dignity and respect
                  for all domestic workers.
                </p>
              </div>
              <div>
                <h4 className="subHeading">MISSION</h4>
                <p className="text-sm text-gray-700">
                  Educating employers and domestic workers on cultivating
                  inclusive and supportive environments. Establishing a
                  community dedicated to fostering positive transformations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 lg:py-16">
          <h2 className="sectionHeading text-center mb-2">
            Transformed for Better Events
          </h2>
          <p className="text-sm text-gray-700 text-center">
            A movement rooted in home transformation, empathy, and dignity.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tfbEvents.map((event, indx) => {
              const slug = event.title.toLowerCase().replace(/ /g, "-");
              return (
                <div
                  key={indx}
                  data-aos="fade-up"
                  className="border mt-8 overflow-hidden rounded-xl"
                >
                  <div className="h-64">
                    <Image
                      src={event.image}
                      quality={100}
                      alt="event"
                      width={400}
                      height={300}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-4 py-6">
                    <h2 className="subHeading">
                      {event.title}
                    </h2>
                    <p className="text-gray-700 text-sm mt-2">
                      {event.description}
                    </p>
                    <div className="mt-8 flex justify-end">
                         <Link href={`/event/${slug}?id=${event.id}`}>
                         <Button>Read More</Button>
                         </Link>
                    </div>
                  </div>

                </div>
              );
            })}

            
          </div>
        </div>

        
      </Container>
    </div>
  );
};

export default page;
