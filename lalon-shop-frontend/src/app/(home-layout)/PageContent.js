"use client";

import React, { useEffect, useState } from "react";
import banner from "../../../public/Untitled design (20).png";
import musicalInstrumentsBanner from "../../../public/1736620941907_46_WhatsApp Image 2025-01-12 at 00.09.47_8031aeb4.jpg";
import womensFashionBanner from "../../../public/1735304228683_617_WhatsApp Image 2024-12-20 at 16.32.07_9190be72.jpg";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useSearchProductQuery } from "@/redux/api/query";
import { useSearchParams } from "next/navigation";
import ProductCardSkleton from "@/components/ProductCardSkleton/ProductCardSkleton";
import Paginate from "@/components/Paginate/Paginate";
import box from '../../../public/box.png'

const PageContent = () => {
  const [take, setTake] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const {
    data: searchData,
    isLoading,
    isFetching,
    refetch,
  } = useSearchProductQuery(
    `take=${take}&page=${page}&search=${
      searchParams.get("search") || ""
    }&category=${searchParams.get("category") || ""}`
  );

  // Function to get the appropriate banner based on category
  const getCategoryBanner = () => {
    const categoryName = searchParams.get("categoryName");
    if (categoryName === "Musical Instruments") {
      return musicalInstrumentsBanner;
    } else if (categoryName === "Women's Fashion") {
      return womensFashionBanner;
    }
    return null;
  };

  const categoryBanner = getCategoryBanner();

  return (
    <div className="">
      {!(searchParams.get("search") || searchParams.get("categoryName")) && (
        <Image
          height={600}
          width={1920}
          priority={true}
          className="w-full  min-h-[220px] object-cover"
          src={banner}
          alt="banner"
        />
      )}

      {categoryBanner && (
        <Image
          height={600}
          width={1920}
          priority={true}
          className="w-full  min-h-[220px] object-cover"
          src={categoryBanner}
          alt={`${searchParams.get("categoryName")} banner`}
        />
      )}

      {searchParams.get("search") && !categoryBanner && (
        <div className="pb-7">
          {!(isLoading || isFetching) && (
            <div className="bg-main py-6 md:py-14 text-center">
              <h1 className="text-xl md:text-4xl mb font-medium text-white">
                {`Found ${searchData?.totalCount} results for "${
                  searchParams.get("search")
                }"`}
              </h1>
            </div>
          )}
        </div>
      )}

      {!(isLoading || isFetching) && searchData?.products?.length < 1 && (
        <div className="flex justify-center items-center">
          <Image src={box} alt=""
           className="w-full max-w-[400px]"
          />
        </div>
      )}

      <div className="px-3 container ">
        {!(searchParams.get("search") || searchParams.get("categoryName")) && (
          <p className="text-2xl md:text-4xl  text-center my-8 md:mt-14 ">
            ALL PRODUCT
          </p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 md:gap-x-6 gap-y-4 md:gap-y-8">
          {(isLoading || isFetching) &&
            new Array(10)
              .fill(0)
              .map((item, i) => <ProductCardSkleton key={i} />)}

          {(!isLoading || !isFetching) &&
            searchData?.products?.map((item, i) => (
              <div key={i} className="border p-3 rounded-lg bg-white">
                <ProductCard details={item} />
              </div>
            ))}
        </div>
        <div className="w-full">
          <Paginate setPage={setPage} totalPage={searchData?.totalPage} />
        </div>
      </div>
    </div>
  );
};

export default PageContent;
