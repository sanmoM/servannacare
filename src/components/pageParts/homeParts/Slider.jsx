"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slides } from "@/utilities/data";
import { Button } from "@/components/ui/button";
import Searchbar from "./Searchbar";

const Slider = () => {
  const [swiperRef, setSwiperRef] = useState(null);

  return (
    <>
      <div className="relative w-full h-[60vh] md:h-[50vh] lg:h-[80vh] overflow-hidden z-10">
        <Swiper
          onSwiper={setSwiperRef}
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop
          speed={800}
          className="w-full h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="h-full w-full">
              <div
                className="relative w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('${slide.image.src}')`,
                }}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent" />

                {/* Text container vertically centered */}
                <div className="absolute inset-0 flex mb-16 lg:mb-0 items-center">
                  <div className="max-w-7xl mx-auto w-full px-4 lg:px-0">
                    <div className="lg:max-w-4xl md:max-w-2xl mx-auto text-center ">
                      <h1 className="text-lg sm:text-3xl md:text-5xl xl:text-6xl 2xl:text-6xl font-bold text-white mb-4 leading-snug">
                        {slide.title}
                      </h1>
                      <p className="text-xs sm:text-sm md:text-base lg:text-xl  text-gray-200 mb-8 leading-relaxed">
                        {slide.subtitle}
                      </p>
                      <Button className="px-8 py-4 text-sm md:text-lg font-medium">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Next button */}
        <button
          onClick={() => swiperRef?.slideNext()}
          className="absolute bottom-14 cursor-pointer hidden lg:block right-8 z-30 p-3 bg-primary hover:bg-primary/90 rounded-full text-white transition-colors duration-300"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Prev button */}
        <button
          onClick={() => swiperRef?.slidePrev()}
          className="absolute bottom-14 cursor-pointer hidden lg:block right-24 z-30 p-3 bg-primary hover:bg-primary/90 rounded-full text-white transition-colors duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>
      <Searchbar />
    </>
  );
};

export default Slider;
