"use client";

import Container from "@/components/shared/Container";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useFetch } from "@/hooks/useFetch";
import {
  Building,
  Check,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Globe,
  Car,
  GraduationCap,
  MessageCircle,
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
    if (loading) return;

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
      toast.error(`${user?.subRole} can't make Booking`);
      router.push(`/dashboard/${user?.role}-profile`);
      return;
    }
    router.push(bookingUrl);
  };

  const handleMessage = () => {
    if (loading) return;

    const messageUrl = `/dashboard/user-inbox?specialistId=${matchedData.id}&specialistName=${encodeURIComponent(matchedData.name)}&specialistType=${matchedData.type}`;

    if (!user) {
      router.push(
        `/register?role=user&redirect=${encodeURIComponent(messageUrl)}`,
      );
      return;
    }

    if (user?.role !== "user") {
      toast.error(`${user?.subRole} can't send Message`);
      router.push(`/dashboard/${user?.role}-profile`);
      return;
    }
    router.push(messageUrl);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !matchedData)
    return <div className="py-20 text-center">Data not found</div>;

  const roleSpecificInfo =
    matchedData.house_manager ||
    matchedData.nurse ||
    matchedData.physiotherapist;

  console.log(roleSpecificInfo);
  return (
    <>
      <PageBanner
        title={`${matchedData.name}'s Profile`}
        image="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/cf136a11386527.560f6e447cc13.jpg"
      />
      <Container className="py-16 grid md:grid-cols-6 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="p-4 rounded-md items-center border-t-primary border flex flex-col border-t-4 shadow-sm">
            <img
              className="object-cover h-40 w-40 lg:w-60 lg:h-60 rounded-full border-4 border-white shadow-lg"
              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${matchedData?.profilePhoto}`}
              alt={matchedData.name}
              onError={(e) => {
                e.target.src = `https://placehold.co/160x160/6366f1/white?text=${matchedData?.name?.charAt(0)}`;
              }}
            />
            <h2 className="text-2xl mt-4 text-gray-800 font-semibold text-center">
              {matchedData?.name || matchedData?.fullName}
            </h2>
            <p className="text-sm mt-1 font-bold uppercase">
              {matchedData?.subRole?.replace("-", " ")}{" "}
              <span className="text-purple-800">
                {matchedData.type === "agency-employee" && "(AGENCY LISTED)"}
              </span>
            </p>
          </div>

          <div className="p-4 rounded-md border bg-gray-50/50">
            {/* <h2 className="font-bold text-gray-700 mb-4 border-b pb-2">
              CONTACT INFO
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <Phone className="w-4 h-4 text-primary" />
                <div>
                  <Label className="text-xs text-gray-400">Phone</Label>
                  <p className="text-sm font-medium">
                    {matchedData?.number
                      ? matchedData?.number
                      : matchedData?.number_two}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <Label className="text-xs text-gray-400">Email</Label>
                  <p className="text-sm font-medium">{matchedData?.email}</p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Building className="w-4 h-4 text-primary" />
                <div>
                  <Label className="text-xs text-gray-400">Location</Label>
                  <p className="text-sm font-medium">{matchedData?.location}</p>
                </div>
              </div>
            </div> */}
            <Button
              onClick={handleMessage}
              disabled={loading}
              variant="outline"
              className="w-full mt-6 cursor-pointer text-primary"
            >
              <MessageCircle className="w-4 h-4 mr-2" /> Message
            </Button>
            <Button
              onClick={handleBookNow}
              disabled={loading}
              className="w-full mt-6 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4 mr-2" /> Book Now
            </Button>
          </div>
        </div>

        <div className="md:col-span-4 space-y-8">
          <section>
            <h2 className="text-xl font-bold border-b-2 border-primary w-fit mb-4">
              BIO
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {matchedData?.bio || "No biography provided by the specialist."}
            </p>
          </section>

          <section className="grid sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-lg">
            <div>
              <h3 className="font-bold text-sm text-gray-400 uppercase mb-3">
                Professional Info
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <p className="text-sm">
                    <b>Education:</b> {matchedData.education}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <p className="text-sm">
                    <b>Exp:</b>{" "}
                    {roleSpecificInfo?.experience === "more"
                      ? "More than 5 years"
                      : `${roleSpecificInfo?.experience || 0} ${
                          roleSpecificInfo?.experience === "1"
                            ? "year"
                            : "years"
                        }`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <p className="text-sm">
                    <b>Languages:</b> {matchedData.languages?.join(", ")}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-400 uppercase mb-3">
                Preferences
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  <p className="text-sm">
                    <b>Can Drive:</b> {matchedData.canDrive ? "Yes" : "No"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <p className="text-sm">
                    <b>Preferred Role:</b> {matchedData.preferredRole}
                  </p>
                </div>
                {roleSpecificInfo?.salaryRange && (
                  <div className="flex items-center gap-2">
                    <p className="text-sm">
                      <b>Salary Range:</b> ${roleSpecificInfo.salaryRange}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold border-b-2 border-primary w-fit mb-4 uppercase">
              Available Schedule
            </h2>
            {matchedData.schedule && matchedData.schedule.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {matchedData.schedule[0].date.map((date, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium border border-primary/20"
                  >
                    <Calendar className="w-3 h-3" />
                    {new Date(date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No specific availability dates listed. Please contact for
                details.
              </p>
            )}
          </section>

          {matchedData.services && (
            <section>
              <h2 className="text-xl font-bold border-b-2 border-primary w-fit mb-4 uppercase">
                Services Offered
              </h2>
              <ul className="grid gap-2">
                {matchedData.services.map((service, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />{" "}
                    {service}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </Container>
    </>
  );
};

export default ProfilePageContent;
