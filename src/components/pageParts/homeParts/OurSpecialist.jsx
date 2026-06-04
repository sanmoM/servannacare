import ProfileCard from "@/components/profileCard";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const OurSpecialist = () => {
  const { data, isLoading } = useFetch("/specialist");

  if (isLoading) {
    <LoadingSpinner />;
  }

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.data?.data?.slice(0, 6).map((data, indx) => (
          <ProfileCard key={data?.id} profile={data} />
        ))}
      </div>
      <Link href={"/specialist?"} className="mt-8 flex justify-center">
        <Button className={"cursor-pointer"} size={"lg"}>
          More <ChevronRight />
        </Button>
      </Link>
    </Container>
  );
};

export default OurSpecialist;
