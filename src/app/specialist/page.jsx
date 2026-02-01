"use client";

import Container from "@/components/shared/Container";
import ProfileCard from "@/components/profileCard";
import {
  categoryFilters,
  fakeData,
  serviceCategory,
  services,
} from "@/utilities/data";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState, Suspense, useEffect } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";

const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [mobileFilterSidebar, setMobileFilterSidebarOpen] = useState(false);
  



  useEffect(() => {

    const category = searchParams.get("category");
    const filterCategory = serviceCategory.find(
      (cat) => cat.value === category,
    );

    if (filterCategory) {
      setSelectedCategory(filterCategory.mainCategory);
    }
  }, [ searchParams]);



  const handleCategoryChange = (mainCategory) => {
    const selected = serviceCategory.find(
      (cat) => cat.mainCategory === mainCategory,
    );

    if (!selected) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("checkIn");
    params.delete("checkOut");

    params.set("category", selected.value);

    router.push(`?${params.toString()}`, { scroll: false });
    setSelectedCategory(mainCategory);
  };

  let filteredData = fakeData;
  if (selectedCategory) {
    filteredData = filteredData.filter(
      (item) =>
        item.category?.toLocaleLowerCase() ===
        selectedCategory.toLocaleLowerCase(),
    );
  }

  if (sortBy === "experience") {
    filteredData = [...filteredData].sort(
      (a, b) => b.experience - a.experience,
    );
  }

  const selectedCategoryObj = serviceCategory.find(
    (cate) => cate.mainCategory === selectedCategory,
  );

  console.log(selectedCategory);

  return (
    <>
      <PageBanner title="Our Specialist" />
      <Container className={"lg:py-16 py-12"}>
        <div className="pb-8">
          <div className="flex  border-b items-center pb-2 gap-4 justify-between">
            <h2 className="font-medium hidden lg:block text-sm md:text-base">
              Showing <span className="text-gray-600"></span> services
              <span className="text-gray-600"></span> of
              <span className="text-gray-600"></span>
            </h2>

            {/* mobile filtersidebar  */}
            <div
              onClick={() => setMobileFilterSidebarOpen(true)}
              className="lg:hidden cursor-pointer flex gap-1"
            >
              <Filter className="text-primary" /> <span>Filter</span>
            </div>

            <Select
              onValueChange={(value) => {
                setSortBy(value);
              }}
            >
              <SelectTrigger className="w-[180px] border-primary">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="experience">
                    Years of Experience
                  </SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid lg:grid-cols-7 gap-6 items-start">
          {/* desktop filtersidebar */}
          <div className="col-span-2 hidden w-full lg:flex sticky top-5 h-[95vh]  rounded-md border">
            <div className="flex flex-col w-full justify-between">
              <div className="p-6 space-y-6">
                <div>
                  <h2 className="text-lg border-b mb-4 font-semibold">
                    Category
                  </h2>
                  <select
                    className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option value="" disabled selected hidden>
                      Select Category
                    </option>

                    {serviceCategory.map((cat, indx) => (
                      <option
                        className="text-sm"
                        key={indx}
                        value={cat.mainCategory}
                      >
                        {cat.mainCategory}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCategory ? (
                  <div>
                    <h2 className="text-lg border-b mb-4  font-semibold">
                      Service
                    </h2>
                    <div className="space-y-2">
                      {selectedCategoryObj.subCategory.map((cat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Checkbox id={cat} />
                          <Label htmlFor={cat}>{cat}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg border-b mb-4  font-semibold">
                      Service
                    </h2>
                    <div className="space-y-3">
                      {serviceCategory
                        .flatMap((cat) => cat.subCategory)
                        .map((sub, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Checkbox id={sub} />
                            <Label htmlFor={sub}>{sub}</Label>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mx-6 mb-6">
                <Button className={"w-full"} size={"lg"}>
                  Search
                </Button>
              </div>
            </div>
          </div>

          <div className="grid col-span-5 grid-cols-1 gap-4 sm:grid-cols-2 self-start">
            {filteredData.length > 0 ? (
              filteredData.map((profile, i) => (
                <ProfileCard key={i} profile={profile} />
              ))
            ) : (
              <p className="col-span-2 text-gray-500 text-center md:mt-16 mt-8">
                No specialists found.
              </p>
            )}
          </div>
        </div>

        <div className="mt-16">
          <Pagination className={"flex justify-center md:justify-end"}>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  // onClick={() => goToPage(currentPage - 1)}
                />
              </PaginationItem>

              {/* {[...Array(totalPages)].map((_, i) => ( */}
              <PaginationItem key={1}>
                <PaginationLink
                  href="#"
                  isActive={1}
                  // onClick={() => goToPage(i + 1)}
                >
                  {1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem key={2}>
                <PaginationLink
                  href="#"
                  isActive={2}
                  // onClick={() => goToPage(i + 1)}
                >
                  {2}
                </PaginationLink>
              </PaginationItem>
              {/* ))} */}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  // onClick={() => goToPage(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Container>

      {/* Sidebar (Mobile) */}
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          mobileFilterSidebar ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileFilterSidebarOpen(false)}
      ></div>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full  w-3/4 p-4 lg:hidden sm:w-1/2 bg-white shadow-lg  z-50 transform transition-transform duration-300 ${
          mobileFilterSidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full justify-between ">
          <div>
            <h2 className="text-lg border-b mb-4 font-semibold">Category</h2>
            <select
              className="w-full rounded-md border border-primary bg-white px-3 py-2 text-sm"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="" disabled hidden>
                Select Category
              </option>

              {serviceCategory.map((cat, indx) => (
                <option
                  className="text-[10px]"
                  key={indx}
                  value={cat.mainCategory}
                >
                  {cat.mainCategory}
                </option>
              ))}
            </select>

            {selectedCategory ? (
              <div className="mt-6">
                <h2 className="text-lg border-b mb-4  font-semibold">
                  Services
                </h2>
                <div className="space-y-2">
                  {selectedCategoryObj.subCategory.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Checkbox id={cat} />
                      <Label htmlFor={cat}>{cat}</Label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-lg border-b mb-4  font-semibold">
                  Services
                </h2>
                <div className="space-y-2">
                  {serviceCategory
                    .flatMap((cat) => cat.subCategory)
                    .map((sub, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Checkbox id={sub} />
                        <Label htmlFor={sub}>{sub}</Label>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <div className="">
            <Button className={"w-full"} size={"lg"}>
              Search
            </Button>
          </div>
        </div>
      </div>
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
