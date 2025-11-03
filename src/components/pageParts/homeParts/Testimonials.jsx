"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/utilities/data";
import Container from "@/components/shared/Container";

export default function Testimonials() {
  return (
    <section className="w-full py-12 md:py-18 bg-[#f4fcfe]">

        <Container>
          {/* Header Section */}
          <div className="mb-8 md:mb-12">
            
            <h2 className="sectionHeading">
              Trusted by Industry Leaders
            </h2>
            
          </div>

          {/* Swiper Carousel */}
          <div className="relative">
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
              {testimonials.map((t) => (
                <SwiperSlide key={t.id}>
                  <TestimonialCard testimonial={t} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <button
              className="swiper-button-prev-custom absolute -left-6 md:-left-16 top-1/3 z-10 w-12 h-12 rounded-full border-2 border-border hover:border-primary  hover:bg-primary/10  bg-primary hover:text-primary flex items-center text-white justify-center transition-all duration-300 hover:scale-110"
              aria-label="Previous testimonial"
            >
             
              <ChevronLeft />
            </button>

            <button
              className="swiper-button-next-custom absolute -right-6 md:-right-16 top-1/3 z-10 w-12 h-12 rounded-full border-2 border-border hover:border-primary text-white bg-primary hover:bg-primary/10  hover:text-primary flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Next testimonial"
            >
               <ChevronRight />
            </button>

            {/* Pagination Dots */}
            {/* <div className="swiper-pagination-custom flex justify-center gap-3 mt-12" /> */}
          </div>

          {/* Stats Section */}
          <div  className="grid grid-cols-3 lg:gap-12 gap-4 md:gap-6 lg:mt-24 mt-6  pt-16 border-t border-border">
            {[
              { number: "500+", label: "Happy Clients" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "4.9★", label: "Average Rating" },
            ].map((stat, idx) => (
              <div data-aos="zoom-in-up" key={idx} className="text-center">
                <p className="sm:text-2xl text-lg md:text-5xl font-bold text-foreground mb-3">
                  {stat.number}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>


      {/* Custom Pagination Styles */}
      {/* <style jsx>{`
        :global(.swiper-pagination-custom .swiper-pagination-bullet) {
          background-color: var(--muted);
          width: 8px;
          height: 8px;
          opacity: 0.4;
          transition: all 0.3s ease;
          margin: 0 6px;
        }

        :global(.swiper-pagination-custom .swiper-pagination-bullet-active) {
          background-color: var(--primary);
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }

        :global(.swiper-pagination-custom .swiper-pagination-bullet:hover) {
          opacity: 0.7;
        }
      `}</style> */}
    </section>
  );
}

function TestimonialCard({ testimonial }) {
  return (
    <div className="h-full">
      <div className="bg-card border border-border rounded-xl p-8 h-full flex flex-col hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 group">
        {/* Quote Icon */}
        <Quote className="w-8 h-8 text-primary mb-6" />

        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-yellow-400 fill-yellow-400 transition-transform duration-200 group-hover:scale-110"
            />
          ))}
        </div>

        {/* Testimonial Content */}
        <p className="text-card-foreground text-base leading-relaxed mb-8 flex-grow font-light italic">
          “{testimonial.content}”
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-border mb-6" />

        {/* Client Info */}
        <div className="flex items-center gap-4">
          <img
            src={testimonial.image || "/placeholder.svg"}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-card-foreground text-sm">
              {testimonial.name}
            </p>
            <p className="text-xs text-muted-foreground font-light">
              {testimonial.role} • {testimonial.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
