"use client";

import CartSideBar from "@/components/CartSideBar/CartSideBar";
import Footer from "@/components/Footer/Footer";
import LeftSidebar from "@/components/LeftSidebar/LeftSidebar";
import Nav from "@/components/Nav/Nav";
import OrderModal from "@/components/OrderModal/OrderModal";
import { useAppSelector } from "@/redux/hooks";
import React, { useState } from "react";

const Layout = ({ children }) => {
  const [showLeftSideBar, setShowLeftSideBar] = useState(true);

  const cart = useAppSelector((state) => state.cart);
  const orderModalOpenClose = useAppSelector((state) => state.order);

  // console.log(cart?.showCartSideBar);

  return (
    <div>
      <Nav
        showLeftSideBar={showLeftSideBar}
        setShowLeftSideBar={setShowLeftSideBar}
      ></Nav>
      <div className="w-full flex items-start  ">
        <div
          onClick={() => setShowLeftSideBar((prev) => !prev)}
          className={`fixed top-0 block  left-0 w-full h-full bg-black opacity-50 z-[100] backdrop-blur-md ${
            showLeftSideBar ? "hidden" : "block"
          }`}
        ></div>

        <div
          className={`h-screen fixed  top-0 duration-500 w-[250px]  overflow-hidden  z-[100] ${
            showLeftSideBar ? "-ml-[262px]" : "ml-[0] "
          }`}
        >
          <LeftSidebar
            showLeftSideBar={showLeftSideBar}
            setShowLeftSideBar={setShowLeftSideBar}
          ></LeftSidebar>
        </div>
        {/* left sidebar end */}

        {/* main page */}
        <div className="duration-500 flex-1  relative ">{children}</div>
      </div>{" "}
      <Footer />
    </div>
  );
};

export default Layout;
