import MissionVision from "@/components/pageParts/aboutUsParts/MissionVision";
import Container from "@/components/shared/Container";
import PageBanner from "@/components/shared/PageBanner";
import { Handshake, Shield, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

const page = () => {
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
        title="Begin Your Healing "
        image="https://s.yimg.com/ny/api/res/1.2/OlmuAmSCKyL0px34Qwt1GA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyMDA7aD02NzU-/https://media.zenfs.com/en/healthcare_dive_849/ea20ce12e4f3e4194d01260415c8de49"
      />
      <Container>
        <div className="grid grid-cols-1 py-16 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <h4 data-aos="fade-up" className="text-sm md:text-base text-primary font-bold">ABOUT US</h4>
            <h2 data-aos="fade-up" className="sectionHeading my-4">
              Your Trusted Partner in Best Improvement.
            </h2>
            <p data-aos="fade-up" className=" text-xs sm:text-sm md:text-base text-justify text-gray-700">
              Servana was born out of the lessons we learned building
              <span className="font-bold"> Myhauzhelp</span>. With MyHauzHelp,
              we saw firsthand the challenges working families face when looking
              for trustworthy home-based care and household support. We believe
              that true care begins at home. We are a tech-enabled home care
              platform dedicated to supporting families with trusted,
              professional help — whether it&apos;s medical support or
              day-to-day household assistance. We serve what matters most: your
              home and your health. Our mission is to create safe, well-managed,
              and healthy living environments by connecting you with the right
              support, exactly when you need it. From qualified medical
              caregivers — such as nurses and nurse aides — to experienced
              domestic workers, we bring care directly to your doorstep. We
              understand the pace and pressure of modern life. Whether
              you&apos;re a working parent, caring for an elderly loved one,
              recovering from surgery, or adjusting to life after childbirth,
              Servana makes home care seamless and stress-free. With{" "}
              <span className="font-bold"> Servana</span>, care isn&apos;t just
              a service — it&apos;s a promise.
            </p>
            <div className="sm:flex space-y-2 justify-evenly mt-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div data-aos="fade-up" key={index} className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-cyan-100">
                        <Icon
                          className="h-6 w-6 text-cyan-600"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm lg:text-base font-semibold text-slate-900 mb-1">
                        {feature.title}
                      </h3>
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
            </div>
          </div>
        </div>
        <MissionVision/>
      </Container>
    </div>
  );
};

export default page;
