"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  Heart,
  Target,
  Users2,
  CheckCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Container from "@/components/shared/Container";
import PageBanner from "@/components/shared/PageBanner";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import EventsSection from "./EventsSection";

const EventsClient = () => {
  const { data, isLoading, error } = useFetch("/events");

  const resolvedEvents = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.events)) return data.data.events;
    if (Array.isArray(data?.events)) return data.events;
    return [];
  }, [data]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Failed to load events</h2>
        <p className="text-sm text-gray-600 mt-1 max-w-md">
          There was an issue fetching events from the server. Please check your connection or try again later.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#72275B] hover:bg-[#5b1f49] text-white cursor-pointer"
        >
          Reload Page
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F9]/40 min-h-screen">
      
      <PageBanner
        image="https://www.goodwin.edu/landingpages/files/images/nursing-programs-main-header.jpg"
        title="Transformed For Better Movement"
        height="h-[36vh]"
      />

     
      <section className="border-b border-purple-100/60 bg-white py-12 lg:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      
            <div data-aos="fade-right" className="lg:col-span-7 space-y-4">
           

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
                Shaping Homes of Empathy, Respect & Dignity
              </h2>

              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                <strong className="text-gray-900">Transformed for Better</strong> is
                Servanna’s signature mission-driven initiative. We bring
                together employers, house managers, and childcare specialists to
                reshape how families view domestic care.
              </p>

              <p className="text-gray-600 text-sm leading-relaxed">
                By investing in first-aid readiness, maternal and child
                wellbeing, autism-inclusive caregiving, and financial
                literacy, we transform domestic work from uncelebrated labor into
                a respected and dignified profession.
              </p>

              {/* Pillars list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Target className="w-4 h-4 text-[#72275B]" />
                    <h4 className="text-sm font-bold text-[#72275B] uppercase tracking-wide">
                      Our Vision
                    </h4>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    To lead the continent in de-stigmatizing and professionalizing
                    domestic work, ensuring every caregiver is valued and heard.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Users2 className="w-4 h-4 text-[#9b1c5c]" />
                    <h4 className="text-sm font-bold text-[#9b1c5c] uppercase tracking-wide">
                      Our Mission
                    </h4>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Equipping house managers with life-saving skills while
                    guiding employers to build emotionally safe and cooperative
                    homes.
                  </p>
                </div>
              </div>
            </div>

          
            <div data-aos="fade-left" className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white group">
                <div className="relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src="/group.jpg"
                    alt="Transformed For Better Movement"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                   
                    <p className="text-base font-bold text-white mt-1">
                      “When homes are transformed for better, society is
                      transformed for good.”
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white flex items-center justify-end text-xs text-gray-600">
                 
                  <Link
                    href="/specialist"
                    className="text-[#72275B] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Specialists</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

   
      <EventsSection
        events={resolvedEvents}
        showHero={true}
        showPartners={true}
        showCta={true}
      />
    </div>
  );
};

export default EventsClient;
