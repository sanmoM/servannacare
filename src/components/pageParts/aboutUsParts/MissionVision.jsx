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
import WhyChooseUs from "../homeParts/WhyChooseUs";

const MissionVision = () => {
  
  return (
    <div className="">

     {/* Core Values */}
      <div className="py-10 lg:py-16">
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
              <h3 className="subHeading mb-3">
                Empathy
              </h3>
              <p className="text-sm   text-gray-700">
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
              <h3 className="subHeading mb-3">
                Professionalism
              </h3>
              <p className="text-sm   text-gray-700">
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
              <h3 className="subHeading mb-3">
                Teamwork
              </h3>
              <p className="text-sm  text-gray-700">
                We collaborate effectively to ensure every client and caregiver
                experience is supportive and seamless.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Grid */}
      <div className="py-10 lg:py-16">
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
                "https://t3.ftcdn.net/jpg/06/34/06/68/360_F_634066834_nqO8BvBTKZZGD2bToETzZKnVttrDL26L.jpg"
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
                <h3 className="subHeading mb-4">
                  To Shape an Africa Where Quality Home-Based Care is a Standard
                </h3>
                <p className="text-slate-600 text-sm  leading-relaxed">
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
                <h3 className="text-base lg:text-lg font-semibold text-white mb-4">
                  To Become the Leading Home Care Platform
                </h3>
                <p className="text-blue-50  text-sm leading-relaxed">
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
      <WhyChooseUs/>
    </div>
  );
};

export default MissionVision;
