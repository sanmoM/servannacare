import Container from "@/components/shared/Container";
import faqimage from "@/asset/faq/faq.png";
import Input from "@/components/shared/Input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import React from "react";

const Faq = ({ homeData }) => {
  const imageSrc = homeData?.faqHeader?.image
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${homeData.faqHeader.image}`
    : "/assets/images/blog.jpg";

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
    <Container className="py-10 lg:py-16 pb-24">

      <div className="pb-10 text-center">
        <h4 className="md:text-sm mb-3  text-xs font-semibold text-primary">
          FAQ
        </h4>
        <h2 className="sectionHeading ">{homeData?.faqHeader?.title}</h2>
        <p className="text-sm mt-2 max-w-4xl mx-auto text-gray-700">
          {homeData?.faqHeader?.subtitle}
        </p>
      </div>

      <div className="lg:flex gap-4 ">
        <div data-aos="fade-up" className="flex-1 hidden lg:block">
          {/* {homeData?.faqHeader?.image && (
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${homeData.faqHeader.image}`}
              alt={homeData?.faqHeader?.title ?? "FAQ image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )} */}

          <Image
            src={imageSrc}
            alt={homeData?.faqHeader?.title ?? "FAQ image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-md object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="flex-1">
          <Accordion
            type="single"
            collapsible
            defaultValue="item-1 "
            className="space-y-4"
          >
            {homeData?.faqs.map((item, indx) => (
              <AccordionItem
                data-aos="fade-up"
                key={indx}
                value={`item-${indx}`}
                className="border border-border rounded-lg"
              >
                <AccordionTrigger className="py-4 hover:no-underline">
                  <span className="text-left text-base font-medium">
                    {item.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-white">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </Container>
  );
};

export default Faq;
