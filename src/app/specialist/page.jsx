"use client";

import Container from "@/components/shared/Container";
import ProfileCard from "@/components/profileCard";
import { serviceCategory } from "@/utilities/data";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
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

  const [selectedCategory, setSelectedCategory] = useState("house-manager");
  const [selectedServices, setSelectedServices] = useState([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [mobileFilterSidebar, setMobileFilterSidebarOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [applyFilter, setApplyFilter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const ITEMS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] = useState(1);

  const buildQuery = () => {
    const query = new URLSearchParams();
    if (selectedCategory) query.set("subRole", selectedCategory);

    selectedServices.forEach((service) => query.append("preferred[]", service));

    query.set("limit", "25");

    return query.toString();
  };

  const fetchUrl = isMobile
    ? applyFilter
      ? `/specialist?${buildQuery()}`
      : `/specialist?limit=25`
    : `/specialist?${buildQuery()}`;

  const { data, isLoading, error } = useFetch(fetchUrl);

  useEffect(() => {
    if (!isLoading && data) {
      setHasFetched(true);
    }
  }, [isLoading, data]);

  useEffect(() => {
    setHasFetched(false);
    setCurrentPage(1);
  }, [selectedCategory, selectedServices, sortBy]);

  const specialists = React.useMemo(() => {
    if (!data || !Array.isArray(data?.data?.data)) return [];
    return data?.data?.data;
  }, [data]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setApplyFilter(true);
    }
  }, [selectedCategory, selectedServices, sortBy, isMobile]);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  const handleCategoryChange = (value) => {
    const selected = serviceCategory.find((cat) => cat.value === value);
    if (!selected) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("category", value);

    router.push(`?${params.toString()}`, { scroll: false });

    setSelectedCategory(value);
    setSelectedServices([]);
  };

  const handleServiceToggle = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const selectedCategoryObj = serviceCategory.find(
    (cate) => cate.value === selectedCategory,
  );

  const sortedSpecialists = React.useMemo(() => {
    let sorted = [...specialists];

    switch (sortBy) {
      case "rating":
        return sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

      case "experience":
        return sorted.sort((a, b) => (b.experience ?? 0) - (a.experience ?? 0));

      case "newest":
        return sorted.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

      case "name-asc":
        return sorted.sort((a, b) =>
          (a.name ?? "").localeCompare(b.name ?? ""),
        );
      case "name-desc":
        return sorted.sort((a, b) =>
          (b.name ?? "").localeCompare(a.name ?? ""),
        );

      case "relevance":
      default:
        return specialists;
    }
  }, [specialists, sortBy]);

  const totalPages = Math.ceil(sortedSpecialists.length / ITEMS_PER_PAGE);

  const paginatedSpecialists = React.useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sortedSpecialists.slice(start, end);
  }, [sortedSpecialists, currentPage]);

  useEffect(() => {
    if (mobileFilterSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileFilterSidebar]);

  return (
    <>
      <PageBanner title="Our Specialist" />
      <Container className="lg:py-16 py-12">
        {/* Filter & Sort Header */}
        <div className="pb-8 flex border-b items-center gap-4 justify-end">
          {/* Mobile Filter Toggle */}
          <div
            onClick={() => setMobileFilterSidebarOpen(true)}
            className="lg:hidden cursor-pointer flex gap-1"
          >
            <Filter className="text-primary" /> <span>Filter</span>
          </div>
          {/* Mobile Sidebar */}
          {mobileFilterSidebar && (
            <div className="fixed inset-0 z-50 bg-black/50 flex">
              <div className="w-64 bg-white h-full p-6 overflow-y-auto">
                <button
                  className="mb-4 font-semibold text-primary"
                  onClick={() => setMobileFilterSidebarOpen(false)}
                >
                  Close
                </button>

                {/* Category Selector */}
                <div>
                  <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                    Specialist
                  </h2>
                  <select
                    className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Select Specialist
                    </option>
                    {serviceCategory.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.mainCategory}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Services Selector */}
                {selectedCategoryObj && (
                  <div className="mt-6">
                    <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                      Services
                    </h2>
                    <div className="space-y-2">
                      {selectedCategoryObj.subCategory.map((service, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Checkbox
                            id={service}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                          />
                          <Label htmlFor={service}>{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  className="w-full bg-primary text-white py-3 rounded-md mt-6"
                  onClick={() => {
                    setApplyFilter(true);
                    setMobileFilterSidebarOpen(false);
                  }}
                >
                  Search
                </button>
              </div>

              {/* Click outside to close */}
              <div
                className="flex-1"
                onClick={() => setMobileFilterSidebarOpen(false)}
              />
            </div>
          )}

          {/* Sort Dropdown */}
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
          {/* Desktop Sidebar */}
          <div className="col-span-2 hidden w-full lg:flex sticky top-5 h-[95vh] rounded-md border">
            <div className="flex flex-col w-full justify-between">
              <div className="p-6 space-y-6">
                {/* Category Selector */}
                <div>
                  <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                    Specialist
                  </h2>
                  <select
                    className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Select Specialist
                    </option>
                    {serviceCategory.map((cat, indx) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.mainCategory}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Services Selector */}
                {selectedCategoryObj && (
                  <div>
                    <h2 className="text-lg border-b mb-4 pb-1 font-semibold">
                      Services
                    </h2>
                    <div className="space-y-2">
                      {selectedCategoryObj.subCategory.map((service, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Checkbox
                            id={service}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                          />
                          <Label htmlFor={service}>{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!selectedCategoryObj && (
                  <p className="text-sm text-gray-500">
                    Please select a specialist to see services
                  </p>
                )}
              </div>

              {/* <div className="mx-6 mb-6">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    // Trigger refetch by updating state (selectedCategory/selectedServices)
                  }}
                >
                  Search
                </Button>
              </div> */}
            </div>
          </div>

          {/* Specialist Cards */}
          <div className="grid col-span-5 grid-cols-1 gap-4 sm:grid-cols-2 self-start">
            {isLoading && !hasFetched ? (
              <div className="col-span-2 text-center py-20">
                <LoadingSpinner />
              </div>
            ) : paginatedSpecialists.length > 0 ? (
              paginatedSpecialists.map((profile, i) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))
            ) : hasFetched ? (
              <p className="col-span-2 text-gray-500 text-center md:mt-16 mt-8">
                No specialists found.
              </p>
            ) : null}
          </div>
        </div>
        {totalPages > 1 && (
          <div className="col-span-5 mt-6 flex justify-end">
            <Pagination>
              <PaginationContent>
                {/* Previous button */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* Page numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {/* Next button */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Container>
    </>
  );
};

const Search = () => {
  return (
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
};

export default Search;
