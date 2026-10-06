"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Eye, Images, Award, Sparkles, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getEventImageUrl, getExcerpt, formatEventDate, getEventEditionBadge, extractHighlights, createEventSlug } from "@/lib/event-utils";

export default function EventCard({ event }) {
  const [imgSrc, setImgSrc] = useState(getEventImageUrl(event?.image));

  const slug = createEventSlug(event?.title);
  const badgeInfo = getEventEditionBadge(event?.title);
  const highlights = extractHighlights(event);
  const partners = event?.items || [];

  const eventDate = formatEventDate(event?.created_at);
  const excerpt = getExcerpt(event?.description, 175);

  return (
    <article
      data-aos="fade-up"
      className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200/80 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-gray-100">
        <Image
          src={imgSrc}
          alt={event?.title || "Event Image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => {}}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
          <Badge className={`${badgeInfo.badgeClass} border font-medium text-xs px-2.5 py-1 shadow-sm backdrop-blur-md`}>{badgeInfo.label}</Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-3 text-white z-10 flex flex-wrap items-center justify-between text-xs font-medium gap-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
            <Calendar className="w-3.5 h-3.5 text-white" />
            <span>{eventDate}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
  
        <h3 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-[#72275B] transition-colors leading-snug line-clamp-2">
          <Link href={`/event/${slug}?id=${event?.id}`}>{event?.title}</Link>
        </h3>


        <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed">{excerpt}</p>

   
        


        {partners.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-[#72275B]" />
              <span className="font-medium text-gray-700">Partners:</span>
            </div>
            <div className="flex items-center -space-x-1.5 overflow-hidden">
              {partners.slice(0, 4).map((pt, pIdx) => {
                const ptImg = pt.image ? getEventImageUrl(pt.image) : null;
                return (
                  <div
                    key={pt.id || pIdx}
                    title={pt.name}
                    className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden flex items-center justify-center shadow-xs"
                  >
                    {ptImg ? (
                      <img src={ptImg} alt={pt.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] font-bold text-gray-600 uppercase">{pt.name?.charAt(0) || "P"}</span>
                    )}
                  </div>
                );
              })}
              {partners.length > 4 && (
                <span className="w-6 h-6 rounded-full border-2 border-white bg-purple-100 text-[#72275B] text-[10px] font-bold flex items-center justify-center shadow-xs">
                  +{partners.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

    
        <div className="mt-auto pt-5 flex items-center gap-2">
          <Link href={`/event/${slug}?id=${event?.id}`} className="flex-1">
            <Button className="w-full bg-[#72275B] hover:bg-[#5b1f49] text-white font-medium cursor-pointer transition-all shadow-sm group-hover:shadow">
              <span>Explore Recap</span>
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
