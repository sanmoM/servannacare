import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const ServicesCard = ({ services }) => {
  return (
    <>
      
        <div className="group  relative overflow-hidden rounded-xl  transition-all duration-500 ">
          <div className="relative h-80 w-full overflow-hidden rounded-xl bg-background">
            <img
              src={services.image
              }
              alt={services.title}
              className="h-full w-full  object-cover   transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/10"></div>
          </div>

          {/* <div className="relative -mt-12 mx-4 rounded-2xl bg-white p-8 text-center shadow-xl"> */}
          <div className="bg-white  relative -mt-18 rounded-2xl mx-4 p-6 text-center border-2 border-gray-100 group-hover:bg-primary group-hover:border-primary group-hover:-mt-22 transition-all duration-500">
            <div className="flex justify-center mb-4">
              <div className="bg-primary border border-white rounded-full text-white p-4 flex items-center justify-center">
                {/* <span
                  dangerouslySetInnerHTML={{ __html: services.icon }}
                  className="w-6 h-6"
                /> */}
                {services.icon}
              </div>
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900  group-hover:text-white mb-2">
              {services.title}
            </h3>
            <p className="text-sm group-hover:text-white text-gray-700 leading-relaxed">
              {services.description}
            </p>
          </div>
        </div>
      
    </>
  );
};

export default ServicesCard;
