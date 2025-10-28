import { useAppDispatch } from "@/redux/hooks";
import { changeOrderModal } from "@/redux/slice/orderModalSlice";
import { addToCart } from "@/utils/cart";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const LandingSelectAttributeModal = ({
  productDetials,
  setSeeAttributeModal,
}) => {
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
  console.log("productDetials", productDetials);

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

  const handlePoroborti = () => {
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
    setSeeAttributeModal(false);
    dispatch(changeOrderModal(true));
  };

  return (
    <div className="flex justify-center">
      <div className="w-[100vw] h-[100vh] bg-black opacity-30 scale-100 fixed z-[1000] top-0 left-0 duration-1000"></div>
      <div
        id="order-modal"
        className="p-3 max-h-full overflow-y-auto w-full sm:w-[600px] fixed z-[2000] duration-500"
      >
        <div className="bg-white h-full w-full rounded-lg p-5 relative">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-medium">পছন্দ নির্বাচন করুন</h4>
            <RxCross2
              onClick={() => setSeeAttributeModal(false)}
              className="text-xl hover:text-main duration-300 cursor-pointer"
            />
          </div>

          <div className="my-5">
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
          </div>
          <button
            onClick={handlePoroborti}
            className="border-2 border-main text-main font-semibold hover:bg-main hover:text-white duration-300
         w-full py-2 rounded-md"
          >
            পরবর্তী
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingSelectAttributeModal;
