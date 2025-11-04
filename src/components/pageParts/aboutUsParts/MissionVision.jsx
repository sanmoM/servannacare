import {
  ClipboardList,
  DollarSign,
  Handshake,
  Heart,
  Phone,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import FeatureItem from "./FeatureItem";

const MissionVision = () => {
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
    <div className="">

     {/* Core Values */}
      <div className="py-12 md:py-16">
        <h2 className="sectionHeading text-center mb-2">Our Core Values</h2>
        <p className="text-center text-slate-600 mb-8 lg:mb-10 text-sm lg:text-base">
          Everything we do is guided by three fundamental principles
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Empathy */}
          <div data-aos="fade-up" className="group">
            <div className="bg-white rounded-2xl p-4 lg:p-8 shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-blue-200 h-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-red-50 mb-4 group-hover:scale-110 transition-transform">
                <Heart className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold text-slate-900 mb-3">
                Empathy
              </h3>
              <p className="text-xs sm:text-sm md:text-base  text-gray-700">
                We listen and respond with genuine care, treating every family
                and caregiver with dignity and respect.
              </p>
            </div>
          </div>

          {/* Professionalism */}
          <div data-aos="fade-up" className="group">
            <div className="bg-white rounded-2xl p-4 lg:p-8 shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-blue-200 h-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 mb-4 group-hover:scale-110 transition-transform">
                <Trophy className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold text-slate-900 mb-3">
                Professionalism
              </h3>
              <p className="text-xs sm:text-sm md:text-base   text-gray-700">
                We deliver with excellence, confidence, and responsibility,
                setting high standards in care and home support.
              </p>
            </div>
          </div>

          {/* Teamwork */}
          <div data-aos="fade-up" className="group">
            <div className="bg-white rounded-2xl p-4  lg:p-8 shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-blue-200 h-full">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-cyan-50 mb-4 group-hover:scale-110 transition-transform">
                <Handshake className="w-7 h-7 text-cyan-600" />
              </div>
              <h3 className="text-base lg:text-xl font-semibold text-slate-900 mb-3">
                Teamwork
              </h3>
              <p className="text-xs sm:text-sm md:text-base  text-gray-700">
                We collaborate effectively to ensure every client and caregiver
                experience is supportive and seamless.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Grid */}
      <div className="py-12 md:py-16">
        <h4 className="text-sm md:text-base text-center text-primary font-bold">
          Our Foundation
        </h4>
        <h2 className="sectionHeading text-center mb-2">
          Shaping Africa&apos;s Future Through Care
        </h2>
        <p className="text-center text-slate-600  mb-8 lg:mb-10 text-sm lg:text-base">
          We&apos;re committed to transforming home-based care into an
          accessible standard for every family
        </p>
        <div className="grid lg:grid-cols-2 gap-8 ">
          <div data-aos="fade-up">
            <Image
              src={
                "https://emhealth.org/wp-content/uploads/sites/2/2022/11/iStock-802125010.jpg"
              }
              alt="Image"
              width={500}
              height={300}
              quality={100}
              className="h-full w-full rounded-xl"
            />
          </div>
          <div data-aos="fade-up" className="md:flex md:gap-4 lg:block">
            {/* Vision */}
            <div className="group mb-4">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-blue-100">
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-full tracking-wider">
                    VISION
                  </span>
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-semibold text-slate-900 mb-4">
                  To Shape an Africa Where Quality Home-Based Care is a Standard
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm md:text-base  leading-relaxed">
                  We envision a future where quality home-based care is not a
                  luxury — but a standard, accessible to every family in Africa.
                </p>
              </div>
            </div>
            {/* Mission */}
            <div data-aos="fade-up" className="group">
              <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-blue-700">
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-full tracking-wider">
                    MISSION
                  </span>
                </div>
                <h3 className="text-base md:text-lg lg:text-xl font-semibold text-white mb-4">
                  To Become the Leading Home Care Platform
                </h3>
                <p className="text-blue-50 text-xs sm:text-sm md:text-base leading-relaxed">
                  Were empowering families to live healthier, happier lives
                  through trusted support and compassionate, tech-driven
                  solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
     {/* why choose us  */}
      <div className="py-12 md:py-16">
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
    </div>
  );
};

export default MissionVision;
