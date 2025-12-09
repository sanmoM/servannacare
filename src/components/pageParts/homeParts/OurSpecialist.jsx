import ProfileCard from "@/components/profileCard";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { fakeData } from "@/utilities/data";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const OurSpecialist = () => {
  return (
    <Container className={" py-10 md:py-16"}>
      <div className="mb-8 md:mb-12">
        <h2
          className="sectionHeading text-center 
        "
        >
          Our Specialist
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fakeData.slice(0,4).map((data, indx) => (
          <ProfileCard key={indx} profile={data} />
        ))}
      </div>
      <Link href={"/specialist?category=all"} className="mt-8 flex justify-center">
        <Button size={"lg"}>More <ChevronRight/></Button>
      </Link>
    </Container>
  );
};

export default OurSpecialist;
