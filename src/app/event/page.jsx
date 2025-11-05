import Container from "@/components/shared/Container";
import PageBanner from "@/components/shared/PageBanner";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div>
      <PageBanner title="Transformed For Better Event" />
      <Container className="py-10 lg:py-16">
        <div className="pb-6">
          <h4 className="md:text-sm mb-3  text-xs font-semibold text-primary">
            TFB Events
          </h4>
          <h2 className="sectionHeading ">TRANSFORMED FOR BETTER EVENTS</h2>
        </div>
        <div className="lg:flex gap-6">
          <div className="flex-1">
            <Image
              src={"https://servannacare.com/img/11.jpg"}
              quality={100}
              alt="event"
              width={500}
              height={400}
              className="w-full rounded-xl"
            />
          </div>
          <div className="flex-1 lg:mt-0 mt-6">
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
            <div className="border mt-8 overflow-hidden rounded-xl">
              <div className="h-64">
                <Image
                  src={"https://servannacare.com/img/moja.jpg"}
                  quality={100}
                  alt="event"
                  width={400}
                  height={300}
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 py-6">
                <h2 className="subHeading">
                  Transformed for Better – Employer Edition 1 (May 2024)
                </h2>
                <p className="text-gray-700 text-sm mt-2">
                  A powerful circle of mothers redefining home dynamics,
                  parenting, and the role of domestic workers.
                </p>
              </div>
            </div>
            <div className="border mt-8 overflow-hidden rounded-xl">
              <div className="h-64">
                <Image
                  src={"https://servannacare.com/img/11.jpg"}
                  quality={100}
                  alt="event"
                  width={400}
                  height={300}
                  className="w-full h-full"
                />
              </div>
              <div className="p-4 py-6">
                <h2 className="subHeading">
                  Transformed for Better Event– Nanny Edition (Nov 2024)
                </h2>
                <p className="text-gray-700 text-sm mt-2">
                  A transformative workshop honoring and empowering nannies and
                  house managers across Kenya.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="text-center mb-10">
            <h2 className="sectionHeading mb-3">
              Our Event Partners
            </h2>
            <p className="text-sm  text-gray-700">
              Trusted by leading organizations
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Kingdom Bank"},
              { name: "Jacaranda Maternity" },
              { name: "DPAK SACCO"},
              { name: "CDTD"},
            ].map((partner) => (
              <div
                key={partner.name}
                className=" p-6 rounded-lg border border-border hover:text-white bg-white hover:shadow-2xl hover:bg-primary transition-colors duration-200"
              >
                
                <p className="text-center font-semibold text-foreground text-sm">{partner.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default page;
