"use client";

import Container from "@/components/shared/Container";
import ProfileCard from "@/components/profileCard";
import { serviceCategory } from "@/utilities/data";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense, useMemo, useRef } from "react";
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
import { Slider } from "radix-ui";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();


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
  const [experienceRange, setExperienceRange] = useState({ min: "", max: "" });
  const [ageRange, setAgeRange] = useState({ min: "", max: "" });

  const ITEMS_PER_PAGE = 6;

  const { data, isLoading } = useFetch("/specialist");
  // console.log("data", data?.data?.data);

  const isFirstLoad = useRef(true);
  useEffect(() => {
    if (!isFirstLoad.current) return;

    const category = searchParams.get("category");

    if (category === null) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("category", "house-manager");
      params.set("page", "1");

      router.replace(`/specialist?${params.toString()}`, { scroll: false });
    }

    isFirstLoad.current = false;
  }, [searchParams, router]);

  useEffect(() => {
    const getArray = (key) => {
      const value = searchParams.get(key);
      return value ? value.split(",") : [];
    };

    setSelectedCategory(searchParams.get("category") || "");
    setSelectedServices(getArray("services"));
    setSelectedLocation(searchParams.get("location") || "");
    setSelectedKidAge(searchParams.get("kidAge") || "");
    setSelectedLanguages(getArray("languages"));
    setSelectedRating(searchParams.get("rating") || "");

    setSalaryRange({
      min: searchParams.get("minSalary") || "",
      max: searchParams.get("maxSalary") || "",
    });

    setExperienceRange({
      min: searchParams.get("minExperience") || "",
      max: searchParams.get("maxExperience") || "",
    });

    setAgeRange({
      min: searchParams.get("minAge") || "",
      max: searchParams.get("maxAge") || "",
    });

    setCurrentPage(Number(searchParams.get("page")) || 1);
  }, [searchParams]);

  const updateQueryParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else {
        params.set(key, value);
      }
    });

    router.push(`?${params.toString()}`, { scroll: false });

    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });
  };

  const handleCategoryChange = (value) => {
    updateQueryParams({
      category: value || undefined,
      services: [],
      location: "",
      kidAge: "",
      languages: [],
      rating: "",
      minSalary: "",
      maxSalary: "",
      page: 1,
    });
  };

  const handleServiceToggle = (service, checked) => {
    let updated = checked
      ? [...selectedServices, service]
      : selectedServices.filter((s) => s !== service);

    updateQueryParams({
      services: updated,
      page: 1,
    });
  };

  const selectedCategoryObj = serviceCategory.find(
    (cat) => cat.value === selectedCategory,
  );

  const parseSalaryRange = (salaryString) => {
    if (!salaryString) return { min: 0, max: Infinity };

    salaryString = salaryString.replace(/\s/g, "");


    if (salaryString.includes("+")) {
      const min = parseInt(salaryString.replace("+", ""));
      return { min, max: Infinity };
    }


    if (salaryString.includes("-")) {
      const [min, max] = salaryString.split("-").map(Number);
      return { min, max };
    }


    const value = parseInt(salaryString);
    return { min: value, max: value };
  };

  const showNonHouseManagerFilters = [
    "nurse",
    "physiotherapist",
    "nurse-aide-or-assistant",
    "special-need-caregivers",
  ];
  const filteredSpecialists = useMemo(() => {
    const rawData = data?.data?.data || [];
    if (!rawData.length) return [];

    return rawData.filter((item) => {
      
      const matchesCategory =
        !selectedCategory ||
        [item.subRole]
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

      
      const matchesLanguages =
        selectedLanguages.length === 0 ||
        selectedLanguages.every((lang) =>
          item.languages?.some((l) => l.toLowerCase() === lang.toLowerCase()),
        );

      
      const matchesRating =
        !selectedRating ||
        (item.rating && item.rating >= Number(selectedRating));

      
      let matchesSalary = true;
      if (selectedCategory === "house-manager") {
        const salaryString = item.house_manager?.salaryRange || "";
        const { min, max } = parseSalaryRange(salaryString);

        matchesSalary =
          (!salaryRange.min || max >= Number(salaryRange.min)) &&
          (!salaryRange.max || min <= Number(salaryRange.max));
      } else {
        matchesSalary = true; 
      }

      
      let matchesExperience = true;
      if (selectedCategory !== "house-manager") {
        const roleData = item[selectedCategory];
        const experience = roleData?.experience
          ? parseInt(roleData.experience)
          : 0;

        matchesExperience =
          (!experienceRange.min || experience >= Number(experienceRange.min)) &&
          (!experienceRange.max || experience <= Number(experienceRange.max));
      }

      
      let matchesKidAge = true;
      if (selectedCategory === "house-manager") {
        const kidAges = item.house_manager?.ageOfKids || [];
        matchesKidAge = !selectedKidAge || kidAges.includes(selectedKidAge);
      }


      let matchesAge = true;
      let specialistAge;
      if (selectedCategory === "house-manager") {
        specialistAge = item.age ?? 0; 
      } else {
        specialistAge = item[selectedCategory]?.age ?? item.age ?? 0; 
      }

      if (specialistAge !== undefined && specialistAge !== null) {
        matchesAge =
          (!ageRange.min || specialistAge >= Number(ageRange.min)) &&
          (!ageRange.max || specialistAge <= Number(ageRange.max));
      }

      return (
        matchesCategory &&
        matchesLocation &&
        matchesServices &&
        matchesLanguages &&
        matchesRating &&
        matchesSalary &&
        matchesExperience &&
        matchesKidAge &&
        matchesAge
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
    experienceRange,
    ageRange,
  ]);

  
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

  useEffect(() => {
    document.body.style.overflow = mobileFilterSidebar ? "hidden" : "auto";
  }, [mobileFilterSidebar]);

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
          <aside
            className="col-span-2 hidden lg:flex sticky top-5 h-fit max-h-[92vh] overflow-y-auto 
                  rounded-2xl border border-slate-100 bg-white p-7 flex-col space-y-8 shadow-sm shadow-slate-200/50"
          >
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Specialist
              </label>
              <div className="relative group mt-2">
                <select
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm transition-all 
                   hover:border-primary/30 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none"
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
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {selectedCategory === "house-manager" && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Age Range Slider */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      Age Range
                    </label>
                  </div>

                  <div className="px-2">
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                      value={[ageRange.min || 18, ageRange.max || 60]}
                      max={100} // max age
                      step={1}
                      onValueChange={([min, max]) => {
                        setAgeRange({ min, max });
                        updateQueryParams({
                          minAge: min,
                          maxAge: max,
                          page: 1,
                        });
                      }}
                    >
                      <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                        <Slider.Range className="absolute bg-primary rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                      <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                    </Slider.Root>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                        Min
                      </p>
                      <p className="text-sm font-semibold text-slate-700 ml-1">
                        {ageRange.min || 18} yrs
                      </p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                        Max
                      </p>
                      <p className="text-sm font-semibold text-slate-700 ml-1">
                        {ageRange.max || 60}+ yrs
                      </p>
                    </div>
                  </div>
                </div>

                {/* Location with Icon */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Preferred Location
                  </label>
                  <div className="relative mt-2">
                    <input
                      type="text"
                      placeholder="e.g. Nairobi"
                      className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm placeholder:text-slate-400 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                      value={selectedLocation}
                      onChange={(e) =>
                        updateQueryParams({ location: e.target.value, page: 1 })
                      }
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Age Range - Pill Style Select */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Kid Age Range
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all cursor-pointer mt-2"
                    value={selectedKidAge}
                    onChange={(e) =>
                      updateQueryParams({ kidAge: e.target.value, page: 1 })
                    }
                  >
                    <option value="">All Ages</option>
                    <option value="0-3">0 – 3 Years</option>
                    <option value="4-10">4 – 10 Years</option>
                    <option value="11+">11+ Years</option>
                  </select>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      Salary Range
                    </label>
                  </div>

                  <div className="px-2">
                    <Slider.Root
                      className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                      defaultValue={[0, 500]}
                      value={[salaryRange.min || 0, salaryRange.max || 500]}
                      max={1000}
                      step={100}
                      onValueChange={([min, max]) => {
                        updateQueryParams({
                          minSalary: min,
                          maxSalary: max,
                          page: 1,
                        });
                      }}
                    >
                      <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                        <Slider.Range className="absolute bg-primary rounded-full h-full" />
                      </Slider.Track>
                      <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                      <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                    </Slider.Root>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                        Min
                      </p>
                      <p className="text-sm font-semibold text-slate-700 ml-1">
                        KSH {salaryRange.min || 0}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                        Max
                      </p>
                      <p className="text-sm font-semibold text-slate-700 ml-1">
                        KSH {salaryRange.max || 500}+
                      </p>
                    </div>
                  </div>
                </div>

                {/* Languages - Checkbox Grid */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Language Fluency
                  </label>
                  <div className="grid grid-cols-1 gap-y-2  mt-2 ml-1">
                    {[
                      "English",
                      "Swahili",
                      "French",
                      "German",
                      "Arabic",
                      "Chinese",
                      "Other",
                    ].map((lang, i) => (
                      <label
                        key={i}
                        className="flex items-center group cursor-pointer"
                      >
                        <Checkbox
                          className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                          checked={selectedLanguages.includes(lang)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...selectedLanguages, lang]
                              : selectedLanguages.filter((l) => l !== lang);
                            updateQueryParams({ languages: updated, page: 1 });
                          }}
                        />
                        <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                          {lang}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating - Stars Representation */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 ml-1">
                    Minimum Rating
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-primary outline-none transition-all mt-2"
                    value={selectedRating}
                    onChange={(e) =>
                      updateQueryParams({ rating: e.target.value, page: 1 })
                    }
                  >
                    <option value="">Any Rating</option>
                    <option value="5">Excellent (5 Stars)</option>
                    <option value="4">Great (4+ Stars)</option>
                    <option value="3">Good (3+ Stars)</option>
                  </select>
                </div>
              </div>
            )}
            {selectedCategory !== "house-manager" &&
              showNonHouseManagerFilters.includes(selectedCategory) && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Age Range
                      </label>
                    </div>

                    <div className="px-2">
                      <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                        value={[ageRange.min || 18, ageRange.max || 60]}
                        max={100} // max age
                        step={1}
                        onValueChange={([min, max]) => {
                          setAgeRange({ min, max });
                          updateQueryParams({
                            minAge: min,
                            maxAge: max,
                            page: 1,
                          });
                        }}
                      >
                        <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                          <Slider.Range className="absolute bg-primary rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                      </Slider.Root>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                          Min
                        </p>
                        <p className="text-sm font-semibold text-slate-700 ml-1">
                          {ageRange.min || 18} yrs
                        </p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                          Max
                        </p>
                        <p className="text-sm font-semibold text-slate-700 ml-1">
                          {ageRange.max || 60}+ yrs
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location with Icon */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      Preferred Location
                    </label>
                    <div className="relative mt-2">
                      <input
                        type="text"
                        placeholder="e.g. Nairobi"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm placeholder:text-slate-400 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                        value={selectedLocation}
                        onChange={(e) =>
                          updateQueryParams({
                            location: e.target.value,
                            page: 1,
                          })
                        }
                      />
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* experience year */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Years of Experience
                      </label>
                    </div>

                    <div className="px-2">
                      <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                        value={[
                          experienceRange.min || 0,
                          experienceRange.max || 10,
                        ]}
                        max={20}
                        step={1}
                        onValueChange={([min, max]) => {
                          setExperienceRange({ min, max });
                          updateQueryParams({
                            minExperience: min,
                            maxExperience: max,
                            page: 1,
                          });
                        }}
                      >
                        <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                          <Slider.Range className="absolute bg-primary rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                      </Slider.Root>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                          Min
                        </p>
                        <p className="text-sm font-semibold text-slate-700 ml-1">
                          {experienceRange.min || 0} yrs
                        </p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                          Max
                        </p>
                        <p className="text-sm font-semibold text-slate-700 ml-1">
                          {experienceRange.max || 10}+ yrs
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Salary Range
                      </label>
                    </div>

                    <div className="px-2">
                      <Slider.Root
                        className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                        defaultValue={[0, 500]}
                        value={[salaryRange.min || 0, salaryRange.max || 500]}
                        max={1000}
                        step={100}
                        onValueChange={([min, max]) => {
                          updateQueryParams({
                            minSalary: min,
                            maxSalary: max,
                            page: 1,
                          });
                        }}
                      >
                        <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                          <Slider.Range className="absolute bg-primary rounded-full h-full" />
                        </Slider.Track>
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                        <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                      </Slider.Root>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                          Min
                        </p>
                        <p className="text-sm font-semibold text-slate-700 ml-1">
                          KSH {salaryRange.min || 0}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                          Max
                        </p>
                        <p className="text-sm font-semibold text-slate-700 ml-1">
                          KSH {salaryRange.max || 500}+
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Languages - Checkbox Grid */}
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      Language Fluency
                    </label>
                    <div className="grid grid-cols-1 gap-y-2  mt-2 ml-1">
                      {[
                        "English",
                        "Swahili",
                        "French",
                        "German",
                        "Arabic",
                        "Chinese",
                        "Other",
                      ].map((lang, i) => (
                        <label
                          key={i}
                          className="flex items-center group cursor-pointer"
                        >
                          <Checkbox
                            className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                            checked={selectedLanguages.includes(lang)}
                            onCheckedChange={(checked) => {
                              const updated = checked
                                ? [...selectedLanguages, lang]
                                : selectedLanguages.filter((l) => l !== lang);
                              updateQueryParams({
                                languages: updated,
                                page: 1,
                              });
                            }}
                          />
                          <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                            {lang}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating - Stars Representation */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                      Minimum Rating
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-primary outline-none transition-all mt-2"
                      value={selectedRating}
                      onChange={(e) =>
                        updateQueryParams({ rating: e.target.value, page: 1 })
                      }
                    >
                      <option value="">Any Rating</option>
                      <option value="5">Excellent (5 Stars)</option>
                      <option value="4">Great (4+ Stars)</option>
                      <option value="3">Good (3+ Stars)</option>
                    </select>
                  </div>
                </div>
              )}

            {selectedCategoryObj && (
              <div className="pt-4 border-t border-slate-50">
                <label className="text-sm font-semibold text-slate-700 block mb-4 ml-1">
                  Specialized Services
                </label>
                <div className="bg-slate-50/80 rounded-2xl p-4 space-y-3 border border-slate-100/50">
                  {selectedCategoryObj.subCategory.map((service, i) => (
                    <div key={i} className="flex items-center gap-3 py-1 group">
                      <Checkbox
                        id={`desktop-${service}`}
                        className="border-slate-300 rounded-[4px]"
                        checked={selectedServices.includes(service)}
                        onCheckedChange={(checked) =>
                          handleServiceToggle(service, checked === true)
                        }
                      />
                      <Label
                        htmlFor={`desktop-${service}`}
                        className="text-sm font-medium text-slate-600 group-hover:text-slate-900 leading-none cursor-pointer transition-colors"
                      >
                        {service}
                      </Label>
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
                    {/* Previous */}
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          updateQueryParams({
                            page: Math.max(1, currentPage - 1),
                          })
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* Page Numbers */}
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={i + 1 === currentPage}
                          onClick={() =>
                            updateQueryParams({
                              page: i + 1,
                            })
                          }
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    {/* Next */}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          updateQueryParams({
                            page: Math.min(totalPages, currentPage + 1),
                          })
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
                    <option value="">All Specialists</option>
                    {serviceCategory?.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.mainCategory}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory === "house-manager" && (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    {/* Age Range Slider */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700 ml-1">
                          Age Range
                        </label>
                      </div>

                      <div className="px-2">
                        <Slider.Root
                          className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                          value={[ageRange.min || 18, ageRange.max || 60]}
                          max={100} // max age
                          step={1}
                          onValueChange={([min, max]) => {
                            setAgeRange({ min, max });
                            updateQueryParams({
                              minAge: min,
                              maxAge: max,
                              page: 1,
                            });
                          }}
                        >
                          <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                            <Slider.Range className="absolute bg-primary rounded-full h-full" />
                          </Slider.Track>
                          <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                          <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                        </Slider.Root>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                            Min
                          </p>
                          <p className="text-sm font-semibold text-slate-700 ml-1">
                            {ageRange.min || 18} yrs
                          </p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                            Max
                          </p>
                          <p className="text-sm font-semibold text-slate-700 ml-1">
                            {ageRange.max || 60}+ yrs
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Location with Icon */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Preferred Location
                      </label>
                      <div className="relative mt-2">
                        <input
                          type="text"
                          placeholder="e.g. Nairobi"
                          className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm placeholder:text-slate-400 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                          value={selectedLocation}
                          onChange={(e) =>
                            updateQueryParams({
                              location: e.target.value,
                              page: 1,
                            })
                          }
                        />
                        <svg
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Age Range - Pill Style Select */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Kid Age Range
                      </label>
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all cursor-pointer mt-2"
                        value={selectedKidAge}
                        onChange={(e) =>
                          updateQueryParams({ kidAge: e.target.value, page: 1 })
                        }
                      >
                        <option value="">All Ages</option>
                        <option value="0-3">0 – 3 Years</option>
                        <option value="4-10">4 – 10 Years</option>
                        <option value="11+">11+ Years</option>
                      </select>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700 ml-1">
                          Salary Range
                        </label>
                      </div>

                      <div className="px-2">
                        <Slider.Root
                          className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                          defaultValue={[0, 500]}
                          value={[salaryRange.min || 0, salaryRange.max || 500]}
                          max={1000}
                          step={100}
                          onValueChange={([min, max]) => {
                            updateQueryParams({
                              minSalary: min,
                              maxSalary: max,
                              page: 1,
                            });
                          }}
                        >
                          <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                            <Slider.Range className="absolute bg-primary rounded-full h-full" />
                          </Slider.Track>
                          <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                          <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                        </Slider.Root>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                            Min
                          </p>
                          <p className="text-sm font-semibold text-slate-700 ml-1">
                            KSH {salaryRange.min || 0}
                          </p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                            Max
                          </p>
                          <p className="text-sm font-semibold text-slate-700 ml-1">
                            KSH {salaryRange.max || 500}+
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Languages - Checkbox Grid */}
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Language Fluency
                      </label>
                      <div className="grid grid-cols-1 gap-y-2  mt-2 ml-1">
                        {[
                          "English",
                          "Swahili",
                          "French",
                          "German",
                          "Arabic",
                          "Chinese",
                          "Other",
                        ].map((lang, i) => (
                          <label
                            key={i}
                            className="flex items-center group cursor-pointer"
                          >
                            <Checkbox
                              className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                              checked={selectedLanguages.includes(lang)}
                              onCheckedChange={(checked) => {
                                const updated = checked
                                  ? [...selectedLanguages, lang]
                                  : selectedLanguages.filter((l) => l !== lang);
                                updateQueryParams({
                                  languages: updated,
                                  page: 1,
                                });
                              }}
                            />
                            <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                              {lang}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Rating - Stars Representation */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Minimum Rating
                      </label>
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-primary outline-none transition-all mt-2"
                        value={selectedRating}
                        onChange={(e) =>
                          updateQueryParams({ rating: e.target.value, page: 1 })
                        }
                      >
                        <option value="">Any Rating</option>
                        <option value="5">Excellent (5 Stars)</option>
                        <option value="4">Great (4+ Stars)</option>
                        <option value="3">Good (3+ Stars)</option>
                      </select>
                    </div>
                  </div>
                )}
                {selectedCategory !== "house-manager" &&
                  showNonHouseManagerFilters.includes(selectedCategory) && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-700 ml-1">
                            Age Range
                          </label>
                        </div>

                        <div className="px-2">
                          <Slider.Root
                            className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                            value={[ageRange.min || 18, ageRange.max || 60]}
                            max={100} // max age
                            step={1}
                            onValueChange={([min, max]) => {
                              setAgeRange({ min, max });
                              updateQueryParams({
                                minAge: min,
                                maxAge: max,
                                page: 1,
                              });
                            }}
                          >
                            <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                              <Slider.Range className="absolute bg-primary rounded-full h-full" />
                            </Slider.Track>
                            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                          </Slider.Root>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                              Min
                            </p>
                            <p className="text-sm font-semibold text-slate-700 ml-1">
                              {ageRange.min || 18} yrs
                            </p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                              Max
                            </p>
                            <p className="text-sm font-semibold text-slate-700 ml-1">
                              {ageRange.max || 60}+ yrs
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Location with Icon */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 ml-1">
                          Preferred Location
                        </label>
                        <div className="relative mt-2">
                          <input
                            type="text"
                            placeholder="e.g. Nairobi"
                            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm placeholder:text-slate-400 focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all"
                            value={selectedLocation}
                            onChange={(e) =>
                              updateQueryParams({
                                location: e.target.value,
                                page: 1,
                              })
                            }
                          />
                          <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* experience year */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-700 ml-1">
                            Years of Experience
                          </label>
                        </div>

                        <div className="px-2">
                          <Slider.Root
                            className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                            value={[
                              experienceRange.min || 0,
                              experienceRange.max || 10,
                            ]}
                            max={20}
                            step={1}
                            onValueChange={([min, max]) => {
                              setExperienceRange({ min, max });
                              updateQueryParams({
                                minExperience: min,
                                maxExperience: max,
                                page: 1,
                              });
                            }}
                          >
                            <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                              <Slider.Range className="absolute bg-primary rounded-full h-full" />
                            </Slider.Track>
                            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                          </Slider.Root>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                              Min
                            </p>
                            <p className="text-sm font-semibold text-slate-700 ml-1">
                              {experienceRange.min || 0} yrs
                            </p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                              Max
                            </p>
                            <p className="text-sm font-semibold text-slate-700 ml-1">
                              {experienceRange.max || 10}+ yrs
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-slate-700 ml-1">
                            Salary Range
                          </label>
                        </div>

                        <div className="px-2">
                          <Slider.Root
                            className="relative flex items-center select-none touch-none w-full h-5 cursor-pointer"
                            defaultValue={[0, 500]}
                            value={[
                              salaryRange.min || 0,
                              salaryRange.max || 500,
                            ]}
                            max={1000}
                            step={100}
                            onValueChange={([min, max]) => {
                              updateQueryParams({
                                minSalary: min,
                                maxSalary: max,
                                page: 1,
                              });
                            }}
                          >
                            <Slider.Track className="bg-slate-100 relative grow rounded-full h-[5px]">
                              <Slider.Range className="absolute bg-primary rounded-full h-full" />
                            </Slider.Track>
                            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-primary shadow-md rounded-full hover:scale-110 transition-transform focus:outline-none" />
                          </Slider.Root>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                              Min
                            </p>
                            <p className="text-sm font-semibold text-slate-700 ml-1">
                              KSH {salaryRange.min || 0}
                            </p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase ml-1 mb-1">
                              Max
                            </p>
                            <p className="text-sm font-semibold text-slate-700 ml-1">
                              KSH {salaryRange.max || 500}+
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Languages - Checkbox Grid */}
                      <div className="space-y-4">
                        <label className="text-sm font-semibold text-slate-700 ml-1">
                          Language Fluency
                        </label>
                        <div className="grid grid-cols-1 gap-y-2  mt-2 ml-1">
                          {[
                            "English",
                            "Swahili",
                            "French",
                            "German",
                            "Arabic",
                            "Chinese",
                            "Other",
                          ].map((lang, i) => (
                            <label
                              key={i}
                              className="flex items-center group cursor-pointer"
                            >
                              <Checkbox
                                className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                                checked={selectedLanguages.includes(lang)}
                                onCheckedChange={(checked) => {
                                  const updated = checked
                                    ? [...selectedLanguages, lang]
                                    : selectedLanguages.filter(
                                        (l) => l !== lang,
                                      );
                                  updateQueryParams({
                                    languages: updated,
                                    page: 1,
                                  });
                                }}
                              />
                              <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-medium">
                                {lang}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Rating - Stars Representation */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-700 ml-1">
                          Minimum Rating
                        </label>
                        <select
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-primary outline-none transition-all mt-2"
                          value={selectedRating}
                          onChange={(e) =>
                            updateQueryParams({
                              rating: e.target.value,
                              page: 1,
                            })
                          }
                        >
                          <option value="">Any Rating</option>
                          <option value="5">Excellent (5 Stars)</option>
                          <option value="4">Great (4+ Stars)</option>
                          <option value="3">Good (3+ Stars)</option>
                        </select>
                      </div>
                    </div>
                  )}

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
                            onCheckedChange={(checked) =>
                              handleServiceToggle(service, checked === true)
                            }
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
