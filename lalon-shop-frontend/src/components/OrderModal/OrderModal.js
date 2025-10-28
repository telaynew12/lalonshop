"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import getMedia from "@/utils/getMedia";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import Image from "next/image";
import {
  clearCart,
  getAttribute,
  increaseQuantity,
  reduceQuantity,
  removeFromCart,
} from "@/utils/cart";
import { changeOrderModal } from "@/redux/slice/orderModalSlice";
import { useCreateOrderMutation } from "@/redux/api/query";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const OrderModal = () => {
  const [createOrder] = useCreateOrderMutation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [district, setDistrict] = useState("");
  const [orderStep, setOrderStep] = useState(1);
  const isOpen = useAppSelector((state) => state?.order).isOpen;
  const [error, setError] = useState("");

  const dispatch = useAppDispatch();
  const [insideOutCity, setInsideOutCity] = useState("dhaka");

  const cart = useAppSelector((state) => state.cart);
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(cart?.cart || {}).length === 0) {
      dispatch(changeOrderModal(false));
    }
  }, [cart?.cart]);

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

  const closeOrderModal = () => {
    dispatch(changeOrderModal(false));
  };

  const handleConfirmOrder = async () => {
    const payload = {
      name: name,
      phone: phone,
      email: email || "",
      address: address,
      subDistrict: subDistrict,
      district: district,
      deliveryCharge:
        (insideOutCity === "dhaka" && 70) ||
        (insideOutCity === "outside" && 130),
      products: cart?.cart,
    };

    const newOrder = await createOrder(payload);

    clearCart(dispatch);

    Swal.fire({
      title: "আপনার অর্ডারটি সম্পূর্ণ হয়েছে",
      text: "শীঘ্রই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করেবেন",
      confirmButtonColor: "#FA9F0A",
      icon: "success",
    });

    router.push("/");
  };

  const handlePoroborti = () => {
    if (
      name.length < 1 ||
      address.length < 1 ||
      subDistrict.length < 1 ||
      district.length < 1
    ) {
      setError("দয়া করে সঠিক তথ্য দিন");
      return;
    } else {
      setError("");

      setOrderStep(2);
    }
  };

  return (
    <div>
      <div
        onClick={closeOrderModal}
        className={` fixed top-0 left-0 backdrop-blur-sm w-full h-full bg-black duration-300  bg-opacity-25 z-[1000] ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      ></div>
      <div
        id="order-modal"
        className={`p-3 max-h-full overflow-y-auto w-full sm:w-[600px] fixed z-[2000] duration-500 ease-in-out top-2/4  left-2/4 -translate-x-2/4 -translate-y-2/4 ${
          isOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-90 opacity-0"
        }`}
      >
        <div className="bg-white h-full w-full rounded-lg p-5 relative">
          <div className="relative mb-3">
            {orderStep === 2 && (
              <IoArrowBack
                onClick={() => setOrderStep(1)}
                className="text-xl absolute left-0 top-1 hover:text-main duration-300 cursor-pointer"
              />
            )}
            <h4 className=" sm:text-xl text-center text-main font-medium">
              {orderStep === 1
                ? "অর্ডার করতে নিচের ফর্মটি পূরণ করুন"
                : "অর্ডার কনফার্ম করুন"}
            </h4>
            <RxCross2
              onClick={closeOrderModal}
              className="text-xl absolute right-0 top-1 hover:text-main duration-300 cursor-pointer"
            />
          </div>

          {orderStep === 1 ? (
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-semibold mb-1">
                  নাম<span className="text-red-600">*</span>
                </p>
                <input
                  className="w-full px-2 py-2 rounded-lg border outline-none"
                  type="text"
                  placeholder="Type your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold mb-1">
                  ফোন<span className="text-red-600">*</span>
                </p>
                <input
                  className="w-full px-2 py-2 rounded-lg border outline-none"
                  type="number"
                  placeholder="Type your Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              {/* <div>
                <p className="font-semibold mb-1">ইমেইল</p>
                <input
                  className="w-full px-2 py-2 rounded-lg border outline-none"
                  type="email"
                  placeholder="Type your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div> */}
              <div>
                <p className="font-semibold mb-1">
                  ঠিকানা<span className="text-red-600">*</span>
                </p>
                <input
                  className="w-full px-2 py-2 rounded-lg border outline-none"
                  type="text"
                  placeholder="House, Road No., Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <p className="font-semibold mb-1">
                  উপজেলা<span className="text-red-600">*</span>
                </p>
                <input
                  className="w-full px-2 py-2 rounded-lg border outline-none"
                  type="text"
                  placeholder="Sub-District"
                  value={subDistrict}
                  onChange={(e) => setSubDistrict(e.target.value)}
                />
              </div>

              <div>
                <p className="font-semibold mb-1">
                  জেলা<span className="text-red-600">*</span>
                </p>
                <input
                  className="w-full px-2 py-2 rounded-lg border outline-none"
                  type="text"
                  placeholder="District"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
              {error && <p className="text-red-600 my-2">{error}</p>}
              <button
                onClick={handlePoroborti}
                className="border-2 border-main text-main font-semibold hover:bg-main hover:text-white duration-300 w-full py-2 rounded-md"
              >
                পরবর্তী
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <p className="font-semibold">
                  নাম: <span className="font-normal text-gray-500">{name}</span>
                </p>
                <p className="font-semibold">
                  ফোন:{" "}
                  <span className="font-normal text-gray-500">{phone}</span>
                </p>
                {email && (
                  <p className="font-semibold">
                    ইমেল:{" "}
                    <span className="font-normal text-gray-500">{email}</span>
                  </p>
                )}
                <p className="font-semibold">
                  ঠিকানা:{" "}
                  <span className="font-normal text-gray-500">
                    {address}, {subDistrict}, {district}
                  </span>
                </p>
              </div>
              <div className="border py-3 px-4 rounded-lg space-y-2 my-4">
                <div
                  onClick={() => setInsideOutCity("dhaka")}
                  className="flex items-center gap-2 justify-between cursor-pointer"
                >
                  <div className="border border-main rounded-full h-[15px] w-[15px] flex items-center justify-center">
                    {insideOutCity === "dhaka" && (
                      <div className="bg-main w-[10px] h-[10px] rounded-full"></div>
                    )}
                  </div>
                  <p className="font-semibold flex-1">কুষ্টিয়ার ভিতরে</p>
                  <p className="font-bold text-lg">Tk. 70.00</p>
                </div>
                <hr />
                <div
                  onClick={() => setInsideOutCity("outside")}
                  className="flex items-center gap-2 justify-between cursor-pointer"
                >
                  <div className="border border-main rounded-full h-[15px] w-[15px] flex items-center justify-center">
                    {insideOutCity === "outside" && (
                      <div className="bg-main w-[10px] h-[10px] rounded-full"></div>
                    )}
                  </div>
                  <p className="font-semibold flex-1">কুষ্টিয়ার বাহিরে</p>
                  <p className="font-bold text-lg">Tk. 130.00</p>
                </div>
              </div>

              <hr />
              {cartArray?.map((cartItem, i) => (
                <div key={i} className="flex items-center gap-3 mt-5">
                  <Image
                    className="border border-main rounded-lg w-20 h-20 lg:w-[110px] lg:h-[110px]"
                    src={getMedia(cartItem?.image)}
                    height={100}
                    width={100}
                    alt="cart item"
                  />
                  <div className="lg:space-y-1">
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
                        <div className="px-3">{cartItem?.quantity}</div>
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

              <div className="bg-gray-100 p-3 rounded-lg my-4 space-y-1">
                <div className="flex justify-between text-lg">
                  <p>সাব টোটাল</p>
                  <p className="font-semibold">Tk. {totalPrice}.00</p>
                </div>
                <div className="flex justify-between text-lg">
                  <p>ডেলিভারি চার্জ</p>
                  <p className="font-semibold">
                    Tk. {insideOutCity === "dhaka" && 70}
                    {insideOutCity === "outside" && 130}.00
                  </p>
                </div>
                <hr />
                <div className="flex justify-between md:text-lg">
                  <p>সর্বমোট</p>
                  <p className="font-semibold">
                    Tk.{" "}
                    {totalPrice + (insideOutCity === "dhaka" && 70) ||
                      (insideOutCity === "outside" && 130)}
                    .00
                  </p>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                className="border-2 border-main text-main font-semibold hover:bg-main hover:text-white duration-300
         w-full py-2 rounded-md"
              >
                Confirm Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
