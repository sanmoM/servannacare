"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/utilities/data";
import Container from "@/components/shared/Container";
import Input from "@/components/shared/Input";
import { Button } from "@/components/ui/button";
import { postApi } from "@/lib/apiHandler";
import toast from "react-hot-toast";
import { useFetch } from "@/hooks/useFetch";
import LoadingSpinner from "@/components/shared/LoadingSpin";

export default function Testimonials({ homeData }) {
  const [startCount, setStartCount] = useState(false);
  const sectionRef = useRef(null);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [homeFeedback, setHomeFeedback] = useState(null);
  console.log("dfdf", homeFeedback);
  const { data, isLoading } = useFetch("/home-feedback");
  useEffect(() => {
    if (data) {
      setHomeFeedback(data?.data?.data ?? data);
    }
  }, [data]);

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await postApi("subscribe", {
        email,
      });

      if (!res.status) {
        throw new Error();
      }

      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartCount(true);
        }
      },
      { threshold: 0.4 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error loading data</div>;

  return (
    <section className="w-full py-10 md:py-16 bg-[#ccb7c65b]">
      <Container>
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="sectionHeading text-center">
            Trusted by Industry Leaders
          </h2>
        </div>

        {/* Swiper Carousel */}
        <div className="relative  px-6">
          <Swiper
            modules={[Autoplay, Navigation]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            pagination={{
              el: ".swiper-pagination-custom",
              clickable: true,
              type: "bullets",
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
            }}
            className="pb-24"
          >
            {homeFeedback?.map((item) => (
              <SwiperSlide key={item.id}>
                <TestimonialCard testimonial={item} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <button
            className="swiper-button-prev-custom absolute -left-3 md:-left-0 top-1/3 z-10 w-12 h-12 rounded-full border-2 border-border hover:border-primary  hover:bg-primary/10  bg-primary hover:text-primary flex items-center text-white justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
            aria-label="Previous testimonial"
          >
            <ChevronLeft />
          </button>

          <button
            className="swiper-button-next-custom absolute -right-3 md:-right-0 top-1/3 z-10 w-12 h-12 rounded-full border-2 border-border hover:border-primary text-white bg-primary hover:bg-primary/10 cursor-pointer hover:text-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight />
          </button>

          {/* Pagination Dots */}
          {/* <div className="swiper-pagination-custom flex justify-center gap-3 mt-12" /> */}
        </div>

        {/* CTA section */}
        <div className="bg-gradient-to-tl rounded-2xl mt-16 from-primary to-secondary md:py-24 py-8  px-2 sm:px-6 lg:px-8">
          <div className="mx-auto text-center sm:max-w-2xl">
            <h2 className="sectionHeading  text-gray-200">
              {homeData?.newsLetter?.title ? homeData?.newsLetter?.title : ""}
            </h2>
            <p className="text-gray-300 my-6 my:mb-8 max-w-xl mx-auto  text-xs lg:text-sm">
              {homeData?.newsLetter?.sub_title
                ? homeData?.newsLetter?.sub_title
                : ""}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-1 items-center justify-center">
              <Input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-full"
              />

              <Button
                size="lg"
                onClick={handleSubscribe}
                disabled={loading}
                className="rounded-full hover:bg-secondary w-full sm:w-auto cursor-pointer"
              >
                {loading ? "SUBSCRIBING..." : "SUBSCRIBE"}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  const { message, rating, specialist } = testimonial;

  const words = message?.split(" ") || [];
  const shortMessage =
    words.slice(0, 16).join(" ") + (words.length > 16 ? "..." : "");

  return (
    <div data-aos="fade-up" className="h-full">
      <div className="bg-card border border-border rounded-xl h-full flex flex-col hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 group">
        <div className="px-6 pt-8">
          <Quote className="w-8 h-8 text-primary mb-6" />

          {/* Dynamic Stars */}
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  i < Number(rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <p className="text-card-foreground text-sm lg:text-base leading-relaxed mb-8 font-light italic">
            “{shortMessage}”
          </p>
        </div>

        {/* Client Info */}
        <div className="flex bg-primary p-6 rounded-b-2xl items-center gap-4">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${specialist?.profilePhoto}`}
            alt={specialist?.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-gray-100 text-sm">
              {specialist?.name}
            </p>
            <p className="text-xs text-gray-200 font-light">
              {specialist?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
