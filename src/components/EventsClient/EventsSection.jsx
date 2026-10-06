"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Search, ArrowRight,  ShieldCheck} from "lucide-react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import EventCard from "./EventCard";
import { getEventImageUrl } from "@/lib/event-utils";

export default function EventsSection({ events = [], showHero = true, showPartners = true, showCta = true, className = "" }) {
  const eventList = useMemo(() => {
    return Array.isArray(events) ? events : [];
  }, [events]);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    return eventList.filter((ev) => {
      const titleLower = (ev?.title || "").toLowerCase();
      const descLower = (ev?.description || "").toLowerCase();

      if (activeFilter === "employer" && !titleLower.includes("employer")) {
        return false;
      }
      if (activeFilter === "house-manager" && !titleLower.includes("house manager")) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = titleLower.includes(query);
        const matchesDesc = descLower.includes(query);
        const matchesPartner = ev?.items?.some((p) => (p.name || "").toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesPartner;
      }

      return true;
    });
  }, [eventList, activeFilter, searchQuery]);

  const handleOpenQuickView = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const allPartners = useMemo(() => {
    const map = new Map();
    eventList.forEach((ev) => {
      if (Array.isArray(ev.items)) {
        ev.items.forEach((item) => {
          const key = item.name?.trim().toUpperCase();
          if (key && !map.has(key)) {
            map.set(key, item);
          }
        });
      }
    });
    return Array.from(map.values());
  }, [eventList]);

  return (
    <section className={`relative overflow-hidden ${className}`}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-100/40 via-rose-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <Container className="py-12 sm:py-16 lg:py-20">
        {showHero && (
          <div className="max-w-3xl mx-auto text-center mb-12 lg:mb-16">
            <h2 data-aos="fade-up" className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Elevating Caregivers. <span className="text-transparent bg-clip-text bg-primary">Transforming Homes.</span>
            </h2>

            <p data-aos="fade-up" data-aos-delay="100" className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
              Transformed for Better is Servanna’s mission-driven initiative dedicated to de-stigmatizing domestic work, empowering house managers with
              professional training, and fostering empathy-driven working relationships between employers and domestic workers.
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 border border-purple-100/80 shadow-md backdrop-blur-md"
            >
              <div className="p-3 text-center border-r border-gray-100 last:border-none">
                <p className="text-2xl sm:text-3xl font-extrabold text-primary">35+</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">House Managers Trained</p>
              </div>

              <div className="p-3 text-center border-r border-gray-100 last:border-none">
                <p className="text-2xl sm:text-3xl font-extrabold text-primary">{eventList.length > 0 ? `${eventList.length}+` : "2+"}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Milestone Editions</p>
              </div>

              <div className="p-3 text-center border-r border-gray-100 last:border-none">
                <p className="text-2xl sm:text-3xl font-extrabold text-primary">{allPartners.length > 0 ? `${allPartners.length}+` : "7+"}</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Partner Institutions</p>
              </div>

              <div className="p-3 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-primary">100%</p>
                <p className="text-xs font-medium text-gray-500 mt-0.5">Dignity & Impact Driven</p>
              </div>
            </div>
          </div>
        )}

        
        {eventList.length > 0 && (
          <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-2 p-1 bg-gray-100 rounded-xl">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeFilter === "all" ? "bg-white text-primary shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All Editions ({eventList.length})
              </button>
              <button
                onClick={() => setActiveFilter("employer")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeFilter === "employer" ? "bg-white text-primary shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Employer Editions
              </button>
              <button
                onClick={() => setActiveFilter("house-manager")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeFilter === "house-manager" ? "bg-white text-primary shadow-xs" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                House Managers Editions
              </button>
            </div>

     
            <div className="relative min-w-[220px] sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic, speaker, partner..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-2xs"
              />
            </div>
          </div>
        )}


        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} onQuickView={handleOpenQuickView} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">{eventList.length === 0 ? "No Events Available" : "No Matching Events"}</h3>
            <p className="text-gray-500 text-sm mt-1">
              {eventList.length === 0 ? "There are currently no events published from the API." : "No events found matching your search or filter."}
            </p>
            {eventList.length > 0 && (
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>
        )}

    
        {showPartners && allPartners.length > 0 && (
          <div className="mt-16 sm:mt-24 pt-12 border-t border-gray-200">
            <div className="text-center max-w-2xl mx-auto mb-10">
              
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">Proudly Supported by Visionary Partners</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                We are proud to partner with leading banks, maternal hospitals, institutions, and brands supporting the dignity of caregivers.
              </p>
            </div>

            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
              {allPartners.map((partner) => {
                const partnerImg = partner.image ? getEventImageUrl(partner.image) : null;
                return (
                  <div
                    key={partner.id || partner.name}
                    className="group bg-white p-4 rounded-xl border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2.5 h-28"
                  >
                    {partnerImg ? (
                      <div className="relative w-12 h-10 flex items-center justify-center">
                        <img
                          src={partnerImg}
                          alt={partner.name}
                          className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-primary font-bold text-xs flex items-center justify-center">
                        {partner.name?.charAt(0) || "P"}
                      </div>
                    )}
                    <span className="text-[11px] font-semibold text-gray-700 group-hover:text-primary line-clamp-2 leading-tight">{partner.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        
        {showCta && (
          <div
            data-aos="fade-up"
            className="mt-16 sm:mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-50 via-rose-50/50 to-amber-50/50 border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-2 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                
                Join the Movement
              </span>
              <h4 className="text-xl sm:text-2xl font-bold text-gray-900">Want to Sponsor or Attend the Next Edition?</h4>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                Partner with us to provide life skills, maternal health guidance, financial literacy, and career growth for domestic caregivers across Kenya.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link href="/contact-us">
                <Button className="bg-primary hover:bg-[#5b1f49] text-white font-semibold cursor-pointer shadow-sm">
                  <span>Get in Touch</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/specialist">
                <Button variant="outline" className="border-purple-200 text-primary hover:bg-white cursor-pointer">
                  Explore Trained Specialists
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
