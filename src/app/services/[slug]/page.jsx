"use client";

import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  HeartHandshake,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";

const ServiceDetailsPage = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const paramsId = searchParams.get("id");
  const currentSlug = params?.slug;

  const [allServices, setAllServices] = useState([]);
  const [service, setService] = useState(null);

  const {
    data: servicesData,
    isLoading: servicesLoading,
    error: servicesError,
  } = useFetch("/services");

  const { data: homeData, isLoading: homeLoading } = useFetch("/home");

  useEffect(() => {
    let serviceList = [];
    if (servicesData?.data?.data?.service) {
      serviceList = servicesData.data.data.service;
    } else if (servicesData?.data?.service) {
      serviceList = servicesData.data.service;
    } else if (Array.isArray(servicesData?.data)) {
      serviceList = servicesData.data;
    } else if (homeData?.data?.data?.service) {
      serviceList = homeData.data.data.service;
    } else if (homeData?.service) {
      serviceList = homeData.service;
    }

    if (serviceList && serviceList.length > 0) {
      setAllServices(serviceList);

      let matchedService = null;
      if (paramsId) {
        matchedService = serviceList.find((s) => s.id === parseInt(paramsId));
      }

      if (!matchedService && currentSlug) {
        matchedService = serviceList.find((s) => {
          const itemSlug = s.title
            ?.toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_-]+/g, "-");
          return itemSlug === currentSlug || s.id === parseInt(currentSlug);
        });
      }

      setService(matchedService || null);
    }
  }, [servicesData, homeData, paramsId, currentSlug]);

  const isLoading = servicesLoading && homeLoading && !allServices.length;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (servicesError && !allServices.length) {
    return (
      <Container className="py-20 text-center">
        <p className="text-destructive font-medium text-lg">
          Failed to load service details. Please try again later.
        </p>
        <Link href="/services" className="mt-4 inline-block">
          <Button>Back to Services</Button>
        </Link>
      </Container>
    );
  }

  if (!isLoading && allServices.length > 0 && !service) {
    return notFound();
  }

  const rawDetails =
    service?.deatils || service?.details || service?.description || "";
  const sanitizedHtml =
    typeof window !== "undefined" && DOMPurify?.sanitize
      ? DOMPurify.sanitize(rawDetails)
      : rawDetails;

  const imageSrc = service?.image
    ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${service.image}`
    : "/placeholder.png";

  const getSlug = (item) =>
    item?.title
      ? item.title
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
      : `service-${item?.id}`;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      <PageBanner
        title={service?.title || "Service Details"}
        image={
          service?.image
            ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${service.image}`
            : undefined
        }
      />

      <div className="bg-white border-b border-gray-200">
        <Container className="py-3">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 flex-wrap">
            <Link
              href="/"
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link
              href="/services"
              className="hover:text-primary transition-colors"
            >
              Our Services
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-primary font-medium truncate max-w-xs">
              {service?.title}
            </span>
          </div>
        </Container>
      </div>

      <Container className="py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-10">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                {service?.icon && (
                  <div className="w-14 h-14 shrink-0 bg-primary/10 text-primary rounded-2xl flex items-center justify-center p-3 border border-primary/20">
                    <span
                      dangerouslySetInnerHTML={{ __html: service.icon }}
                      className="w-8 h-8 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
                    />
                  </div>
                )}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {service?.title}
                  </h1>
                </div>
              </div>

              {service?.image && (
                <div className="relative w-full h-64 sm:h-80 md:h-96 mt-6 overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                  <Image
                    src={imageSrc}
                    alt={service.title || "Service banner"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>

            {sanitizedHtml ? (
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    Service Details & Breakdown
                  </h2>
                </div>

                <div
                  className="text-gray-700 text-sm md:text-base leading-relaxed space-y-4
                    [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:text-primary [&_h2]:mt-6 [&_h2]:mb-3
                    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-5 [&_h3]:mb-2
                    [&_p]:text-gray-700 [&_p]:leading-relaxed [&_p]:my-3
                    [&_a]:text-primary [&_a]:underline [&_a]:font-medium hover:[&_a]:text-primary/80
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-3 [&_ul]:space-y-1.5
                    [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-3 [&_ol]:space-y-1.5
                    [&_li]:text-gray-700
                    [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-6 [&_img]:shadow-sm [&_img]:border [&_img]:border-gray-100
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4"
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                />
              </div>
            ) : null}

            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                Why Choose ServannaCare for {service?.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                      Vetted & Certified Specialists
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Our caregivers and specialists undergo thorough background
                      checks, professional vetting, and health certifications.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                      Personalized Care Plans
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Tailored support customized to your family&apos;s routine,
                      medical guidance, and individual comfort needs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                      Flexible & 24/7 Availability
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Choose between full-time live-in, daily visits, weekend
                      assistance, or round-the-clock emergency support.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                      Safe In-Home Comfort
                    </h4>
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      Receive quality, compassionate care in the familiar and
                      loving comfort of your own home.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-bold">
                  Need Care for {service?.title}?
                </h3>
                <p className="text-white/80 text-sm max-w-lg">
                  Connect with verified, compassionate care specialists ready to
                  assist you and your family right at home.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
                <Link href="/specialist" className="w-full sm:w-auto">
                  <Button className="w-full bg-white text-primary hover:bg-gray-100 font-semibold shadow-md cursor-pointer">
                    <Users className="w-4 h-4 mr-2" />
                    Find Specialists
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
              <h4 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Service Overview
              </h4>

              <div className="space-y-3.5 text-sm">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Service Coverage</p>
                    <p className="font-semibold text-gray-800">
                      In-Home (Kenya)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Availability</p>
                    <p className="font-semibold text-gray-800">
                      24/7 Home Support
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Caregiver Type</p>
                    <p className="font-semibold text-gray-800">
                      Certified Specialists
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <Link href="/specialist" className="block w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-xl shadow cursor-pointer">
                    Book a Specialist
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <h4 className="text-lg font-bold text-gray-900">
                  All Services
                </h4>
                <Link
                  href="/services"
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5"
                >
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2">
                {allServices.map((item) => {
                  const isCurrent = item.id === service?.id;
                  const itemSlug = getSlug(item);
                  return (
                    <Link
                      key={item.id}
                      href={`/services/${itemSlug}?id=${item.id}`}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                        isCurrent
                          ? "bg-primary text-white font-semibold shadow-sm"
                          : "bg-gray-50 hover:bg-primary/10 text-gray-800 hover:text-primary border border-gray-100/80"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item?.icon && (
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center p-1.5 shrink-0 ${
                              isCurrent
                                ? "bg-white/20 text-white"
                                : "bg-white text-primary border border-gray-100"
                            }`}
                          >
                            <span
                              dangerouslySetInnerHTML={{ __html: item.icon }}
                              className="w-4 h-4 flex items-center justify-center [&_svg]:w-full [&_svg]:h-full"
                            />
                          </div>
                        )}
                        <span className="text-xs sm:text-sm truncate">
                          {item.title}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${isCurrent ? "text-white" : "text-gray-400"}`}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ServiceDetailsPage;
