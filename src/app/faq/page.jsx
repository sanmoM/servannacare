"use client";

import Faq from "@/components/pageParts/homeParts/Faq";
import Container from "@/components/shared/Container";
import Input from "@/components/shared/Input";
import PageBanner from "@/components/shared/PageBanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import faqimage from "@/asset/faq/faq.png";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useFetch } from "@/hooks/useFetch";

const page = () => {
  const [homeData, setHomeData] = useState(null);

  const { data, isLoading, error } = useFetch("/home");
  useEffect(() => {
    if (data) {
      setHomeData(data?.data?.data ?? data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      <PageBanner
        title="Frequently Asked Questions"
        image="https://www.cumanagement.com/sites/default/files/2018-10/hand-holding-question-mark.jpg"
      />
      <Faq homeData={homeData} />
    </div>
  );
};

export default page;
