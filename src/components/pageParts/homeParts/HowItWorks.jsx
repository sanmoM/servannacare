import React from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Users, 
  MessageSquare, 
  ChevronRight 
} from 'lucide-react';
import Container from '@/components/shared/Container';

// This is the data you provided.
// We are aliasing the icon component to 'Icon' (with a capital letter)
// so that React can render it as a component.
const steps = [
  {
    id: 1,
    title: "Tell us your need",
    description: "Share your specific requirements and preferences with us",
    Icon: CheckCircle2, // Aliased
    color: "from-accent to-accent/80",
  },
  {
    id: 2,
    title: "Set your schedule",
    description: "Choose the time and frequency that works best for you",
    Icon: Calendar, // Aliased
    color: "from-accent to-accent/80",
  },
  {
    id: 3,
    title: "Meet your caregiver",
    description: "Connect with a verified professional matched to your needs",
    Icon: Users, // Aliased
    color: "from-accent to-accent/80",
  },
  {
    id: 4,
    title: "Ongoing support",
    description: "Receive continuous care and support throughout your journey",
    Icon: MessageSquare, // Aliased
    color: "from-accent to-accent/80",
  },
];

/**
 * A responsive "How It Works" section component.
 * NOTE: This component assumes you have an 'accent' color 
 * defined in your tailwind.config.js for the gradients to work.
 * e.g., theme: { extend: { colors: { accent: '#yourColorCode' } } }
 */
export default function HowItWorks() {
  return (
    <section className="py-10 md:py-16 bg-gray-50 ">
      

        <Container>
          {/* Section Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="sectionHeading">
            How It Works
          </h2>
        </div>

        {/* Steps Layout */}
        {/* Uses flex-col on mobile and flex-row on large screens */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          
          {steps.map((step, index) => (
            <React.Fragment  key={step.id}>
              
              {/* Step Card */}
              <div data-aos="fade-up" className="flex flex-col items-center text-center w-full max-w-xs lg:max-w-none lg:w-1/4 px-4">
                
                {/* Icon and Step Number */}
                <div 
                  // The `bg-gradient-to-r` and color classes are applied here
                  className={`w-20 h-20 rounded-full bg-blue-950 flex items-center justify-center mb-6 shadow-lg relative ring-4 ring-white`}
                >
                  <step.Icon className="w-10 h-10 text-white" />
                  
                  {/* Step Number Badge */}
                  <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-white text-gray-900 border-2 border-gray-200 flex items-center justify-center font-bold text-sm">
                    {step.id}
                  </span>
                </div>
                
                {/* Step Title */}
                <h3 className="subHeading mb-2">
                  {step.title}
                </h3>
                
                {/* Step Description */}
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>

              {/* Connector: Renders after each step except the last one */}
              {index < steps.length - 1 && (
                <>
                  {/* Mobile Vertical Connector */}
                  <div className="md:hidden w-1 border-l-2 border-dashed border-primary h-16 my-4"></div>
                  
                  {/* Desktop Horizontal Connector */}
                  {/* pt-10 pushes the arrow down to align with the center of the icons */}
                  <div className="hidden md:flex items-center justify-center flex-1 pt-10">
                     <ChevronRight className="w-8 h-8 text-primary" />
                  </div>
                </>
              )}

            </React.Fragment>
          ))}
          
        </div>

        </Container>
        
        

     
    </section>
  );
}
