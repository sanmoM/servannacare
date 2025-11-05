import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const ServicesCard = ({ services }) => {
  return (
    <>
      {/* <div  className="bg-gray-50 rounded-2xl p-6 text-center border-2 border-gray-100 hover:border-primary hover:shadow-md transition-all duration-500">
      <div className="flex justify-center mb-4">
        <div className="bg-primary rounded-full text-white p-4 flex items-center justify-center">{services.icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{services.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{services.description}</p>
    </div> */}

      <div className="group relative overflow-hidden rounded-xl  transition-all duration-500 ">
        <div className="relative h-80 w-full overflow-hidden rounded-xl bg-background">
          <img
            src={services.image || "/placeholder.svg"}
            alt={services.title}
            className="h-full w-full object-cover   transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/10"></div>
        </div>

        {/* <div className="relative -mt-12 mx-4 rounded-2xl bg-white p-8 text-center shadow-xl"> */}
        <div className="bg-white  relative -mt-18 rounded-2xl mx-4 p-6 text-center border-2 border-gray-100 group-hover:border-primary group-hover:-mt-22 transition-all duration-500">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full text-white p-4 flex items-center justify-center">
              {services.icon}
            </div>
          </div>
          <h3 className="subHeading mb-2">
            {services.title} 
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {services.description}
          </p>
        </div>
      </div>
    </>
  );
};

export default ServicesCard;
