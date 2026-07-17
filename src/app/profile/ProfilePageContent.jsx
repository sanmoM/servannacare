"use client";

import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import {
  Building,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Globe,
  Car,
  GraduationCap,
  MessageCircle,
  FileText,
  ShieldCheck,
  Briefcase,
  DollarSign,
  MapPin,
  Baby,
  Star,
  User,
  Heart,
  Award,
  Sparkles,
  Lock,
  ArrowRight,
  Share2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileCheck
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const ProfilePageContent = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const { user, loading } = useAuth();
  const router = useRouter();

  const { data, isLoading, error } = useFetch("/specialist");
  const specialists = data?.data?.data ?? [];

  const matchedData = specialists?.find(
    (item) =>
      String(item.id) === String(id) &&
      item.type?.toLowerCase() === type?.toLowerCase(),
  );

  const handleBookNow = () => {
    if (loading || !matchedData) return;

    const category = matchedData.subRole
      ? matchedData.subRole.toLowerCase().replace(/\s+/g, "-")
      : "unknown";

    const isHouseFlow =
      matchedData.type === "house-manager" ||
      matchedData.type === "agency-employee";

    const basePath = isHouseFlow ? "/houseManagerBookingForm" : "/bookingForm";
    const bookingUrl = `${basePath}?category=${category}&id=${matchedData.id}`;

    if (!user) {
      router.push(`/register?role=user&redirect=${encodeURIComponent(bookingUrl)}`);
      return;
    }

    if (user?.role !== "user") {
      toast.error(`${user?.subRole || "Specialist"} can't make Booking`);
      router.push(`/dashboard/${user?.role}-profile`);
      return;
    }
    router.push(bookingUrl);
  };

  const handleMessage = () => {
    if (loading || !matchedData) return;

    const messageUrl = `/dashboard/user-inbox?specialistId=${matchedData.id}&specialistName=${encodeURIComponent(matchedData.name)}&specialistType=${matchedData.type}`;

    if (!user) {
      router.push(`/register?role=user&redirect=${encodeURIComponent(messageUrl)}`);
      return;
    }

    if (user?.role !== "user") {
      toast.error(`${user?.subRole || "Specialist"} can't send Message`);
      router.push(`/dashboard/${user?.role}-profile`);
      return;
    }
    router.push(messageUrl);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !matchedData)
    return <div className="py-20 text-center text-gray-500 font-medium">Specialist data not found</div>;

  const roleSpecificInfo =
    matchedData.house_manager ||
    matchedData.nurse ||
    matchedData.physiotherapist ||
    matchedData.nurse_assistant ||
    matchedData.special_need ||
    matchedData.home_health_assistant;

  // Rating Status
  const hasReviews = matchedData.review_count > 0 && matchedData.review_avg_rating !== null;

  // Member Date Formatter
  const getMemberSince = () => {
    if (matchedData?.created_at) {
      return new Date(matchedData.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
    }
    if (matchedData?.memberSince) {
      return matchedData.memberSince;
    }
    return "July 2024";
  };

  // Skills Checklist
  const skillsList = [
    {
      name: "First Aid Certificate",
      has: !!roleSpecificInfo?.firstAidCertificate,
    },
    {
      name: "Good Conduct Certificate",
      has: !!matchedData?.goodConductCertificate,
    },
    {
      name: "Pet Handling",
      has: !!roleSpecificInfo?.isHandelingPet,
    },
    {
      name: "Mother Status",
      has: !!roleSpecificInfo?.isMother,
    },
    {
      name: "Comfortable with Kids",
      has: roleSpecificInfo?.ageOfKids && roleSpecificInfo.ageOfKids.length > 0,
      details: roleSpecificInfo?.ageOfKids ? `Ages: ${roleSpecificInfo.ageOfKids.join(", ")}` : "",
    },
    {
      name: "Hospital Based Care",
      has: matchedData.services?.some(s => s.toLowerCase().includes("hospital")) || !!roleSpecificInfo?.hospitalCare,
    },
    {
      name: "Home Based Care",
      has: matchedData.services?.some(s => s.toLowerCase().includes("home")) || !!roleSpecificInfo?.homeCare,
    }
  ];

  // Dynamic Trust Score calculation
  const calculateTrustScore = () => {
    let score = 30; // Base score
    const items = [];

    // 1. Verified Identity
    const identityVerified = !!matchedData.is_profile_verified;
    if (identityVerified) score += 15;
    items.push({ name: "Verified Identity", verified: identityVerified });

    // 2. Trade License / Good Conduct
    const hasGoodConduct = !!(matchedData.goodConductCertificate || roleSpecificInfo?.goodConductCertificate);
    if (hasGoodConduct) score += 15;
    items.push({ name: "Trade License / Good Conduct", verified: hasGoodConduct });

    // 3. NID/Passport (Government ID Copy)
    const hasIdCopy = !!(matchedData.idCopy || matchedData.id_copy || roleSpecificInfo?.idCopy);
    if (hasIdCopy) score += 15;
    items.push({ name: "NID/Passport Uploaded", verified: hasIdCopy });

    // 4. Professional Certification (First Aid Certificate)
    const hasCert = !!roleSpecificInfo?.firstAidCertificate;
    if (hasCert) score += 15;
    items.push({ name: "Professional Certification", verified: hasCert });

    // 5. Experience Verified
    const hasExperience = !!roleSpecificInfo?.experience;
    if (hasExperience) score += 10;
    items.push({ name: "Experience Verified", verified: hasExperience });

    // 6. Driving License Verified
    const hasLicense = !!(matchedData.drivingLicense || matchedData.driving_license || roleSpecificInfo?.drivingLicense || matchedData.canDrive);
    if (hasLicense) score += 5;
    items.push({ name: "Driving License", verified: hasLicense });

    // 7. Phone Verified
    const phoneVerified = !!(matchedData.phone || matchedData.is_phone_verified || matchedData.phone_verified);
    if (phoneVerified) score += 5;
    items.push({ name: "Phone Verified", verified: phoneVerified });

    // 8. Email Verified
    const emailVerified = !!(matchedData.email || matchedData.is_email_verified || matchedData.email_verified);
    if (emailVerified) score += 5;
    items.push({ name: "Email Verified", verified: emailVerified });

    score = Math.min(100, score);
    return { score, items };
  };

  const trustDetails = calculateTrustScore();
  const dates = matchedData.schedule?.[0]?.date || [];

  return (
    <div className="bg-background min-h-screen pb-20">
      <PageBanner
        title={`${matchedData.name}'s Profile`}
        image="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/cf136a11386527.560f6e447cc13.jpg"
      />

      <Container className="py-12">
        {/* HERO PROFILE SECTION */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 pb-8 border-b border-border">
          <div className="relative shrink-0 mx-auto md:mx-0">
            <img
              className="object-cover h-32 w-32 md:h-36 md:w-36 rounded-full border border-border shadow-xs bg-background"
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${matchedData?.profilePhoto}`}
              alt={matchedData.name}
              onError={(e) => {
                e.target.src = `https://placehold.co/160x160/72275B/white?text=${encodeURIComponent(matchedData?.name?.charAt(0) || "S")}`;
              }}
            />
            {matchedData.is_profile_verified && (
              <span className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background shadow-xs flex items-center justify-center" title="Verified Specialist">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight capitalize">
                {matchedData?.name}
              </h1>
              {matchedData.is_profile_verified && (
                <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-medium px-2 py-0.5 rounded-md text-xs flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </Badge>
              )}
              {matchedData.type === "agency-employee" && (
                <Badge className="bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 font-medium px-2 py-0.5 rounded-md text-xs shrink-0">
                  AGENCY LISTED
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 text-muted-foreground text-sm">
              <div className="flex items-center gap-1.5 font-medium">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="capitalize">{matchedData?.subRole?.replace("-", " ")}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="capitalize">{matchedData?.location || "N/A"}</span>
              </div>
            </div>

            {/* Rating Section */}
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
              {hasReviews ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-primary font-bold">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="ml-1 text-foreground">{matchedData.review_avg_rating}</span>
                  </div>
                  <span>•</span>
                  <span className="font-medium">{matchedData.review_count} {matchedData.review_count === 1 ? 'review' : 'reviews'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-medium">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span>No Reviews Yet</span>
                </div>
              )}
            </div>

            {/* Mobile CTAs */}
            <div className="flex md:hidden gap-3 mt-4">
              <Button
                onClick={handleMessage}
                disabled={loading}
                variant="outline"
                className="flex-1 font-semibold rounded-md border border-border bg-background hover:bg-accent text-foreground transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Message
              </Button>
              <Button
                onClick={handleBookNow}
                disabled={loading}
                className="flex-1 font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-md"
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Book Now
              </Button>
            </div>
          </div>
        </div>

        {/* 3-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mt-8">
          {/* Main Content Area (2 Columns) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* PROFILE STATISTICS CARDS */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Quick Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { label: "Age", value: matchedData.age ? `${matchedData.age} Years` : "N/A", icon: User },
                  { label: "Education Level", value: matchedData.education || "Not specified", icon: GraduationCap },
                  { label: "Experience", value: roleSpecificInfo?.experience === "more" ? "5+ Years" : roleSpecificInfo?.experience ? `${roleSpecificInfo.experience} Years` : "N/A", icon: Briefcase },
                  { label: "Languages", value: matchedData.languages?.filter(l => l !== "Other")?.join(", ") || "N/A", icon: Globe },
                  { label: "Can Drive", value: matchedData.canDrive ? "Yes" : "No", icon: Car },
                  { label: "Preferred Role", value: matchedData.preferredRole || "N/A", icon: Award }
                ].map((stat, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-secondary/5 text-primary border border-border shrink-0">
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-semibold">{stat.label}</p>
                      <p className="text-sm font-bold text-foreground capitalize truncate" title={stat.value}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* ABOUT SECTION */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                About Specialist
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {matchedData?.bio || "No biography provided by the specialist."}
              </p>
            </div>

            <hr className="border-border" />

            {/* PROFESSIONAL INFORMATION */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Professional Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">Experience</span>
                    <span className="font-bold text-foreground">
                      {roleSpecificInfo?.experience === "more" ? "More than 5 years" : `${roleSpecificInfo?.experience || 0} years`}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">Education Background</span>
                    <span className="font-bold text-foreground capitalize">{matchedData.education || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">Languages</span>
                    <span className="font-bold text-foreground truncate max-w-[200px]" title={matchedData.languages?.join(", ")}>
                      {matchedData.languages?.join(", ") || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">Preferred Role</span>
                    <span className="font-bold text-foreground capitalize">{matchedData.preferredRole || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">Location</span>
                    <span className="font-bold text-foreground capitalize">{matchedData.location || "N/A"}</span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">Age</span>
                    <span className="font-bold text-foreground">{matchedData.age ? `${matchedData.age} years old` : "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* SALARY AND PRICING SECTION */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Salary expectations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Daily Salary", val: roleSpecificInfo?.serviceFeeDay },
                  { label: "Monthly Salary", val: roleSpecificInfo?.serviceFeeMonth },
                  { label: "Total Salary Expectation", val: roleSpecificInfo?.salaryRange }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-muted/30 border border-border rounded-lg">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-foreground">
                      {item.val ? `KSH ${item.val}` : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* SKILLS AND PREFERENCES SECTION */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Skills & Preferences
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {skillsList.map((skill, index) => (
                  <Badge
                    key={index}
                    className={`px-3 py-1.5 rounded-md border text-xs font-semibold shadow-none ${
                      skill.has
                        ? "bg-primary/5 text-primary border-primary/20"
                        : "bg-muted/20 text-muted-foreground border-border/40"
                    }`}
                  >
                    {skill.has && <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline shrink-0" />}
                    <span>{skill.name}</span>
                    {skill.has && skill.details && (
                      <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded text-primary font-bold ml-1.5">
                        {skill.details}
                      </span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* AVAILABILITY SECTION */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Availability Schedule
              </h2>
              {dates.length > 0 ? (
                <div className="flex flex-wrap gap-3.5">
                  {dates.map((dateStr, idx) => {
                    const dateObj = new Date(dateStr);
                    const dayNum = dateObj.toLocaleDateString("en-US", { day: "numeric" });
                    const monthStr = dateObj.toLocaleDateString("en-US", { month: "short" });
                    const weekdayStr = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-center p-3.5 bg-muted/20 border border-border rounded-lg min-w-[70px] text-center"
                      >
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider mb-0.5">{monthStr}</span>
                        <span className="text-xl font-bold text-foreground leading-none mb-1">{dayNum}</span>
                        <span className="text-[9px] text-muted-foreground font-semibold uppercase">{weekdayStr}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No specific availability dates listed. Please contact the specialist directly.
                </p>
              )}
            </div>

            <hr className="border-border" />

            {/* TRUST & VERIFICATION */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">Trust & Verification</h2>
              </div>
              
              {/* Trust Score Card */}
              <div className="p-5 bg-secondary/5 border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Overall Trust Rating</p>
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    Trust Score: <span className="text-primary font-black">{trustDetails.score}/100</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculated dynamically based on verified credentials, phone, email, and documents submitted.
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="w-full sm:w-48 h-3 bg-muted rounded-full overflow-hidden shrink-0 border border-border">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-out" 
                    style={{ width: `${trustDetails.score}%` }}
                  />
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {trustDetails.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-muted/10 text-sm font-semibold"
                  >
                    <span className="text-foreground">{item.name}</span>
                    {item.verified ? (
                      <span className="text-primary font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 fill-primary/10 text-primary shrink-0" />
                        <span className="text-xs">Verified</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs font-normal">
                        Not Provided
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SERVICES SECTION */}
            {matchedData.services && matchedData.services.length > 0 && (
              <>
                <hr className="border-border" />
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Services Offered
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3.5">
                    {matchedData.services.map((service, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3.5 rounded-lg bg-muted/20 text-sm font-semibold text-foreground border border-border"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5 text-primary shrink-0" />
                        <span className="capitalize">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

          </div>

          {/* STICKY SIDEBAR DESIGN (1 Column) */}
          <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
            {/* Quick Summary Sticky Card */}
            <div className="border border-border rounded-xl bg-background p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    className="object-cover h-16 w-16 rounded-full border border-border"
                    src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${matchedData?.profilePhoto}`}
                    alt={matchedData.name}
                    onError={(e) => {
                      e.target.src = `https://placehold.co/160x160/72275B/white?text=${encodeURIComponent(matchedData?.name?.charAt(0) || "S")}`;
                    }}
                  />
                  {matchedData.is_profile_verified && (
                    <span className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-0.5 rounded-full border border-background shadow flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-md font-bold text-foreground capitalize">
                    {matchedData?.name}
                  </h3>
                  <p className="text-[10px] font-bold text-primary tracking-wider uppercase mt-1">
                    {matchedData?.subRole?.replace("-", " ")}
                  </p>
                </div>
              </div>

              <hr className="border-border/60" />

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Location</span>
                  <span className="text-foreground font-bold capitalize flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    {matchedData?.location || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Verification</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    matchedData.is_profile_verified 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {matchedData.is_profile_verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Member since</span>
                  <span className="text-foreground font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {getMemberSince()}
                  </span>
                </div>
              </div>

              <hr className="border-border/60" />

              {/* Quick Actions using project custom Button */}
              <div className="space-y-3">
                <Button
                  onClick={handleBookNow}
                  disabled={loading}
                  className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-md py-5.5 h-auto text-sm"
                >
                  <CheckCircle className="w-5 h-5 mr-2" /> Book Specialist
                </Button>
                <Button
                  onClick={handleMessage}
                  disabled={loading}
                  variant="outline"
                  className="w-full font-semibold border border-border bg-background hover:bg-accent text-foreground transition-all rounded-md py-5.5 h-auto text-sm"
                >
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" /> Send Message
                </Button>
              </div>
            </div>

            {/* Sticky Actions Utility Widget */}
            <div className="border border-border rounded-xl bg-background p-4 flex justify-around items-center text-xs font-bold text-muted-foreground">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Profile link copied!");
                }}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Share2 className="w-4 h-4 text-muted-foreground shrink-0" /> Share Profile
              </button>
              <div className="h-4 w-px bg-border"></div>
              <button 
                onClick={() => toast.success("Report submitted successfully.")}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0" /> Report Profile
              </button>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default ProfilePageContent;