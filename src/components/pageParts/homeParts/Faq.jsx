import Container from "@/components/shared/Container";
import faqimage from "@/asset/faq/faq.png"
import Input from "@/components/shared/Input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import React from "react";

const Faq = ({data}) => {
  
  return (
    <Container className="py-10 lg:py-16">
      <div className="pb-10 text-center">
        <h4 className="md:text-sm mb-3  text-xs font-semibold text-primary">
          FAQ
        </h4>
        <h2 className="sectionHeading ">
       
        Explore common questions about our services
        </h2>
        <p className="text-sm mt-2 max-w-4xl mx-auto text-gray-700">
          
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum odit perspiciatis fuga labore .
        </p>
      </div>
      <div className="lg:flex gap-4 ">
        <div data-aos="fade-up" className="flex-1 hidden lg:block">
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}${data.faqHeader.image}`}
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
            {data.faqs.map((item,indx) => (
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
                <AccordionContent className="pb-4 text-muted-foreground">
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
