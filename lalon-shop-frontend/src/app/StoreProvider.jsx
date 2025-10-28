"use client";

import { setCart } from "@/redux/slice/cartSideBarSlice";
import { makeStore } from "@/redux/store";
import { useRef, useEffect } from "react";
import { Provider } from "react-redux";

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined);

  useEffect(() => {
    if (storeRef.current) {
      const cart = localStorage.getItem("lalon-cart");
      storeRef.current.dispatch(setCart(JSON.parse(cart) || {}));
    }
  }, [storeRef.current]);

  if (!storeRef.current) {
    storeRef.current = makeStore(); // Fallback during SSR to avoid errors
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
