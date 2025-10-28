import { useState } from "react";
import logo from "../../../public/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png";
import SidebarSkleton from "../SidebarSkleton/SidebarSkleton";
import Image from "next/image";
import { useGetCategoryListQuery } from "@/redux/api/query";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LeftSidebar = ({ showLeftSideBar, setShowLeftSideBar }) => {
  const router = useRouter();
  const [category, setCategory] = useState([]);
  const { data } = useGetCategoryListQuery();

  const handleClick = (data) => {
    router.push(`/?category=${data?._id}&categoryName=${data?.name}`);
    setShowLeftSideBar(!showLeftSideBar);
  };

  return (
    <div className="bg-white left-sidebar px-5 w-full h-full border-t overflow-y-auto py-5 shadow-xl select-none">
      <Link href="/">
        <Image src={logo} alt="" className="w-20  md:hidden mb-7" />
      </Link>
      <div>
        <div className="grid gap-6">
          {data?.category?.map((item, i) => (
            <div onClick={() => handleClick(item)} key={i}>
              <p>{item?.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
