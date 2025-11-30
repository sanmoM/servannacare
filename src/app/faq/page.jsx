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
import React from "react";

const page = () => {
  const faq = [
    {
      id: 1,
      question: "What is this product?",
      answer:
        "Our product is a comprehensive solution designed to streamline your workflow and increase productivity. It combines powerful features with an intuitive interface to help you achieve your goals more efficiently.",
    },
    {
      id: 2,
      question: "Who is this product for?",
      answer:
        "This product is designed for teams and individuals looking to optimize their processes. Whether you're a startup, enterprise, or freelancer, our solution scales to meet your needs.",
    },
    {
      id: 3,
      question: "How do I get started?",
      answer:
        "Getting started is simple! Sign up for an account, complete the onboarding process, and you'll be ready to use our platform within minutes. We also provide comprehensive documentation and support.",
    },
    {
      id: 4,
      question: "What are your pricing plans?",
      answer:
        "We offer flexible pricing plans to suit different needs and budgets. Visit our pricing page to see detailed breakdowns of features included in each plan.",
    },
    {
      id: 5,
      question: "Is there a free trial?",
      answer:
        "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start your trial.",
    },
    {
      id: 6,
      question: "Can I change my plan later?",
      answer:
        "You can upgrade, downgrade, or cancel your plan anytime. Changes take effect at the start of your next billing cycle.",
    },
  ];

  return (
    <div>
      <PageBanner
        title="Frequently Asked Questions"
        image="https://www.cumanagement.com/sites/default/files/2018-10/hand-holding-question-mark.jpg"
      />

      <Faq />

      <Container className={"pb-10"}>
        <hr className="mt-6" />
        <div className="pt-8  lg:pt-12">
          <h2 className="sectionHeading mb-4">Do you have any Question?</h2>
          <form action="">
            <div
              data-aos="fade-up"
              className="flex flex-col md:flex-row items-center gap-4"
            >
              <Input
                label="Question"
                placeholder="Enter your Question"
                name="question"
              />
              <Input
                label="Email"
                placeholder="Enter your Email"
                name="email"
                type="email"
              />
            </div>
            <div data-aos="fade-up" className="mt-4 flex justify-end">
              <Button size={"lg"}>Submit</Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default page;
