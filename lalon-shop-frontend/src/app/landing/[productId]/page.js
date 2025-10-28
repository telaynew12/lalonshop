"use client";

import LandingOrderNow from "@/components/LandingOrderNow/LandingOrderNow";
import LandingSelectAttributeModal from "@/components/LandingSelectAttributeModal/LandingSelectAttributeModal";
import LandingTitle from "@/components/LandingTitle/LandingTitle";
import { useLandingPageDataQuery } from "@/redux/api/query";
import getMedia from "@/utils/getMedia";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [seeAttributeModal, setSeeAttributeModal] = useState(false);
  const params = useParams().productId;
  const { data } = useLandingPageDataQuery(params);
  console.log(data);
  return (
    <section>
      {seeAttributeModal && (
        <LandingSelectAttributeModal
          setSeeAttributeModal={setSeeAttributeModal}
          productDetials={data?.data?.product}
        />
      )}

      <div className="landing-container space-y-3">
        <h1 className="text-3xl font-semibold text-[#342308]">
          {data?.data?.headline}
        </h1>
        <div className="py-3 px-14 w-fit mx-auto bg-main rounded-lg text-white text-lg font-semibold">
          মূল্য: {data?.data?.product?.price - data?.data?.product?.discount}
        </div>
        <LandingOrderNow setSeeAttributeModal={setSeeAttributeModal} />
      </div>

      <LandingTitle title={data?.data?.product?.title} />

      <div className="p-3">
        <Image
          className="mx-auto border border-main rounded-lg"
          src={getMedia(data?.data?.img1)}
          width={500}
          height={500}
          alt="product Image"
        />
      </div>
      <div className="landing-container">
        <LandingOrderNow setSeeAttributeModal={setSeeAttributeModal} />
      </div>

      <LandingTitle title={data?.data?.title1} />

      <div className="landing-container !text-start p-5">
        <p className="text-start">{data?.data?.description1}</p>
        <LandingOrderNow setSeeAttributeModal={setSeeAttributeModal} />
      </div>
      <div className="p-3 flex flex-col md:flex-row gap-3 landing-container">
        <Image
          className="mx-auto border border-main rounded-lg "
          src={getMedia(data?.data?.img2)}
          width={500}
          height={500}
          alt="product Image"
        />
      </div>
      <LandingTitle title={data?.data?.title2} />

      <div className="landing-container p-5">
        <p className="text-start">{data?.data?.description2}</p>
        <LandingOrderNow setSeeAttributeModal={setSeeAttributeModal} />
      </div>

      <div className="p-3 landing-container">
        <Image
          className="mx-auto border border-main rounded-lg "
          src={getMedia(data?.data?.img3)}
          width={500}
          height={500}
          alt="product Image"
        />
        <LandingOrderNow setSeeAttributeModal={setSeeAttributeModal} />
      </div>
    </section>
  );
};

export default Page;
