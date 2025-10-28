"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeShowCartSideBar } from "@/redux/slice/cartSideBarSlice";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import getMedia from "@/utils/getMedia";
import {
  getAttribute,
  increaseQuantity,
  reduceQuantity,
  removeFromCart,
} from "@/utils/cart";
import { GoInbox } from "react-icons/go";
import Link from "next/link";
import { changeOrderModal } from "@/redux/slice/orderModalSlice";

const CartSideBar = () => {
  const dispatch = useAppDispatch();

  const closeCartSideBar = () => {
    dispatch(changeShowCartSideBar(false));
  };

  const cart = useAppSelector((state) => state.cart);

  const cartArray = Object.keys(cart?.cart).map((key) => {
    return {
      key: key,
      ...cart?.cart[key],
    };
  });

  const totalPrice = cartArray?.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleRemoveFromCart = (id) => {
    removeFromCart(dispatch, id);
  };

  const handleAddQuantity = (id) => {
    increaseQuantity(dispatch, id);
  };

  const handleReduceQuantity = (id) => {
    reduceQuantity(dispatch, id);
  };

  const openOrderNowModal = () => {
    dispatch(changeOrderModal(true));
    dispatch(changeShowCartSideBar(false));
  };

  return (
    <div>
      <div
        onClick={closeCartSideBar}
        className={` fixed top-0 left-0 backdrop-blur-sm w-full h-full bg-black duration-300  bg-opacity-25 z-[1000] ${
          cart?.showCartSideBar ? "visible opacity-100" : "invisible opacity-0"
        }`}
      ></div>
      <div
        className={`p-3 h-full w-full sm:w-[400px]  fixed z-[2000] top-0 -right-[100%] duration-500 ease-in-out ${
          cart?.showCartSideBar ? "right-0" : "-right-[100%]"
        }`}
      >
        <div className="bg-white h-full overflow-auto w-full rounded-lg p-5 relative">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-medium">Shoping Cart</h4>
            <RxCross2
              onClick={closeCartSideBar}
              className="text-xl hover:text-main duration-300 cursor-pointer"
            />
          </div>
          {cartArray?.length > 0 ? (
            <div className="mt-5 space-y-3">
              {cartArray?.map((cartItem, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Image
                    className="border border-main rounded-lg w-20 h-20 lg:w-[100px] lg:h-[100px]"
                    src={getMedia(cartItem?.image)}
                    height={100}
                    width={100}
                    alt="cart item"
                  />
                  <div className="">
                    <h5 className="font-semibold">{cartItem?.name}</h5>
                    <h6 className="text-gray-600">
                      Tk. {cartItem?.price * cartItem?.quantity}.00
                    </h6>
                    <div className="text-gray-500 text-sm mb-[4px] flex flex-wrap gap-1px">
                      {getAttribute(cartItem)}
                    </div>
                    <div className="flex items-center gap-3 lg:gap-5">
                      <div className="flex items-center border border-main w-fit rounded-[5.2px]">
                        <button
                          disabled={cartItem?.quantity <= 1}
                          onClick={() => handleReduceQuantity(cartItem?.key)}
                          className={`${
                            cartItem?.quantity <= 1
                              ? "bg-orange-300"
                              : "bg-main"
                          } text-white p-[4px] rounded-l-[5.2px] md:p-[6px] `}
                        >
                          <FaMinus />
                        </button>
                        <div className="px-3 flex-1">{cartItem?.quantity}</div>
                        <button
                          onClick={() => handleAddQuantity(cartItem?.key)}
                          className="bg-main text-white rounded-r-[5.2px] p-[4px] md:p-[6px]"
                        >
                          <FaPlus />
                        </button>
                      </div>
                      <p
                        onClick={() => handleRemoveFromCart(cartItem?.key)}
                        className="text-main underline cursor-pointer"
                      >
                        Remove
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[90%]">
              <div className="flex flex-col gap-2 items-center text-gray-500">
                <GoInbox className="text-6xl" />
                <h6 className="text-lg font-semibold">Oops! Cart is Empty</h6>
              </div>
            </div>
          )}

          <div className="absolute bg-white w-full rounded-xl bottom-0 left-0 p-5 space-y-3">
            <hr />
            {cartArray?.length > 0 ? (
              <>
                <div className="flex justify-between">
                  <h6>Subtotal</h6>
                  <p>Tk. {totalPrice}.00</p>
                </div>
                <button
                  onClick={openOrderNowModal}
                  className="bg-main text-white w-full p-2 font-semibold rounded-lg"
                >
                  Order On Cash on Delevery
                </button>
              </>
            ) : (
              <Link
                onClick={closeCartSideBar}
                href="/"
                className="bg-main text-white w-full p-2 font-semibold rounded-lg block text-center"
              >
                Continue Shoping
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSideBar;
