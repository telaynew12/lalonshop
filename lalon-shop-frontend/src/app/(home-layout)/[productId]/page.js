"use client";

import { useParams } from "next/navigation";
import { useProductDetailsQuery } from "@/redux/api/query";
import Image from "next/image";
import getMedia from "@/utils/getMedia";
import { TbTruckDelivery } from "react-icons/tb";
import { useState } from "react";
import OurFeaturesSectionForProductDetailsPage from "@/components/OurFeaturesSectionForProductDetailsPage/OurFeaturesSectionForProductDetailsPage";
import YouMightAlsoLike from "@/components/YouMightAlsoLike/YouMightAlsoLike";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/utils/cart";
import { changeShowCartSideBar } from "@/redux/slice/cartSideBarSlice";
import PruductDetailsSkeleton from "@/components/PruductDetailsSkeleton/PruductDetailsSkeleton";
import { changeOrderModal } from "@/redux/slice/orderModalSlice";
import { FaEarthAfrica, FaMinus, FaPeopleRoof, FaPlus } from "react-icons/fa6";
import { RiSecurePaymentFill } from "react-icons/ri";
import box from "../../../../public/box.png";

const Page = () => {
  const [readMore, setReadMore] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedHeight, setSelectedHeight] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedWidth, setSelectedWidth] = useState("");
  const [colorSelectionError, setColorSelectionError] = useState("");
  const [heightSelectionError, setHeightSelectionError] = useState("");
  const [materialSelectionError, setMaterialSelectionError] = useState("");
  const [sizeSelectionError, setSizeSelectionError] = useState("");
  const [variantSelectionError, setVariantSelectionError] = useState("");
  const [widthSelectionError, setWidthSelectionError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const params = useParams();
  const { data: productDetials, isLoading } = useProductDetailsQuery(
    params?.productId
  );
  const cart = useAppSelector((state) => state.cart);

  const dispatch = useAppDispatch();

  const addProductToCart = () => {
    addToCart(dispatch, {
      product: productDetials?._id,
      name: productDetials?.title,
      price: productDetials?.price - productDetials?.discount,
      image: productDetials?.media[0]?.name,
      quantity: 1,
      color: selectedColor,
      material: selectedMaterial,
      height: selectedHeight,
      size: selectedSize,
      variant: selectedVariant,
      width: selectedWidth,
    });
  };

  const handleAddToCart = () => {
    let hasError = false;

    if (productDetials?.attributes?.color?.length > 0 && selectedColor === "") {
      setColorSelectionError("Please select a Color!!");
      hasError = true;
    } else {
      setColorSelectionError("");
    }
    if (
      productDetials?.attributes?.height?.length > 0 &&
      selectedHeight === ""
    ) {
      setHeightSelectionError("Please select a Height");
      hasError = true;
    } else {
      setHeightSelectionError("");
    }
    if (
      productDetials?.attributes?.material?.length > 0 &&
      selectedMaterial === ""
    ) {
      setMaterialSelectionError("Please select a Material");
      hasError = true;
    } else {
      setMaterialSelectionError("");
    }
    if (productDetials?.attributes?.size?.length > 0 && selectedSize === "") {
      setSizeSelectionError("Please select a Size");
      hasError = true;
    } else {
      setSizeSelectionError("");
    }
    if (
      productDetials?.attributes?.variant?.length > 0 &&
      selectedVariant === ""
    ) {
      setVariantSelectionError("Please select a Variant");
      hasError = true;
    } else {
      setVariantSelectionError("");
    }
    if (productDetials?.attributes?.width?.length > 0 && selectedWidth === "") {
      setWidthSelectionError("Please select a Width");
      hasError = true;
    } else {
      setWidthSelectionError("");
    }

    if (hasError) {
      return;
    }

    addProductToCart();

    dispatch(changeShowCartSideBar(true));
  };

  const slides = productDetials?.media?.map((image) => ({
    src: getMedia(image?.name),
    alt: "Product Image",
  }));

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  const openOrderNowModal = () => {
    let hasError = false;

    if (productDetials?.attributes?.color?.length > 0 && selectedColor === "") {
      setColorSelectionError("Please select a Color!!");
      hasError = true;
    } else {
      setColorSelectionError("");
    }
    if (
      productDetials?.attributes?.height?.length > 0 &&
      selectedHeight === ""
    ) {
      setHeightSelectionError("Please select a Height");
      hasError = true;
    } else {
      setHeightSelectionError("");
    }
    if (
      productDetials?.attributes?.material?.length > 0 &&
      selectedMaterial === ""
    ) {
      setMaterialSelectionError("Please select a Material");
      hasError = true;
    } else {
      setMaterialSelectionError("");
    }
    if (productDetials?.attributes?.size?.length > 0 && selectedSize === "") {
      setSizeSelectionError("Please select a Size");
      hasError = true;
    } else {
      setSizeSelectionError("");
    }
    if (
      productDetials?.attributes?.variant?.length > 0 &&
      selectedVariant === ""
    ) {
      setVariantSelectionError("Please select a Variant");
      hasError = true;
    } else {
      setVariantSelectionError("");
    }
    if (productDetials?.attributes?.width?.length > 0 && selectedWidth === "") {
      setWidthSelectionError("Please select a Width");
      hasError = true;
    } else {
      setWidthSelectionError("");
    }

    if (hasError) {
      return;
    }

    addProductToCart();
    dispatch(changeOrderModal(true));
  };

  return (
    <section>
      {isLoading ? (
        <PruductDetailsSkeleton />
      ) : (
        <div className="container mx-auto flex flex-col md:gap-5 md:flex-row md:items-start p-5">
          <div className="w-full md:w-1/2 ">
            {!isLoading && (
              <div className="relative w-full">
                {slides?.length > 1 && (
                  <button
                    className="absolute top-1/2 left-2 -translate-y-1/2 text-main rounded-full p-2 text-2xl"
                    onClick={prevSlide}
                  >
                    ❮
                  </button>
                )}
                <Image
                  src={slides?.[currentIndex].src}
                  alt={slides?.[currentIndex].alt}
                  className="rounded-lg w-full aspect-square object-cover border border-main"
                  width={500}
                  height={500}
                />
                {slides?.length > 1 && (
                  <button
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-main rounded-full p-2 text-2xl"
                    onClick={nextSlide}
                  >
                    ❯
                  </button>
                )}
              </div>
            )}

            {!isLoading && slides?.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {slides?.map((slide, index) => (
                  <Image
                    key={index}
                    src={slide.src}
                    alt={slide.alt}
                    height={50}
                    width={50}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-16 h-16 rounded-lg cursor-pointer border-2 ${
                      index === currentIndex
                        ? "border-main"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="md:w-1/2 space-y-4 pt-5 md:p-5">
            <h3 className="text-3xl font-bold">{productDetials?.title}</h3>
            <div className="flex gap-2 text-2xl font-[300]">
              {productDetials?.discount > 0 && (
                <p className="line-through">Tk.{productDetials?.price}</p>
              )}
              <p>Tk.{productDetials?.price - productDetials?.discount}</p>
            </div>
            <hr />

            {/* Color */}
            {productDetials?.attributes?.color?.length > 0 && (
              <div>
                <h5 className="font-semibold text-xl mb-2">Color</h5>
                <div className="flex gap-2 flex-wrap">
                  {productDetials?.attributes?.color.map((color, i) => (
                    <div
                      onClick={() => setSelectedColor(color?.name)}
                      className={`${
                        selectedColor === color?.name
                          ? "border-main text-main"
                          : "border-gray-500"
                      } flex items-center border-2 py-1 px-2 rounded-full gap-1 hover:border-main hover:text-main duration-300 cursor-pointer`}
                      key={i}
                    >
                      <span
                        style={{ backgroundColor: color?.value }}
                        className="h-5 w-5 rounded-full"
                      ></span>
                      <p>{color?.name}</p>
                    </div>
                  ))}
                </div>
                {colorSelectionError.length > 0 && (
                  <p className="text-red-600 mt-2">{colorSelectionError}</p>
                )}
              </div>
            )}

            {/* Height */}
            {productDetials?.attributes?.height?.length > 0 && (
              <div>
                <h5 className="font-semibold text-xl mb-2">Height</h5>
                <div className="flex gap-2 flex-wrap">
                  {productDetials?.attributes?.height?.map((height, i) => (
                    <div
                      onClick={() => setSelectedHeight(height?.name)}
                      className={`${
                        selectedHeight === height?.name
                          ? "border-main text-main"
                          : "border-gray-500"
                      } flex items-center border-2 py-1 px-2 rounded-full gap-1 hover:border-main hover:text-main duration-300 cursor-pointer`}
                      key={i}
                    >
                      <p>{height?.name}</p>
                    </div>
                  ))}
                </div>
                {heightSelectionError.length > 0 && (
                  <p className="text-red-600 mt-2">{heightSelectionError}</p>
                )}
              </div>
            )}

            {/* Material */}
            {productDetials?.attributes?.material?.length > 0 && (
              <div>
                <h5 className="font-semibold text-xl mb-2">Material</h5>
                <div className="flex gap-2 flex-wrap">
                  {productDetials?.attributes?.material?.map((material, i) => (
                    <div
                      onClick={() => setSelectedMaterial(material?.name)}
                      className={`${
                        selectedMaterial === material?.name
                          ? "border-main text-main"
                          : "border-gray-500"
                      } flex items-center border-2 py-1 px-2 rounded-full gap-1 hover:border-main hover:text-main duration-300 cursor-pointer`}
                      key={i}
                    >
                      <p>{material?.name}</p>
                    </div>
                  ))}
                </div>
                {materialSelectionError.length > 0 && (
                  <p className="text-red-600 mt-2">{materialSelectionError}</p>
                )}
              </div>
            )}

            {/* Size */}
            {productDetials?.attributes?.size?.length > 0 && (
              <div>
                <h5 className="font-semibold text-xl mb-2">Size</h5>
                <div className="flex gap-2 flex-wrap">
                  {productDetials?.attributes?.size?.map((size, i) => (
                    <div
                      onClick={() => setSelectedSize(size?.name)}
                      className={`${
                        selectedSize === size?.name
                          ? "border-main text-main"
                          : "border-gray-500"
                      } flex items-center border-2 py-1 px-2 rounded-full gap-1 hover:border-main hover:text-main duration-300 cursor-pointer`}
                      key={i}
                    >
                      <p>{size?.name}</p>
                    </div>
                  ))}
                </div>
                {sizeSelectionError.length > 0 && (
                  <p className="text-red-600 mt-2">{sizeSelectionError}</p>
                )}
              </div>
            )}

            {/* Variant */}
            {productDetials?.attributes?.variant?.length > 0 && (
              <div>
                <h5 className="font-semibold text-xl mb-2">Variant</h5>
                <div className="flex gap-2 flex-wrap">
                  {productDetials?.attributes?.variant?.map((variant, i) => (
                    <div
                      onClick={() => setSelectedVariant(variant?.name)}
                      className={`${
                        selectedVariant === variant?.name
                          ? "border-main text-main"
                          : "border-gray-500"
                      } flex items-center border-2 py-1 px-2 rounded-full gap-1 hover:border-main hover:text-main duration-300 cursor-pointer`}
                      key={i}
                    >
                      <p>{variant?.name}</p>
                    </div>
                  ))}
                </div>
                {variantSelectionError.length > 0 && (
                  <p className="text-red-600 mt-2">{variantSelectionError}</p>
                )}
              </div>
            )}

            {/* Width */}
            {productDetials?.attributes?.width?.length > 0 && (
              <div>
                <h5 className="font-semibold text-xl mb-2">Width</h5>
                <div className="flex gap-2 flex-wrap">
                  {productDetials?.attributes?.width?.map((width, i) => (
                    <div
                      onClick={() => setSelectedWidth(width?.name)}
                      className={`${
                        selectedWidth === width?.name
                          ? "border-main text-main"
                          : "border-gray-500"
                      } flex items-center border-2 py-1 px-2 rounded-full gap-1 hover:border-main hover:text-main duration-300 cursor-pointer`}
                      key={i}
                    >
                      <p>{width?.name}</p>
                    </div>
                  ))}
                </div>
                {widthSelectionError.length > 0 && (
                  <p className="text-red-600 mt-2">{widthSelectionError}</p>
                )}
              </div>
            )}

            {/* <div>
              <h5 className="font-semibold text-xl mb-2">Quantity</h5>
              <div className="flex items-center border mt-1 border-main w-fit rounded-[5.2px]">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((prev) => prev - 1)}
                  className={`${
                    quantity <= 1 ? "bg-orange-300" : "bg-main"
                  } text-white p-[4px] rounded-l-[5.2px] md:p-[6px] `}
                >
                  <FaMinus />
                </button>
                <div className="px-3 flex-1">{quantity}</div>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="bg-main text-white rounded-r-[5.2px] p-[4px] md:p-[6px]"
                >
                  <FaPlus />
                </button>
              </div>
            </div> */}

            <div>
              <p className="flex items-center pt-5 gap-1 text-lg">
                <TbTruckDelivery className="text-xl text-gray-700" /> Home
                delivery all over Bangladesh
              </p>
              <div className="flex pb-3 items-center gap-[6px] text-lg mt-2">
                <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                In stock, ready to ship
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="border-2 border-main text-main font-semibold hover:bg-main hover:text-white duration-300
       w-full py-2 rounded-md"
            >
              Add to Cart
            </button>

            <button
              onClick={openOrderNowModal}
              className="border-2 border-main font-semibold bg-main hover:bg-orange-500 hover:border-orange-500 text-white duration-300
       w-full py-2 rounded-md"
            >
              Buy It Now
            </button>

            <div className=" flex flex-col gap-2 pt-3">
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <FaEarthAfrica />
                Hassle-free shipping
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <RiSecurePaymentFill />
                100% Secured Payment
              </p>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <FaPeopleRoof />
                Made by the Professionals
              </p>
            </div>

            {/* Description */}
            {productDetials?.description && (
              <p className="text-gray-500 text-lg">
                {productDetials?.description?.slice(
                  0,
                  readMore ? productDetials?.description?.length : 330
                )}
                {productDetials?.description?.length > 330 && (
                  <span
                    onClick={() => setReadMore(!readMore)}
                    className="text-main w-fit cursor-pointer hover:underline"
                  >
                    {readMore ? (
                      " Show Less"
                    ) : (
                      <>
                        <span className="text-gray-500">...</span>Read More
                      </>
                    )}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      <OurFeaturesSectionForProductDetailsPage />
      <YouMightAlsoLike productId={params?.productId} />
    </section>
  );
};

export default Page;
