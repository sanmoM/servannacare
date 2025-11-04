import React from "react";
import ServicesCard from "./ServicesCard";
import { services } from "@/utilities/data";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const Services = () => {
  return (
    <Container className={"py-12 md:py-16"}>
      <div className="mb-8 flex justify-between items-center md:mb-12">
        <h2 className="sectionHeading">
          Our Services
        </h2>
        <Button><Link className="flex items-center gap-2" href={"/services"}>More <ChevronRight/></Link></Button>
      </div>
      <div
        data-aos="fade-up"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8"
      >
        {services.slice(0,5).map((ser) => (
          <ServicesCard key={ser.id} services={ser} />
        ))}
      </div>
    </Container>
  );
};

export default Services;
