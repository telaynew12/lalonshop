import getMedia from "@/utils/getMedia";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../../public/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png";

const ProductCard = ({ details }) => {
  return (
    <Link href={`/${details?._id}`} className="text-center">
      <div className="aspect-square relative">
        <Image
          src={getMedia(details?.media?.name)}
          alt="product"
          width={500}
          height={500}
          className="w-full h-full absolute z-50"
        />
        <div className="absolute z-30 bg-gradient-to-r from-orange-100 animate-pulse top-0 left-0 w-full h-full flex justify-center items-center">
          <Image src={logo} className="w-16 md:w-20" alt="" />
        </div>
      </div>
      <p className="text-center truncate mt-3">{details?.title}</p>
      <div className="text-center truncate my-3 flex justify-center items-center gap-3">
        <p className="font-bold">৳ {details?.price - details?.discount}</p>
        {details?.discount >= 1 && (
          <p className="text-gray-500 line-through">৳ {details?.discount}</p>
        )}
      </div>
      <div>
        <button className="bg-main text-white w-full max-w-[200px] mx-auto py-2 rounded-md font-semibold">
          View Details
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
