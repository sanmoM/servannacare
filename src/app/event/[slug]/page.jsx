"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useSearchParams, useParams } from "next/navigation";
import { Calendar, MapPin, ArrowLeft, Sparkles, Images, Award, HeartHandshake, ChevronLeft, ChevronRight, X, Quote } from "lucide-react";
import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useFetch } from "@/hooks/useFetch";
import { getEventImageUrl, formatEventDate, cleanRichDescription, getEventEditionBadge, extractHighlights, createEventSlug } from "@/lib/event-utils";

export default function EventDetailsPage() {
  const searchParams = useSearchParams();
  const routeParams = useParams();
  const paramsId = searchParams.get("id");
  const slugParam = routeParams?.slug;

  const { data, isLoading, error } = useFetch("/events");

  const eventsList = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.events)) return data.data.events;
    if (Array.isArray(data?.events)) return data.events;
    return [];
  }, [data]);

  const event = useMemo(() => {
    if (eventsList.length === 0) return null;
    if (paramsId) {
      const found = eventsList.find((e) => String(e.id) === String(paramsId));
      if (found) return found;
    }
    if (slugParam) {
      const foundBySlug = eventsList.find((e) => createEventSlug(e.title) === String(slugParam).toLowerCase());
      if (foundBySlug) return foundBySlug;
    }
    return eventsList[0] || null;
  }, [eventsList, paramsId, slugParam]);

  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(null);

  if (isLoading) return <LoadingSpinner />;
  if (error || !event) return notFound();

  const badgeInfo = getEventEditionBadge(event?.title);
  const highlights = extractHighlights(event);
  const partners = event?.items || [];
  console.log(partners);
  const eventDate = formatEventDate(event?.created_at);

  const allGalleryPhotos = [];
  if (event?.image) allGalleryPhotos.push(event.image);
  if (Array.isArray(event?.gallery_images)) {
    event.gallery_images.forEach((img) => {
      if (!allGalleryPhotos.includes(img)) allGalleryPhotos.push(img);
    });
  }

  const handlePrevLightbox = () => {
    setSelectedGalleryIdx((prev) => (prev === 0 ? allGalleryPhotos.length - 1 : prev - 1));
  };

  const handleNextLightbox = () => {
    setSelectedGalleryIdx((prev) => (prev === allGalleryPhotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-[#FAF7F9]/40 min-h-screen">
      <PageBanner image={getEventImageUrl(event?.image)} title={event?.title} height="h-[32vh]" />

      <Container className="py-8 sm:py-12 lg:py-16">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/event" className="inline-flex items-center gap-2 text-sm font-semibold text-[#72275B] hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Events</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <article className="lg:col-span-8 space-y-8">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1.5 font-medium text-gray-700 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <Calendar className="w-4 h-4 text-[#72275B]" />
                  {eventDate}
                </span>

                {event?.venue && (
                  <span className="flex items-center gap-1.5 text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    {event.venue}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">{event.title}</h1>
            </div>

            {/* Featured Hero Photo */}
            <div className="relative aspect-16/9 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-gray-900">
              <Image src={getEventImageUrl(event.image)} alt={event.title} fill priority sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" />
            </div>

            {/* Quote Banner */}
            {event?.quote && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-rose-50/50 to-amber-50/40 border border-purple-100 flex items-start gap-4">
                <Quote className="w-6 h-6 text-[#72275B] shrink-0 mt-1" />
                <div>
                  <p className="text-base sm:text-lg font-semibold italic text-[#400022] leading-snug">{event.quote}</p>
                  <p className="text-xs text-gray-500 mt-2 font-medium">— Transformed for Better Movement Vision</p>
                </div>
              </div>
            )}

            {/* Key Sessions Pills */}
            {highlights && highlights.length > 0 && (
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3">
                <h3 className="text-xs font-bold text-[#72275B] uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Key Learning Sessions & Experts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-start gap-2.5">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-snug">{item.title}</p>
                        {item.speaker && <p className="text-[11px] text-gray-600 mt-0.5">Led by {item.speaker}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sanitized Rich Description */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs">
              <div
                dangerouslySetInnerHTML={{
                  __html: cleanRichDescription(event.description),
                }}
                className="prose prose-base max-w-none text-gray-700 leading-relaxed
                  [&>p]:mb-4 [&>p]:leading-relaxed
                  [&>p>strong]:text-gray-900 [&>p>strong]:font-bold
                  [&>p>em]:text-gray-800 [&>p>em]:font-medium
                  [&>p:has(strong)]:mt-6"
              />
            </div>

            {/* Photo Gallery Grid */}
            {allGalleryPhotos.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Images className="w-5 h-5 text-[#72275B]" />
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900">Event Gallery Moments ({allGalleryPhotos.length})</h3>
                  </div>
                  <span className="text-xs text-gray-500 hidden sm:inline">Click any photo to enlarge</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {allGalleryPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedGalleryIdx(idx)}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-2xs hover:shadow-md cursor-pointer transition-all"
                    >
                      <Image
                        src={getEventImageUrl(photo)}
                        alt={`Event gallery ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {partners.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-[#72275B]" />
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900">Collaborating Partners</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Organizations and sponsors that supported this edition</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                  {partners.map((partner) => {
                    const partnerImg = partner.image ? getEventImageUrl(partner.image) : null;
                    return (
                      <div
                        key={partner.id}
                        className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-purple-200 hover:shadow-xs transition-all flex items-center gap-3"
                      >
                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {partnerImg ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${partner?.image}`}
                              alt={partner.name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <span className="text-sm font-bold text-[#72275B]">{partner.name.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-gray-900 leading-tight">{partner.name}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">Official Sponsor</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </article>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <h4 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3">Event Information</h4>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-xs text-gray-400 block font-medium uppercase">Initiative</span>
                  <p className="font-semibold text-gray-800">Transformed for Better (TFB)</p>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block font-medium uppercase">Edition</span>
                  <p className="font-semibold text-[#72275B]">{badgeInfo.label}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block font-medium uppercase">Date Held</span>
                  <p className="font-medium text-gray-700">{eventDate}</p>
                </div>

                {event?.venue && (
                  <div>
                    <span className="text-xs text-gray-400 block font-medium uppercase">Venue / Location</span>
                    <p className="font-medium text-gray-700">{event.venue}</p>
                  </div>
                )}

                <div>
                  <span className="text-xs text-gray-400 block font-medium uppercase">Host Organization</span>
                  <p className="font-medium text-gray-700">Servanna (formerly MyHauzHelp)</p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <Link href="/contact-us" className="block">
                  <Button className="w-full bg-[#72275B] hover:bg-[#5b1f49] text-white cursor-pointer font-semibold">Inquire About Next Edition</Button>
                </Link>
              </div>
            </div>

            {eventsList.length > 1 && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
                <h4 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-3 mb-4">Other Movement Editions</h4>

                <div className="space-y-4">
                  {eventsList
                    .filter((e) => e.id !== event.id)
                    .map((otherEvent) => {
                      const otherSlug = createEventSlug(otherEvent.title);
                      const otherDate = formatEventDate(otherEvent.created_at);

                      return (
                        <Link
                          key={otherEvent.id}
                          href={`/event/${otherSlug}?id=${otherEvent.id}`}
                          className="group flex gap-3 items-start p-2 rounded-xl hover:bg-purple-50/50 transition-colors"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            <Image
                              src={getEventImageUrl(otherEvent.image)}
                              alt={otherEvent.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-[#72275B]" />
                              {otherDate}
                            </span>
                            <p className="font-semibold text-xs text-gray-900 group-hover:text-[#72275B] line-clamp-2 mt-0.5 leading-snug">
                              {otherEvent.title}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#400022] to-[#72275B] text-white shadow-md space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">Empowered Caregivers</span>
              <h5 className="font-bold text-lg leading-tight">Hire Trained & Certified Domestic Specialists</h5>
              <p className="text-xs text-white/80 leading-relaxed">
                Connect with professional house managers, certified nannies, and caregivers trained in first aid, child safety, and home wellbeing.
              </p>
              <Link href="/specialist" className="block pt-2">
                <Button className="w-full bg-white hover:bg-white/90 text-[#400022] font-bold cursor-pointer">Find a Specialist</Button>
              </Link>
            </div>
          </aside>
        </div>
      </Container>

      {selectedGalleryIdx !== null && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          {/* Top Bar */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
            <span className="text-sm font-medium">
              Photo {selectedGalleryIdx + 1} of {allGalleryPhotos.length}
            </span>
            <button
              onClick={() => setSelectedGalleryIdx(null)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handlePrevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center">
            <Image src={getEventImageUrl(allGalleryPhotos[selectedGalleryIdx])} alt="Lightbox" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}
