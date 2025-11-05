"use client";

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

      <Container className="py-10 lg:py-16">
        <div className="pb-6">
          <h4 className="md:text-sm mb-3  text-xs font-semibold text-primary">
            FAQ
          </h4>
          <h2 className="sectionHeading ">
            Explore common questions about our services
          </h2>
          <p className="text-sm mt-2 max-w-4xl text-gray-700">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum odit
            perspiciatis fuga labore .
          </p>
        </div>
        <div className="lg:flex gap-4 ">
          <div data-aos="fade-up" className="flex-1 hidden lg:block">
            <Image
              src={
                "https://static.tildacdn.com/tild3063-3165-4532-a338-326666663139/Clip_path_group_52.png"
              }
              alt="image"
              quality={100}
              height={500}
              width={600}
              className="rounded-xl w-full h-full"
            />
          </div>
          <div className="flex-1">
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="space-y-4"
            >
              {faq.map((item) => (
                <AccordionItem
                data-aos="fade-up"
                  key={item.id}
                  value={`item-${item.id}`}
                  className="border border-border rounded-lg"
                >
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <span className="text-left text-base font-medium">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
        <hr className="mt-6"/>
        <div className="pt-8  lg:pt-12">
          <h2 className="sectionHeading mb-4">Do you have any Question?</h2>
          <form action="">
            <div data-aos="fade-up" className="flex flex-col md:flex-row items-center gap-4">
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
