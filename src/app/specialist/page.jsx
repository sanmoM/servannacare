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
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [mobileFilterSidebar, setMobileFilterSidebarOpen] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  console.log("category", selectedCategory);
  console.log("service", selectedServices);

  const buildQuery = () => {
    const query = new URLSearchParams();
    if (selectedCategory) query.set("subRole", selectedCategory);

    selectedServices.forEach((service) => query.append("preferred[]", service));

    query.set("limit", "25");

    return query.toString();
  };

  const fetchUrl =
    selectedCategory || selectedServices.length > 0
      ? `/specialist?${buildQuery()}`
      : `/specialist?limit=25`;

  const { data, isLoading, error } = useFetch(fetchUrl);

  useEffect(() => {
    if (data) {
      setHasFetched(true);
    }
  }, [data]);

  const specialists = React.useMemo(() => {
    if (!data || !Array.isArray(data?.data?.data)) return [];
    return data?.data?.data;
  }, [data]);

  // const { data, isLoading, error } = useFetch(
  //   selectedCategory ? `/specialist?${buildQuery()}` : null,
  // );

  // const specialists = Array.isArray(data?.data) ? data.data : [];

  useEffect(() => {
    const category = searchParams.get("category");
    const filterCategory = serviceCategory.find(
      (cat) => cat.value === category,
    );
    if (filterCategory) setSelectedCategory(filterCategory.mainCategory);
  }, [searchParams]);

  const handleCategoryChange = (mainCategory) => {
    const selected = serviceCategory.find(
      (cat) => cat.mainCategory === mainCategory,
    );
    if (!selected) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("category", selected.value);

    router.push(`?${params.toString()}`, { scroll: false });

    setSelectedCategory(mainCategory);
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
    (cate) => cate.mainCategory === selectedCategory,
  );

  const sortedSpecialists = React.useMemo(() => {
    let sorted = [...specialists];
    if (sortBy === "experience")
      sorted.sort((a, b) => b.experience - a.experience);
    if (sortBy === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [specialists, sortBy]);

  return (
    <>
      <PageBanner title="Our Specialist" />
      <Container className="lg:py-16 py-12">
        {/* Filter & Sort Header */}
        <div className="pb-8 flex border-b items-center gap-4 justify-between">
          <h2 className="font-medium hidden lg:block text-sm md:text-base">
            Showing {sortedSpecialists.length} services
          </h2>

          {/* Mobile Filter Toggle */}
          <div
            onClick={() => setMobileFilterSidebarOpen(true)}
            className="lg:hidden cursor-pointer flex gap-1"
          >
            <Filter className="text-primary" /> <span>Filter</span>
          </div>

          {/* Sort Dropdown */}
          <Select onValueChange={(value) => setSortBy(value)}>
            <SelectTrigger className="w-[180px] border-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="experience">Years of Experience</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-7 gap-6 items-start">
          {/* Desktop Sidebar */}
          <div className="col-span-2 hidden w-full lg:flex sticky top-5 h-[95vh] rounded-md border">
            <div className="flex flex-col w-full justify-between">
              <div className="p-6 space-y-6">
                {/* Category Selector */}
                <div>
                  <h2 className="text-lg border-b mb-4 font-semibold">
                    Category
                  </h2>
                  <select
                    className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="" disabled hidden>
                      Select Category
                    </option>
                    {serviceCategory.map((cat, indx) => (
                      <option key={indx} value={cat.mainCategory}>
                        {cat.mainCategory}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Services Selector */}
                {selectedCategoryObj && (
                  <div>
                    <h2 className="text-lg border-b mb-4 font-semibold">
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
              </div>

              <div className="mx-6 mb-6">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    // Trigger refetch by updating state (selectedCategory/selectedServices)
                  }}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>

          {/* Specialist Cards */}
          <div className="grid col-span-5 grid-cols-1 gap-4 sm:grid-cols-2 self-start">
            {isLoading && !hasFetched ? (
              <div className="col-span-2 text-center py-20">
                <LoadingSpinner />
              </div>
            ) : specialists.length > 0 ? (
              specialists.map((profile, i) => (
                <ProfileCard key={profile.id} profile={profile} />
              ))
            ) : hasFetched ? (
              <p className="col-span-2 text-gray-500 text-center md:mt-16 mt-8">
                No specialists found.
              </p>
            ) : null}
          </div>
        </div>
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
