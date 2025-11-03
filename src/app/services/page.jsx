import ServicesCard from "@/components/pageParts/homeParts/ServicesCard";
import Container from "@/components/shared/Container";
import PageBanner from "@/components/shared/PageBanner";
import { services } from "@/utilities/data";
import React from "react";

const Page = () => {
  return (
    <div>
      <PageBanner />
      <Container>
        <div className="py-12 md:py-18">
          <div className="mb-8 space-y-2 md:mb-12">
            <h4 className="md:text-sm  text-xs font-semibold text-primary">
              SERVICES
            </h4>
            <h2 className="sectionHeading">
              Comprehensive Home & Health Care Services
            </h2>
            <p className="text-xs text-gray-700 md:text-sm">
              We provide a complete range of health and home care solutions
              designed to make everyday life easier, safer, and more
              comfortable.
            </p>
          </div>

          <div
            data-aos="fade-up"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8"
          >
            {services.map((ser) => (
              <ServicesCard key={ser.id} services={ser} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Page;
