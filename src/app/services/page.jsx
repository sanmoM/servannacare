"use client";
import ServicesCard from "@/components/pageParts/homeParts/ServicesCard";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { useFetch } from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [serviceData, setServiceData] = useState(null);

  const { data, isLoading, error } = useFetch("/services");

  useEffect(() => {
    if (data?.data) {
      setServiceData(data.data.data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <PageBanner />
      <Container>
        <div className="py-10 md:py-16">
          {/* Heading */}
          {serviceData?.serviceHeading && (
            <div className="mb-8 space-y-2 md:mb-12">
              <h4 className="md:text-sm text-xs font-semibold text-primary">
                SERVICES
              </h4>
              <h2 className="sectionHeading">
                {serviceData?.serviceHeading?.title}
              </h2>
              <p className="text-gray-700 text-sm">
                {serviceData.serviceHeading.subtitle}
              </p>
            </div>
          )}

          {/* Services Grid */}
          <div
            data-aos="fade-up"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-6 lg:gap-8"
          >
            {serviceData?.service?.map((ser) => (
              <ServicesCard key={ser.id} services={ser} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Page;
