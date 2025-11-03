"use client";

import React from "react";

const PageBanner = ({ 
  title = "Explore Our Services", 
  image = "https://www.who.int/images/default-source/imported/men-health-blood-pressure-measuring.jpg?sfvrsn=89ae0f2b_10",
  gradient = "from-secondary via-secondary/70 to-transparent",
  height = "h-[30vh]"
}) => {
  return (
    <div className={`relative ${height} flex items-center justify-center`}>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${image}')`,
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient}`}></div>

      {/* Text Content */}
      <div className="relative z-10 text-center">
        <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl text-white drop-shadow-lg">
          {title}
        </h2>
      </div>
    </div>
  );
};

export default PageBanner;
