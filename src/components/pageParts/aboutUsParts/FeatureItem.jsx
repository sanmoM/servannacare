import React from "react";

const FeatureItem = ({ feature }) => {
  const Icon = feature.icon;
  return (
    <div data-aos="fade-up">
      <div className="flex items-start space-x-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className="flex-shrink-0  w-12 h-12 rounded-full border border-primary flex items-center justify-center">
          <Icon width={"32"} className={"text-primary "} />
        </div>
        <div className="flex-grow">
          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-gray-900">
            {feature.title}
          </h3>
          <p className="text-gray-600 sm:text-sm md:text-base">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureItem;
