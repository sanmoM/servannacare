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
  FileCheck,
  Home,
  Utensils,
  ExternalLink,
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
      router.push(
        `/register?role=user&redirect=${encodeURIComponent(bookingUrl)}`,
      );
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
      router.push(
        `/register?role=user&redirect=${encodeURIComponent(messageUrl)}`,
      );
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
    return (
      <div className="py-20 text-center text-gray-500 font-medium">
        Specialist data not found
      </div>
    );

  const roleSpecificInfo =
    matchedData.house_manager ||
    matchedData.nurse ||
    matchedData.physiotherapist ||
    matchedData.nurse_assistant ||
    matchedData.special_need ||
    matchedData.home_health_assistant ||
    matchedData.agency_employee;

  const age = matchedData.age || roleSpecificInfo?.age;
  const experience = roleSpecificInfo?.experience || matchedData?.experience;
  const education =
    matchedData.education ||
    matchedData.educationLevel ||
    roleSpecificInfo?.education;
  const phone =
    matchedData.phone ||
    matchedData.number_two ||
    matchedData.number ||
    roleSpecificInfo?.phone;
  const location = matchedData.location || roleSpecificInfo?.location;
  const bio = matchedData.bio || roleSpecificInfo?.bio;
  const dailySalary =
    roleSpecificInfo?.serviceFeeDay || matchedData?.serviceFeeDay;
  const monthlySalary =
    roleSpecificInfo?.serviceFeeMonth || matchedData?.serviceFeeMonth;
  const salaryRange = roleSpecificInfo?.salaryRange || matchedData?.salaryRange;
  const isMother = roleSpecificInfo?.isMother ?? matchedData?.isMother;
  const isHandelingPet =
    roleSpecificInfo?.isHandelingPet ??
    matchedData?.isHandelingPet ??
    matchedData?.handlePets;
  const ageOfKids =
    roleSpecificInfo?.ageOfKids ||
    matchedData?.ageOfKids ||
    matchedData?.kidAges ||
    [];
  const preferredRole =
    matchedData.preferredRole || roleSpecificInfo?.preferredRole;
  const cookingSkill = roleSpecificInfo?.cooking || matchedData?.cooking;
  const housekeepingSkill =
    roleSpecificInfo?.housekeeping || matchedData?.housekeeping;
  const childcareSkill = roleSpecificInfo?.childcare || matchedData?.childcare;
  const firstAidCert =
    roleSpecificInfo?.firstAidCertificate ||
    matchedData?.firstAidCertificate ||
    matchedData?.aidCertificate;
  const goodConductCert =
    matchedData?.goodConductCertificate ||
    roleSpecificInfo?.goodConductCertificate;
  const idCopy =
    matchedData?.idCopy || matchedData?.id_copy || roleSpecificInfo?.idCopy;
  const drivingLicense =
    matchedData?.drivingLicense ||
    matchedData?.driving_license ||
    roleSpecificInfo?.drivingLicense ||
    matchedData?.canDrive;

  const isAgencyEmployee = matchedData.type === "agency-employee";
  const agency = matchedData.agency || matchedData.agency_details || {};
  const agencyName =
    agency.companyName ||
    agency.name ||
    matchedData.agencyName ||
    matchedData.companyName;
  const agencyLocation =
    agency.businessLocation || agency.location || matchedData.agencyLocation;
  const agencyPhone = agency.number || agency.phone || matchedData.agencyPhone;
  const agencyEmail = agency.email || agency.user?.email;
  const agencyRegNumber =
    agency.companyRegistrationNumber || agency.registrationNumber;
  const agencyKraPin = agency.kraPin || agency.pin;
  const agencyPlacementFee = agency.placementFee;
  const agencyReplacementWindow = agency.replacementWindow;
  const agencyReplacementCount = agency.numberOfReplacement;
  const agencyServices = agency.agency_services || agency.trainingAreas || [];
  const agencyRegistrationDoc = agency.registrationDocument;

  const hasReviews =
    matchedData.review_count > 0 && matchedData.review_avg_rating !== null;

  const getMemberSince = () => {
    if (matchedData?.created_at) {
      return new Date(matchedData.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
    }
    if (matchedData?.memberSince) {
      return matchedData.memberSince;
    }
    return "July 2024";
  };

  const getPreferredArrangements = () => {
    let raw =
      matchedData?.preferred ||
      roleSpecificInfo?.preferred ||
      matchedData?.services ||
      matchedData?.service;
    if (!raw) return [];
    if (!Array.isArray(raw)) raw = [raw];

    return raw
      .filter(Boolean)
      .map((p) => {
        const str = String(p).trim();
        const lower = str.toLowerCase();
        if (lower.includes("live")) return "LIVE IN";
        if (lower.includes("day")) return "DAYBURG";
        return str.toUpperCase();
      })
      .filter((v, i, a) => a.indexOf(v) === i);
  };

  const preferredArrangements = getPreferredArrangements();
  const hasSkillProficiency = Boolean(
    cookingSkill || housekeepingSkill || childcareSkill,
  );

  const skillsList = [
    {
      name: "First Aid Certificate",
      has: !!firstAidCert,
    },
    {
      name: "Good Conduct Certificate",
      has: !!goodConductCert,
    },
    {
      name: "Pet Handling",
      has:
        isHandelingPet === 1 ||
        isHandelingPet === true ||
        isHandelingPet === "Yes",
    },
    {
      name: "Mother Status",
      has: isMother === 1 || isMother === true || isMother === "Yes",
    },
    {
      name: "Comfortable with Kids",
      has: Array.isArray(ageOfKids) && ageOfKids.length > 0,
      details:
        Array.isArray(ageOfKids) && ageOfKids.length > 0
          ? `Ages: ${ageOfKids.join(", ")}`
          : "",
    },
    {
      name: "Hospital Based Care",
      has:
        matchedData.services?.some((s) =>
          s.toLowerCase().includes("hospital"),
        ) || !!roleSpecificInfo?.hospitalCare,
    },
    {
      name: "Home Based Care",
      has:
        matchedData.services?.some((s) => s.toLowerCase().includes("home")) ||
        !!roleSpecificInfo?.homeCare,
    },
  ];

  const calculateTrustScore = () => {
    let score = 30; // Base score
    const items = [];

    const identityVerified = !!matchedData.is_profile_verified;
    if (identityVerified) score += 15;
    items.push({ name: "Verified Identity", verified: identityVerified });

    const hasGoodConduct = !!goodConductCert;
    if (hasGoodConduct) score += 15;
    items.push({
      name: "Trade License / Good Conduct",
      verified: hasGoodConduct,
    });

    const hasIdCopy = !!idCopy;
    if (hasIdCopy) score += 15;
    items.push({ name: "NID/Passport Uploaded", verified: hasIdCopy });

    const hasCert = !!firstAidCert;
    if (hasCert) score += 15;
    items.push({ name: "Professional Certification", verified: hasCert });

    const hasExperience = !!experience;
    if (hasExperience) score += 10;
    items.push({ name: "Experience Verified", verified: hasExperience });

    const hasLicense = !!drivingLicense;
    if (hasLicense) score += 5;
    items.push({ name: "Driving License", verified: hasLicense });

    const phoneVerified = !!(
      phone ||
      matchedData.is_phone_verified ||
      matchedData.phone_verified
    );
    if (phoneVerified) score += 5;
    items.push({ name: "Phone Verified", verified: phoneVerified });

    const emailVerified = !!(
      matchedData.email ||
      matchedData.is_email_verified ||
      matchedData.email_verified
    );
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
              <span
                className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-1.5 rounded-full border-2 border-background shadow-xs flex items-center justify-center"
                title="Verified Specialist"
              >
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
              {isAgencyEmployee && (
                <Badge className="bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/20 font-medium px-2 py-0.5 rounded-md text-xs shrink-0">
                  AGENCY LISTED
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 text-muted-foreground text-sm">
              <div className="flex items-center gap-1.5 font-medium">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="capitalize">
                  {matchedData?.subRole?.replace("-", " ")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="capitalize">{location || "N/A"}</span>
              </div>
              {/* {isAgencyEmployee && agencyName && (
                <div className="flex items-center gap-1.5 font-medium text-primary">
                  <Building className="w-4 h-4" />
                  <span>Agency: {agencyName}</span>
                </div>
              )} */}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
              {hasReviews ? (
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-primary font-bold">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="ml-1 text-foreground">
                      {matchedData.review_avg_rating}
                    </span>
                  </div>
                  <span>•</span>
                  <span className="font-medium">
                    {matchedData.review_count}{" "}
                    {matchedData.review_count === 1 ? "review" : "reviews"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 font-medium">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span>No Reviews Yet</span>
                </div>
              )}
            </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start mt-8">
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Quick Overview
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  {
                    label: "Age",
                    value: age ? `${age} Years` : "N/A",
                    icon: User,
                  },
                  {
                    label: "Education Level",
                    value: education || "Not specified",
                    icon: GraduationCap,
                  },
                  {
                    label: "Experience",
                    value:
                      experience === "more"
                        ? "5+ Years"
                        : experience
                          ? `${experience} Years`
                          : "N/A",
                    icon: Briefcase,
                  },
                  {
                    label: "Living Arrangement",
                    value: preferredArrangements.length
                      ? preferredArrangements.join(" / ")
                      : "N/A",
                    icon: Home,
                  },
                  {
                    label: "Languages",
                    value:
                      matchedData.languages
                        ?.filter((l) => l !== "Other")
                        ?.join(", ") || "N/A",
                    icon: Globe,
                  },
                  {
                    label: "Can Drive",
                    value: drivingLicense ? "Yes" : "No",
                    icon: Car,
                  },
                  {
                    label: "Preferred Role",
                    value:
                      preferredRole ||
                      (matchedData.preferred?.length
                        ? matchedData.preferred.join(", ")
                        : "N/A"),
                    icon: Award,
                  },
                ].map((stat, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="p-2 rounded-md bg-secondary/5 text-primary border border-border shrink-0">
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground font-semibold">
                        {stat.label}
                      </p>
                      <p
                        className="text-sm font-bold text-foreground capitalize truncate"
                        title={stat.value}
                      >
                        {stat.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            <div className="space-y-3">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                About Specialist
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {bio || "No biography provided by the specialist."}
              </p>
            </div>

            <hr className="border-border" />

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Professional Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">
                      Experience
                    </span>
                    <span className="font-bold text-foreground">
                      {experience === "more"
                        ? "More than 5 years"
                        : `${experience || 0} years`}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">
                      Education Background
                    </span>
                    <span className="font-bold text-foreground capitalize">
                      {education || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">
                      Languages
                    </span>
                    <span
                      className="font-bold text-foreground truncate max-w-[200px]"
                      title={matchedData.languages?.join(", ")}
                    >
                      {matchedData.languages?.join(", ") || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">
                      Phone
                    </span>
                    <span className="font-bold text-foreground">
                      {phone || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">
                      Preferred Role
                    </span>
                    <span className="font-bold text-foreground capitalize">
                      {preferredRole ||
                        (matchedData.preferred?.length
                          ? matchedData.preferred.join(", ")
                          : "N/A")}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">
                      Living Arrangement
                    </span>
                    <span className="font-bold text-foreground capitalize">
                      {preferredArrangements.length
                        ? preferredArrangements.join(" / ")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">
                      Location
                    </span>
                    <span className="font-bold text-foreground capitalize">
                      {location || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/60 pb-2">
                    <span className="text-muted-foreground font-medium">
                      Age
                    </span>
                    <span className="font-bold text-foreground">
                      {age ? `${age} years old` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Salary expectations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: "Daily Salary",
                    val: dailySalary,
                  },
                  {
                    label: "Monthly Salary",
                    val: monthlySalary,
                  },
                  {
                    label: "Total Salary Expectation",
                    val: salaryRange,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-muted/30 border border-border rounded-lg"
                  >
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                      {item.label}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {item.val ? `KSH ${item.val}` : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

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
                    {skill.has && (
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline shrink-0" />
                    )}
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

            {hasSkillProficiency && (
              <>
                <hr className="border-border" />
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Award className="w-5 h-5 text-primary" />
                    Skill Proficiency
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { name: "Cooking", value: cookingSkill, icon: Utensils },
                      {
                        name: "Housekeeping",
                        value: housekeepingSkill,
                        icon: Sparkles,
                      },
                      {
                        name: "Childcare",
                        value: childcareSkill,
                        icon: Baby,
                      },
                    ].map((skill, idx) => {
                      const val = skill.value || "Not specified";
                      const isStrong = val?.toLowerCase() === "strong";
                      const isAverage = val?.toLowerCase() === "average";
                      const isWeak = val?.toLowerCase() === "weak";

                      let badgeColor =
                        "bg-muted text-muted-foreground border-border";
                      if (isStrong)
                        badgeColor =
                          "bg-green-100 text-green-800 border-green-300";
                      if (isAverage)
                        badgeColor =
                          "bg-amber-100 text-amber-800 border-amber-300";
                      if (isWeak)
                        badgeColor = "bg-red-100 text-red-800 border-red-300";

                      return (
                        <div
                          key={idx}
                          className="p-4 bg-muted/20 border border-border rounded-xl flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                              <skill.icon className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-foreground">
                              {skill.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-muted-foreground font-semibold">
                              Proficiency:
                            </span>
                            <span
                              className={`px-2.5 py-1 text-xs font-bold rounded-md border capitalize ${badgeColor}`}
                            >
                              {val}
                            </span>
                          </div>

                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isStrong
                                  ? "w-full bg-green-500"
                                  : isAverage
                                    ? "w-2/3 bg-amber-500"
                                    : isWeak
                                      ? "w-1/3 bg-red-400"
                                      : "w-0"
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {isAgencyEmployee && (
              <>
                <hr className="border-border" />
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Building className="w-5 h-5 text-primary" />
                      Associated Agency Details
                    </h2>
                    <Badge className="bg-primary/10 text-primary border border-primary/20 font-semibold px-2.5 py-1 rounded-md text-xs flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Agency Partner
                    </Badge>
                  </div>

                  <div className="bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent border border-primary/20 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/80">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-primary tracking-wider uppercase">
                          Representing Agency
                        </p>
                        {/* <h3 className="text-xl font-black text-foreground">
                          {agencyName || "Registered Partner Agency"}
                        </h3>
                        {agencyLocation && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            {agencyLocation}
                          </p>
                        )} */}
                      </div>
                      {/* {agencyPhone && (
                        <div className="flex items-center gap-2 bg-background/80 border border-border px-3.5 py-2 rounded-xl text-sm font-semibold text-foreground">
                          <Phone className="w-4 h-4 text-primary shrink-0" />
                          <span>{agencyPhone}</span>
                        </div>
                      )} */}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-background/70 border border-border rounded-xl">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                          Placement Fee
                        </span>
                        <p className="text-base font-bold text-foreground">
                          {agencyPlacementFee
                            ? `KSh ${agencyPlacementFee}`
                            : "Standard Rate"}
                        </p>
                      </div>
                      <div className="p-4 bg-background/70 border border-border rounded-xl">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                          Replacement Window
                        </span>
                        <p className="text-base font-bold text-foreground">
                          {agencyReplacementWindow
                            ? `${agencyReplacementWindow} Months`
                            : "Standard Window"}
                        </p>
                      </div>
                      <div className="p-4 bg-background/70 border border-border rounded-xl">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                          Replacements Offered
                        </span>
                        <p className="text-base font-bold text-foreground">
                          {agencyReplacementCount
                            ? `${agencyReplacementCount} Replacements`
                            : "Available"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
                      <div className="space-y-2.5">
                        {/* {agencyRegNumber && (
                          <div className="flex justify-between border-b border-border/60 pb-2">
                            <span className="text-muted-foreground font-medium text-xs">
                              Registration No.
                            </span>
                            <span className="font-bold text-foreground text-xs">
                              {agencyRegNumber}
                            </span>
                          </div>
                        )} */}
                        {/* {agencyKraPin && (
                          <div className="flex justify-between border-b border-border/60 pb-2">
                            <span className="text-muted-foreground font-medium text-xs">
                              KRA PIN
                            </span>
                            <span className="font-bold text-foreground text-xs">
                              {agencyKraPin}
                            </span>
                          </div>
                        )} */}
                        {/* {agencyEmail && (
                          <div className="flex justify-between border-b border-border/60 pb-2">
                            <span className="text-muted-foreground font-medium text-xs">
                              Email
                            </span>
                            <span className="font-bold text-foreground text-xs">
                              {agencyEmail}
                            </span>
                          </div>
                        )} */}
                      </div>

                      {/* <div className="space-y-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                          Agency Training & Specialties
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {agencyServices.length > 0 ? (
                            agencyServices.map((area, idx) => (
                              <span
                                key={idx}
                                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-background border border-border text-foreground"
                              >
                                {area}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              Professional household & childcare training
                              provided
                            </span>
                          )}
                        </div>
                      </div> */}
                    </div>

                    {/* {agencyRegistrationDoc && (
                      <div className="pt-2">
                        <a
                          href={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${agencyRegistrationDoc}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline"
                        >
                          <FileText className="w-4 h-4" />
                          View Agency Registration Certificate
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )} */}
                  </div>
                </div>
              </>
            )}

            <hr className="border-border" />

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-foreground">
                  Trust & Verification
                </h2>
              </div>

              <div className="p-5 bg-secondary/5 border border-border rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Overall Trust Rating
                  </p>
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    Trust Score:{" "}
                    <span className="text-primary font-black">
                      {trustDetails.score}/100
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculated dynamically based on verified credentials, phone,
                    email, and documents submitted.
                  </p>
                </div>

                <div className="w-full sm:w-48 h-3 bg-muted rounded-full overflow-hidden shrink-0 border border-border">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${trustDetails.score}%` }}
                  />
                </div>
              </div>

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

            <hr className="border-border" />

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Availability Schedule
              </h2>
              {dates.length > 0 ? (
                <div className="flex flex-wrap gap-3.5">
                  {dates.map((dateStr, idx) => {
                    const dateObj = new Date(dateStr);
                    const dayNum = dateObj.toLocaleDateString("en-US", {
                      day: "numeric",
                    });
                    const monthStr = dateObj.toLocaleDateString("en-US", {
                      month: "short",
                    });
                    const weekdayStr = dateObj.toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center justify-center p-3.5 bg-muted/20 border border-border rounded-lg min-w-[70px] text-center"
                      >
                        <span className="text-[10px] uppercase font-bold text-primary tracking-wider mb-0.5">
                          {monthStr}
                        </span>
                        <span className="text-xl font-bold text-foreground leading-none mb-1">
                          {dayNum}
                        </span>
                        <span className="text-[9px] text-muted-foreground font-semibold uppercase">
                          {weekdayStr}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No specific availability dates listed. Please contact the
                  specialist directly.
                </p>
              )}
            </div>

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

          <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
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
                  {/* {isAgencyEmployee && agencyName && (
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">
                      via {agencyName}
                    </p>
                  )} */}
                </div>
              </div>

              <hr className="border-border/60" />

              <div className="space-y-3.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">
                    Location
                  </span>
                  <span className="text-foreground font-bold capitalize flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    {location || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">
                    Verification
                  </span>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      matchedData.is_profile_verified
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {matchedData.is_profile_verified ? "Verified" : "Pending"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">
                    Member since
                  </span>
                  <span className="text-foreground font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {getMemberSince()}
                  </span>
                </div>
              </div>

              <hr className="border-border/60" />

              <div className="space-y-3">
                <Button
                  onClick={handleBookNow}
                  disabled={loading}
                  className="w-full font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-md py-5.5 h-auto text-sm"
                >
                  <CheckCircle className="w-5 h-5 mr-2" /> Book Specialist
                </Button>
                <Button
                  onClick={handleMessage}
                  disabled={loading}
                  variant="outline"
                  className="w-full font-semibold cursor-pointer border border-border bg-background hover:bg-accent text-foreground transition-all rounded-md py-5.5 h-auto text-sm"
                >
                  <MessageCircle className="w-5 h-5 mr-2 text-primary" /> Send
                  Message
                </Button>
              </div>
            </div>

            <div className="border border-border rounded-xl bg-background p-4 flex justify-around items-center text-xs font-bold text-muted-foreground">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Profile link copied!");
                }}
                className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors"
              >
                <Share2 className="w-4 h-4 text-muted-foreground shrink-0" />{" "}
                Share Profile
              </button>
              <div className="h-4 w-px bg-border"></div>
              <button
                onClick={() => toast.success("Report submitted successfully.")}
                className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0" />{" "}
                Report Profile
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProfilePageContent;
