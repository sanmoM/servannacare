"use client";

import Container from "@/components/shared/Container";
import ProfileCard from "@/components/profileCard";
import { serviceCategory } from "@/utilities/data";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageBanner from "@/components/shared/PageBanner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useFetch } from "@/hooks/useFetch";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State
  const [selectedCategory, setSelectedCategory] = useState("house-manager");
  const [selectedServices, setSelectedServices] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFilterSidebar, setMobileFilterSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedKidAge, setSelectedKidAge] = useState("");
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" });
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedRating, setSelectedRating] = useState("");

  const ITEMS_PER_PAGE = 6;

  // API Call
  const { data, isLoading } = useFetch("/specialist");
  console.log("data", data?.data?.data);

  // --- URL Sync Logic ---
  useEffect(() => {
    const category = searchParams.get("category");
    const services = searchParams.get("services");

    if (category) setSelectedCategory(category);
    if (services) {
      setSelectedServices(services.split(","));
    } else {
      setSelectedServices([]);
    }
  }, [searchParams]);

  const updateQueryParams = (category, services, location) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    if (services && services.length > 0)
      params.set("services", services.join(","));
    if (location) params.set("location", location);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSelectedServices([]);
    setSelectedLocation("");
    setSelectedKidAge("");
    setSalaryRange({ min: "", max: "" });
    setSelectedLanguages([]);
    setSelectedRating("");
    setCurrentPage(1);

    const params = new URLSearchParams();
    if (value) params.set("category", value);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle Service Toggle
  const handleServiceToggle = (service) => {
    const updatedServices = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];

    setSelectedServices(updatedServices);
    setCurrentPage(1);
    updateQueryParams(selectedCategory, updatedServices);
  };

  const selectedCategoryObj = serviceCategory.find(
    (cat) => cat.value === selectedCategory,
  );

  const parseSalaryRange = (salaryString) => {
    if (!salaryString) return { min: 0, max: Infinity };

    salaryString = salaryString.replace(/\s/g, "");

    // Case 1: "1000+"
    if (salaryString.includes("+")) {
      const min = parseInt(salaryString.replace("+", ""));
      return { min, max: Infinity };
    }

    // Case 2: "800-1000"
    if (salaryString.includes("-")) {
      const [min, max] = salaryString.split("-").map(Number);
      return { min, max };
    }

    // Case 3: Single number "900"
    const value = parseInt(salaryString);
    return { min: value, max: value };
  };

  const filteredSpecialists = useMemo(() => {
    const rawData = data?.data?.data || [];
    if (!rawData.length) return [];

    return rawData.filter((item) => {
      const matchesCategory =
        !selectedCategory ||
        [item.subRole, item.type]
          .filter(Boolean)
          .some(
            (role) => role.toLowerCase() === selectedCategory.toLowerCase(),
          );

      const matchesLocation =
        !selectedLocation ||
        item.location?.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesServices =
        selectedServices.length === 0 ||
        (Array.isArray(item.preferred) &&
          selectedServices.every((s) => item.preferred.includes(s)));

      let matchesKidAge = true;
      let matchesSalary = true;
      let matchesLanguages = true;
      let matchesRating = true;

      if (selectedCategory === "house-manager") {
        const kidAges = item.house_manager?.ageOfKids || item.kidAges || [];

        matchesKidAge = !selectedKidAge || kidAges.includes(selectedKidAge);

        const salaryString =
          item.house_manager?.salaryRange || item.salaryRange;

        const { min, max } = parseSalaryRange(salaryString);

        matchesSalary =
          (!salaryRange.min || max >= Number(salaryRange.min)) &&
          (!salaryRange.max || min <= Number(salaryRange.max));

        matchesLanguages =
          selectedLanguages.length === 0 ||
          selectedLanguages.every((lang) =>
            item.languages?.some((l) => l.toLowerCase() === lang.toLowerCase()),
          );

        matchesRating =
          !selectedRating ||
          (item.rating && item.rating >= Number(selectedRating));
      }

      return (
        matchesCategory &&
        matchesLocation &&
        matchesServices &&
        matchesKidAge &&
        matchesSalary &&
        matchesLanguages &&
        matchesRating
      );
    });
  }, [
    data,
    selectedCategory,
    selectedLocation,
    selectedServices,
    selectedKidAge,
    salaryRange,
    selectedLanguages,
    selectedRating,
  ]);

  // --- Sorting Logic ---
  const sortedSpecialists = useMemo(() => {
    let result = [...filteredSpecialists];
    switch (sortBy) {
      case "rating":
        return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case "experience":
        return result.sort(
          (a, b) =>
            (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0),
        );
      case "newest":
        return result.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
      case "name-asc":
        return result.sort((a, b) =>
          (a.name || "").localeCompare(b.name || ""),
        );
      case "name-desc":
        return result.sort((a, b) =>
          (b.name || "").localeCompare(a.name || ""),
        );
      default:
        return result;
    }
  }, [filteredSpecialists, sortBy]);

  const totalPages = Math.ceil(sortedSpecialists.length / ITEMS_PER_PAGE);
  const paginatedSpecialists = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedSpecialists.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedSpecialists, currentPage]);

  return (
    <>
      <PageBanner title="Our Specialist" />
      <Container className="lg:py-16 py-12">
        <div className="pb-8 flex border-b items-center gap-4 justify-end">
          <div
            onClick={() => setMobileFilterSidebarOpen(true)}
            className="lg:hidden cursor-pointer flex gap-1 items-center"
          >
            <Filter className="text-primary" size={20} /> <span>Filter</span>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] border-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z–A)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-7 gap-6 items-start mt-6">
          <aside className="col-span-2 hidden lg:flex sticky top-5 h-fit max-h-[90vh] rounded-md border p-6 flex-col space-y-6 overflow-y-auto">
            <div>
              <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                Specialist
              </h2>
              <select
                className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">All Specialists</option>
                {serviceCategory.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.mainCategory}
                  </option>
                ))}
              </select>
            </div>

            {selectedCategory === "house-manager" && (
              <>
                <div>
                  <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                    Location
                  </h2>

                  <input
                    type="text"
                    placeholder="Type location..."
                    className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                    Kid Age Range
                  </h2>

                  <select
                    className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
                    value={selectedKidAge}
                    onChange={(e) => setSelectedKidAge(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="0-3">0 – 3</option>
                    <option value="4-10">4 – 10</option>
                    <option value="11+">11 and above</option>
                  </select>
                </div>
                <div>
                  <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                    Salary Range
                  </h2>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full border px-3 py-2 rounded-md"
                      value={salaryRange.min}
                      onChange={(e) =>
                        setSalaryRange({ ...salaryRange, min: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full border px-3 py-2 rounded-md"
                      value={salaryRange.max}
                      onChange={(e) =>
                        setSalaryRange({ ...salaryRange, max: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                    Languages
                  </h2>

                  {[
                    "English",
                    "Swahili",
                    "French",
                    "German",
                    "Arabic",
                    "Chinese",
                    "Other",
                  ].map((lang, i) => (
                    <div key={i} className="flex items-center gap-2 mb-4">
                      <Checkbox
                        checked={selectedLanguages.includes(lang)}
                        onCheckedChange={() => {
                          const updated = selectedLanguages.includes(lang)
                            ? selectedLanguages.filter((l) => l !== lang)
                            : [...selectedLanguages, lang];

                          setSelectedLanguages(updated);
                        }}
                      />
                      <Label>{lang}</Label>
                    </div>
                  ))}
                </div>
                <div>
                  <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                    Minimum Rating
                  </h2>

                  <select
                    className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                  </select>
                </div>
              </>
            )}

            {selectedCategoryObj && (
              <div>
                <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                  Services
                </h2>
                <div className="space-y-2">
                  {selectedCategoryObj.subCategory.map((service, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Checkbox
                        id={`desktop-${service}`}
                        checked={selectedServices.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                      />
                      <Label htmlFor={`desktop-${service}`}>{service}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <main className="col-span-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {isLoading ? (
                <div className="col-span-full text-center py-20">
                  <LoadingSpinner />
                </div>
              ) : paginatedSpecialists.length > 0 ? (
                paginatedSpecialists.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))
              ) : (
                <p className="col-span-full text-gray-500 text-center py-20">
                  No specialists found.
                </p>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={i + 1 === currentPage}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter */}
        {mobileFilterSidebar && (
          <div className="fixed inset-0 z-50 bg-black/50 flex">
            <div className="w-72 bg-white h-full p-6 overflow-y-auto">
              <button
                className="mb-6 font-bold text-primary"
                onClick={() => setMobileFilterSidebarOpen(false)}
              >
                ✕ Close
              </button>
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                    Specialist
                  </h2>
                  <select
                    className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {serviceCategory?.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.mainCategory}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategoryObj && (
                  <div>
                    <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                      Services
                    </h2>
                    <div className="space-y-3">
                      {selectedCategoryObj.subCategory.map((service, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Checkbox
                            id={`mobile-${service}`}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                          />
                          <Label htmlFor={`mobile-${service}`}>{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className="flex-1"
              onClick={() => setMobileFilterSidebarOpen(false)}
            />
          </div>
        )}
      </Container>
    </>
  );
};

const Search = () => (
  <Suspense
    fallback={
      <div className="w-full py-20 text-center text-primary font-semibold">
        <LoadingSpinner />
      </div>
    }
  >
    <SearchContent />
  </Suspense>
);

export default Search;
