import React from "react";
import {
  CheckCircle2,
  Calendar,
  Users,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import Container from "@/components/shared/Container";

const steps = [
  {
    id: 1,
    title: "Tell us your need",
    description: "Share your specific requirements and preferences with us",
    Icon: CheckCircle2, 
    color: "from-accent to-accent/80",
  },
  {
    id: 2,
    title: "Set your schedule",
    description: "Choose the time and frequency that works best for you",
    Icon: Calendar, 
    color: "from-accent to-accent/80",
  },
  {
    id: 3,
    title: "Meet your caregiver",
    description: "Connect with a verified professional matched to your needs",
    Icon: Users, 
    color: "from-accent to-accent/80",
  },
  {
    id: 4,
    title: "Ongoing support",
    description: "Receive continuous care and support throughout your journey",
    Icon: MessageSquare, 
    color: "from-accent to-accent/80",
  },
];

export default function HowItWorks({ homeData }) {

  return (
    <section className="py-10 md:py-16">
      <Container>
        
        <div className="mb-8 md:mb-12">
          <h2 className="sectionHeading text-center">How It Works</h2>
        </div>

        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          {homeData?.works?.map((step, index) => {
            const Icon = step.Icon;
            return (
              <React.Fragment key={step.id}>
           
                <div
                  data-aos="fade-up"
                  className="flex flex-col items-center text-center w-full max-w-xs lg:max-w-none   lg:w-1/4 px-4"
                >

                  <div
                   
                    className={`w-20 h-20  rounded-full bg-primary flex items-center justify-center mb-6 shadow-lg relative ring-4 ring-white`}
                  >
                   

                    <div className="flex">
                      <span
                        dangerouslySetInnerHTML={{ __html: step.icon }}
                        className="w-6 h-6"
                      />
                    </div>

                   
                    <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-white text-primary border-2 border-gray-200 flex items-center justify-center font-bold text-sm">
                      {step.id}
                    </span>
                  </div>

                
                  <h3 className="subHeading mb-2">{step.title}</h3>

                  
                  <p className="text-gray-600 text-sm">{step.subtitle}</p>
                </div>

                
                {index < steps.length - 1 && (
                  <>
                  
                    <div className="md:hidden w-1 border-l-2 border-dashed border-primary h-16 my-4"></div>

                  
                    <div className="hidden md:flex items-center justify-center flex-1 pt-10">
                      <ChevronRight className="w-8 h-8 text-primary" />
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
