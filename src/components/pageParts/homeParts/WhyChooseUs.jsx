import Container from '@/components/shared/Container'
import React from 'react'
import FeatureItem from '../aboutUsParts/FeatureItem'
import { ClipboardList, DollarSign, Phone, ShieldCheck, Sparkles, Users } from 'lucide-react';

const WhyChooseUs = () => {
     const features = [
    {
      icon: DollarSign,
      title: "Affordable, transparent pricing",
      description: "Clear, upfront costs with no hidden fees.",
    },
    {
      icon: Phone,
      title: "24/7 support and emergency response",
      description: "We are here for you anytime, day or night.",
    },
    {
      icon: ClipboardList,
      title: "Tailored care plans for every family",
      description: "Customized solutions that fit your unique needs.",
    },
    {
      icon: Users,
      title: "Tech-enabled matching platform",
      description: "Our smart system finds the perfect fit for you.",
    },
    {
      icon: ShieldCheck,
      title: "Vetted & trusted professionals",
      description: "Peace of mind with background-checked staff.",
    },
    {
      icon: Sparkles,
      title: "Complete Cleaning Solutions",
      description: "For every small and big business.",
    },
  ];
  return (
    <Container>
       <div className="py-10 lg:py-16">
        <div>
          <h2 className="sectionHeading text-center mb-2">
            WHY CHOOSE US?
          </h2>
          <p className="text-center text-slate-600 mb-8 lg:mb-10 text-sm lg:text-base">
            Families choose Servanna because we go beyond providing help
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureItem key={index} feature={feature} />
          ))}
        </div>
      </div>
    </Container>
  )
}

export default WhyChooseUs
