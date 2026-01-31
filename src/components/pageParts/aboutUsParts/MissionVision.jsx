import { Handshake, Heart, Trophy } from "lucide-react";
import Image from "next/image";
import React from "react";
import WhyChooseUs from "../homeParts/WhyChooseUs";

const MissionVision = (data) => {
  console.log("mission vission", data?.data?.chooses);

  return (
    <div className="">
      <div className="py-10 lg:py-16">
        <h2 className="sectionHeading text-center mb-2">Our Core Values</h2>
        <p className="text-center text-slate-600 mb-8 lg:mb-10 text-sm lg:text-base">
          Everything we do is guided by three fundamental principles
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {data?.data?.ourCore &&
            data?.data?.ourCore?.map((item, indx) => (
              <div className="group transform transition duration-700 hover:scale-105 hover:shadow-lg">
                <div className="bg-white rounded-2xl p-4 lg:p-8 shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-[#72275b] h-full">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-red-50 mb-4 group-hover:scale-110 transition-transform">
                    <span
                      dangerouslySetInnerHTML={{ __html: item.icon }}
                      className="w-6 h-6"
                    />
                  </div>
                  <h3 className="subHeading mb-3">{item?.title}</h3>
                  <p className="text-sm   text-gray-700">{item?.description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {data?.data?.foundation && (
        <div className="py-10 lg:py-16">
          <h4 className="text-sm md:text-base text-center text-primary font-bold">
            Our Foundation
          </h4>
          <h2 className="sectionHeading text-center mb-2">
            {data?.data?.foundation?.heading}
          </h2>
          <p className="text-center text-slate-600  mb-8 lg:mb-10 text-sm lg:text-base">
            {data?.data?.foundation?.subheading}
          </p>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="relative">
              {data?.data?.foundation?.image && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${data?.data?.foundation?.image}`}
                  alt={data?.data?.foundation?.heading}
                  fill
                  // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-xl transition transform duration-500   hover:scale-105 hover:shadow-lg"
                />
              )}
              {/* <Image
                src={
                  "https://t3.ftcdn.net/jpg/06/34/06/68/360_F_634066834_nqO8BvBTKZZGD2bToETzZKnVttrDL26L.jpg"
                }
                alt="Image"
                width={500}
                height={300}
                quality={100}
                className="h-full w-full rounded-xl"
              /> */}
            </div>
            <div className="md:flex md:gap-4 lg:block">
              <div className="group group transform transition duration-700 hover:scale-105 hover:shadow-lg mb-4">
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-blue-100">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-orange-100 text-[#72275b] text-xs font-bold rounded-full tracking-wider">
                      VISION
                    </span>
                  </div>
                  <h3 className="subHeading mb-4">
                    {data?.data?.foundation?.vision_title}
                  </h3>
                  <p className="text-slate-600 text-sm  leading-relaxed">
                    {data?.data?.foundation?.vision_subtitle}
                  </p>
                </div>
              </div>

              <div className="group transform transition duration-700 hover:scale-105 hover:shadow-lg">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-blue-700">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-2 bg-emerald-400 text-white text-xs font-bold rounded-full tracking-wider">
                      MISSION
                    </span>
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold text-white mb-4">
                    {data?.data?.foundation?.mission_title}
                  </h3>
                  <p className="text-blue-50  text-sm leading-relaxed">
                    {data?.data?.foundation?.mission_subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* why choose us  */}
      <WhyChooseUs Data={data?.data} />
    </div>
  );
};

export default MissionVision;
