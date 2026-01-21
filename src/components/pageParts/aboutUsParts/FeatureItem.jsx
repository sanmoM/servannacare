import React from "react";

const FeatureItem = ({ feature }) => {
  console.log(feature)
  return (
    <div data-aos="fade-up">
      <div className="flex items-start space-x-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
        <div className="flex-shrink-0  w-12 h-12 rounded-full border border-primary flex items-center justify-center">
          {/* <Icon width={"32"} className={"text-primary "} /> */}
          <span
            dangerouslySetInnerHTML={{ __html: feature.icon }}
            className="w-8 h-6"
          />
        </div>
        <div className="flex-grow">
          <h3 className="subHeading">{feature.title}</h3>
          <p className="text-gray-600 text-sm">{feature.subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureItem;
