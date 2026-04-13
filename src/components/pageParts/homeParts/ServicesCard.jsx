"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ServicesCard = ({ services }) => {
  const [loaded, setLoaded] = useState(false);
  const imageSrc = services?.image
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${services.image}`
    : "/placeholder.jpg";
  return (
    <>
      <Link href={"/specialist"}>
        <div className="group  relative overflow-hidden rounded-xl  transition-all duration-500 ">
          <div className="relative h-80 w-full overflow-hidden rounded-xl bg-background">
            <div className="relative h-64 w-full overflow-hidden">
              {!loaded && (
                <Image
                  src="/placeholder.png"
                  alt="placeholder"
                  fill
                  className="object-cover blur-sm scale-105"
                />
              )}

              <Image
                src={imageSrc}
                alt={services.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                  loaded ? "opacity-100" : "opacity-0"
                }`}
                quality={70}
                loading="lazy"
                onLoadingComplete={() => setLoaded(true)}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/10"></div>
          </div>

          <div className="bg-white  relative -mt-18 rounded-2xl mx-4 p-6 text-center border-2 border-gray-100 group-hover:bg-primary group-hover:border-primary group-hover:-mt-22 transition-all duration-500">
            <div className="flex justify-center mb-4">
              <div className="bg-primary border border-white rounded-full text-white p-4 flex items-center justify-center">
                <span
                  dangerouslySetInnerHTML={{ __html: services.icon }}
                  className="w-6 h-6"
                />
              </div>
            </div>
            <h3 className="text-base lg:text-lg font-semibold text-gray-900  group-hover:text-white mb-2">
              {services?.title}
            </h3>
            <p className="text-sm group-hover:text-white text-gray-700 leading-relaxed">
              “{services?.subtitle?.split(" ").slice(0, 10).join(" ")}
              {services?.subtitle?.split(" ").length > 10 ? "..." : ""}”
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default ServicesCard;
