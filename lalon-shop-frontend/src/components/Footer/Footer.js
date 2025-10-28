import Image from "next/image";
import Logo from "../../../public/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png";
import Link from "next/link";
import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-main text-white mt-10">
      <div className="container p-10">
        <div className="flex flex-col md:flex-row md:justify-around gap-5 md:gap-10 items-center">
          <h3 className="text-center md:text-left text-2xl font-[900] w-full md:w-1/6 min-w-fit">
            <span className="text-[#342308]">LALON </span>
            SHOP BD
          </h3>
          <div className="w-full md:w-1/6 ">
            <Image className="w-32 mx-auto" src={Logo} alt="Logo" />
          </div>
          <div className="flex w-full md:w-1/6  gap-5 justify-center md:justify-end">
            <Link
              className="bg-[#342308] p-2 rounded-full"
              target="_blank"
              href="https://www.facebook.com/LalonShopBD"
            >
              <FaFacebook className="text-2xl md:text-3xl" />
            </Link>
            <Link className="bg-[#342308] p-2 rounded-full" href="#">
              <AiFillInstagram className="text-2xl md:text-3xl" />
            </Link>
            <Link
              className="bg-[#342308] p-2 rounded-full"
              href="https://www.tiktok.com/@lalon.shop.bd?_t=ZS-8szAyT5VDsI&_r=1"
            >
              <FaTiktok className="text-2xl md:text-3xl" />
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-[#342308] text-xs sm:text-sm md:text-base py-4 font-medium">
        <p className="text-center">
          &copy; {currentYear} All rights reserved. Developed by{" "}
          <a
            className="underline"
            href="https://www.facebook.com/people/Brainwave-Digital-Solution/61558654686738/?mibextid=LQQJ4d"
          >
            Brainwave Digital Solution
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
