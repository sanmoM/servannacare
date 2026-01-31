"use client";
import MissionVision from "@/components/pageParts/aboutUsParts/MissionVision";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { useFetch } from "@/hooks/useFetch";
import { Handshake, Shield, Star } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const page = () => {
  const [abouts, setAbouts] = useState(null);
  console.log("abouts", abouts?.ourCore);
  const description = abouts?.about?.description || "";
  const boldWords = ["Myhauzhelp", "Cervanna"];
  const { data, isLoading, error } = useFetch("/abouts");

  useEffect(() => {
    if (data?.data) {
      setAbouts(data.data.data);
    }
  }, [data]);

  if (isLoading) return <LoadingSpinner/>;
  if (error) return <div>Error loading data</div>;

  const features = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security with 99.9% uptime guarantee to keep your business running smoothly",
    },
    {
      icon: Handshake,
      title: "Expert Partnership",
      description:
        "Dedicated support team with industry experts ready to help you succeed every step of the way",
    },
    {
      icon: Star,
      title: "Premium Quality",
      description:
        "Proven solutions delivering measurable results with consistent excellence and innovation",
    },
  ];
  return (
    <div className="bg-white">
      <PageBanner
        title="Begin Your Care Journey"
        image="https://s.yimg.com/ny/api/res/1.2/OlmuAmSCKyL0px34Qwt1GA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzU-/https://media.zenfs.com/en/healthcare_dive_849/ea20ce12e4f3e4194d01260415c8de49"
      />
      <Container>
        <div className="grid grid-cols-1 py-10 lg:py-16 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {abouts?.about && (
              <div>
                <h4
                  data-aos="fade-up"
                  className="text-sm md:text-base text-primary font-bold"
                >
                  ABOUT US
                </h4>
                <h2 data-aos="fade-up" className="sectionHeading my-4">
                  {abouts?.about?.title}
                </h2>
                <p
                  data-aos="fade-up"
                  className="text-sm text-justify text-gray-700"
                >
                  {description
                    .split(new RegExp(`(${boldWords.join("|")})`, "g"))
                    .map((part, index) => {
                      return boldWords.includes(part) ? (
                        <span key={index} className="font-bold">
                          {part}
                        </span>
                      ) : (
                        part
                      );
                    })}
                </p>
              </div>
            )}
            <div className="sm:flex space-y-2 justify-evenly mt-6">
              {abouts?.about?.items.map((feature, index) => {
                // const Icon = feature.icon;
                return (
                  <div
                    data-aos="fade-up"
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-100">
                        {/* <Icon
                          className="h-6 w-6 text-cyan-600"
                          aria-hidden="true"
                        /> */}
                          <span
                        dangerouslySetInnerHTML={{ __html: feature.tag_icon }}
                        className="w-6 h-6"
                      />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="subHeading mb-1">{feature?.tag}</h3>
                      {/* <p className="text-sm text-slate-600 leading-relaxed">
                        {feature.description}
                      </p> */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div data-aos="fade-up" className="lg:col-span-2">
            <div className="h-full w-full">
              <Image
                src={
                  "https://cdn.sanity.io/images/0vv8moc6/pharmacytimes/6ad2607601bcc3a135cac39408bd3655125a524d-5767x3732.jpg?fit=crop&auto=format"
                }
                height={800}
                width={300}
                alt="image"
                className="h-full rounded-xl w-full"
              />

              {abouts?.about?.image && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${abouts?.about?.image}`}
                  alt={abouts?.about?.title}
                  fill
                  // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                />
              )}
            </div>
          </div>
        </div>

        <MissionVision data={abouts}/>
      </Container>
    </div>
  );
};

export default page;
