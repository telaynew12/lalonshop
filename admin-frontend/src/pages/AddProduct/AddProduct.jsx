import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaInfoCircle, FaRegImage } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import Select from "react-select";
import AddColor from "./components/AddColor/AddColor";
import AddSize from "./components/AddSize/AddSize";
import {
  additionalAttributes,
  deliveryTime,
  requiredProductFelids,
} from "./constant/constant";
import useGetCategories from "../../Hooks/useGetCategories";
import { BACKEND_URL } from "../../App";
import { toggleGlobalLoading } from "../../components/Modal/components/GlobalLoading/GlobalLoading";
import Attributes from "./components/Attributes/Attributes";
import { useNavigate, useSearchParams } from "react-router-dom";
import { set } from "firebase/database";
import getMedia from "../../utilities/getMedia";

const AddProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const id = searchParams.get("updateId");

  const [inputData, setInputData] = useState({});
  const [addNewColor, setAddNewColor] = useState(false);
  const [categories] = useGetCategories();
  const [subCategory, setSubCategory] = useState([]);
  const [subSubCategory, setSubSubCategory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`${BACKEND_URL}/api/v1/product/detail/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?._id) {
            setProductData(data);
            const {
              isFavorite,
              reviews,
              status,
              totalReview,
              attributes,
              category,
              subCategory: sub,
              subSubCategory: subSub,
              _id,
              ...othersData
            } = data;
            console.log(category, sub, subSub);
            setInputData({
              ...othersData,
              category: category?._id,
              subCategory: sub?._id || "",
              subSubCategory: subSub?._id || "",
              ...attributes,
            });
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }
  }, [id]);

  const onInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = async (e) => {
    const file = await e.target.files;
    let fileArray = [];
    await Promise.all(
      Object.keys(file).map((key) => {
        const singleFile = file[key];
        if (singleFile.type.includes("image")) {
          fileArray.push(singleFile);
        } else {
          return toast.error("Not Support video, audio or other file");
        }
      })
    );
    const prevData = inputData?.media || [];
    const availableSpace = 5 - prevData.length;
    onInputChange({
      target: {
        name: "media",
        value: [...prevData, ...fileArray.slice(0, availableSpace)],
      },
    });
  };

  const inputStyle = (baseStyles) => {
    return {
      ...baseStyles,
      boxShadow: "none",
      border: "1px solid #475569",
      borderRadius: 5,
      backgroundColor: "#F1F5F9",
    };
  };

  const getValue = (name, type) => {
    const fakeValue = type === "string" ? "" : type === "array" ? [] : "";
    return inputData[name] || fakeValue;
  };

  const deleteMedia = (mediaId) => {
    fetch(`${BACKEND_URL}/api/v1/product/image/${id}/${mediaId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("admin-token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Media deleted successfully");
          setInputData((prev) => ({
            ...prev,
            media: prev.media.filter((img) => img?._id !== mediaId),
          }));
        } else {
          toast.error(data?.message || "Failed to delete media");
        }
      });
  };

  const removeArrayValue = (name, index) => {
    const prevData = getValue(name, "array");
    onInputChange({
      target: {
        name,
        value: prevData.filter((_, i) => i !== index),
      },
    });
  };

  const handleTag = (e) => {
    if (e.key === "Enter" && e.target.value) {
      const prevTag = getValue("tags", "array");
      const newTag = e.target.value;
      if (prevTag.includes(newTag)) {
        return toast.error("Tag already added");
      }
      onInputChange({
        target: {
          name: "tags",
          value: [...prevTag, newTag],
        },
      });
      e.target.value = "";
    }
  };

  const getCategoryOption = () => {
    return categories?.map((cat) => ({ value: cat._id, label: cat.name }));
  };

  useEffect(() => {
    if (inputData?.category) {
      // onInputChange({
      //     target: {
      //         name: 'subCategory',
      //         value: ''
      //     }
      // })
      toggleGlobalLoading("open");
      fetch(`${BACKEND_URL}/api/v1/sub-category/${inputData?.category}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          toggleGlobalLoading("close");
          if (data.message) return toast.error(data.message);
          setSubCategory(
            data.subCategories.map(
              (cat) => ({ value: cat._id, label: cat.name } || [])
            )
          );
        });
    }
  }, [inputData?.category]);

  useEffect(() => {
    if (inputData?.subCategory) {
      // onInputChange({
      //     target: {
      //         name: 'subSubCategory',
      //         value: ''
      //     }
      // })
      toggleGlobalLoading("open");
      fetch(
        `${BACKEND_URL}/api/v1/sub-sub-category/${inputData?.subCategory}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("admin-token")}`,
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          toggleGlobalLoading("close");
          if (data.message) return toast.error(data.message);
          setSubSubCategory(
            data.subSubCategories.map(
              (cat) => ({ value: cat._id, label: cat.name } || [])
            )
          );
        });
    }
  }, [inputData?.subCategory]);

  console.log(inputData);
  const onSubmit = () => {
    let error = false;
    requiredProductFelids.forEach((field) => {
      if (error) return;
      const value = inputData[field];
      const validArray = Array.isArray(value);
      if (!value) {
        error = true;
        return toast.error(`${field} is required`);
      }
      if (validArray && value.length < 1) {
        error = true;
        return toast.error(`${field} is required`);
      }
    });

    if (error) return;

    const formData = new FormData();
    inputData.media.forEach((img) => {
      formData.append("media", img);
    });
    const data = { ...inputData };
    delete data.media;
    formData.append("data", JSON.stringify(data));
    toggleGlobalLoading("open");
    fetch(`${BACKEND_URL}/api/v1/product`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("admin-token")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Product added successfully");
          setInputData({});
          navigate("/products/pending");
        } else {
          toast.error(data.message);
        }
      })
      .finally(() => {
        toggleGlobalLoading("close");
      });
  };

  const onUpdate = () => {
    let error = false;
    requiredProductFelids.forEach((field) => {
      if (error) return;
      const value = inputData[field];
      const validArray = Array.isArray(value);
      if (!value) {
        error = true;
        return toast.error(`${field} is required`);
      }
      if (validArray && value.length < 1) {
        error = true;
        return toast.error(`${field} is required`);
      }
    });
    if (error) return;

    let updateData = { ...inputData };
    let media = inputData?.media || [];
    delete updateData.media;

    if (media?.length > 0) {
      media = media?.filter((img) => (img?._id ? false : true));
    }


    const formData = new FormData();
    media.forEach((img) => {
        formData.append("media", img);
    })
    formData.append("data", JSON.stringify(updateData));

    toggleGlobalLoading("open");
    fetch(`${BACKEND_URL}/api/v1/product/${id}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${localStorage.getItem("admin-token")}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Product updated successfully");
          navigate("/products/approved");
        } else {
          toast.error("Failed to update product");
        }
      })
      .finally(() => {
        toggleGlobalLoading("close");
      });
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="flex flex-col lg:flex-row w-full gap-5 lg:gap-3">
        <div className="w-full lg:w-[50%] p-3 rounded-md lg:p-4 bg-white flex flex-col gap-4 md:gap-6">
          {
            <div>
              <div className="flex gap-6 lg:gap-10 mt-3 flex-wrap">
                {getValue("media", "array")?.map((img, index) => (
                  <div
                    className="h-[90px] w-[90px] lg:h-[130px] lg:w-[130px] relative "
                    key={index}
                  >
                    <p
                      onClick={() =>
                        img?._id
                          ? deleteMedia(img?._id)
                          : removeArrayValue("media", index)
                      }
                      className="absolute top-0 right-0 rounded-full cursor-pointer bg-slate-600 text-white"
                    >
                      <IoIosClose />
                    </p>
                    <img
                      key={index}
                      src={
                        img?._id
                          ? getMedia(img?.name)
                          : URL.createObjectURL(img)
                      }
                      alt=""
                      className=" rounded-md  w-full h-full border"
                    />
                  </div>
                ))}
                {getValue("media", "array")?.length < 5 && (
                  <div className="h-[80px] w-[80px] lg:h-[130px] lg:w-[130px] bg-slate-200 relative cursor-pointer">
                    <FaRegImage className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-3xl lg:text-5xl text-gray-500" />
                    <p className="absolute top-full right-1 text-xs text-gray-500">
                      {getValue("media", "array").length}/5
                    </p>
                    <label
                      htmlFor="product-image"
                      className="absolute top-0 left-0 w-full h-full cursor-pointer"
                    ></label>
                  </div>
                )}
              </div>
            </div>
          }
          <div>
            <p className="text-xs lg:text-sm text-gray-600 mb-2">Title*</p>
            <input
              type="text"
              placeholder="Enter product title"
              name="title"
              onChange={onInputChange}
              value={getValue("title", "string")}
              className="w-full p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500 max-w-[450px]"
            />
            <input
              onChange={handleImage}
              multiple
              type="file"
              id="product-image"
              className="h-0 w-0 overflow-hidden"
            />
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600 mb-2">Description</p>
            <textarea
              rows={9}
              name="description"
              onChange={onInputChange}
              value={getValue("description", "string")}
              placeholder="Enter product description"
              className="w-full p-1 lg:p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500 max-w-[550px] h-full max-h-[100px] lg:max-h-[120px] resize-none"
            ></textarea>
          </div>
          <div className="mt-6 md:mt-7">
            <p className="text-xs lg:text-sm text-gray-600 mb-2">Price*</p>
            <input
              min={1}
              name="price"
              onChange={onInputChange}
              value={getValue("price", "number")}
              type="number"
              placeholder="Enter product price (BDT)"
              className="w-full p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500 max-w-[250px]"
            />
          </div>
          <div className="mt-6 md:mt-7">
            <p className="text-xs lg:text-sm text-gray-600 mb-2">
              Product Costing*
            </p>
            <input
              min={1}
              name="costing"
              onChange={onInputChange}
              value={getValue("costing", "number")}
              type="number"
              placeholder="Enter product costing (BDT)"
              className="w-full p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500 max-w-[250px]"
            />
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600 mb-2">Discount</p>
            <input
              min={1}
              type="number"
              name="discount"
              onChange={onInputChange}
              value={getValue("discount", "number")}
              placeholder="Enter Discount (BDT)"
              className="w-full p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500 max-w-[250px]"
            />
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600 mb-2">Brand</p>
            <input
              name="brand"
              onChange={onInputChange}
              value={getValue("brand", "string")}
              type="text"
              placeholder="Enter Brand name"
              className="w-full p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500 max-w-[300px]"
            />
          </div>
          <div className="mt-5 max-w-[300px] relative">
            <p className="text-xs lg:text-sm text-gray-600 mb-2">Tag</p>
            <input
              onKeyUp={handleTag}
              type="text"
              placeholder="Tag type (enter separated)"
              className="w-full p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500 "
            />
            <div className="flex flex-wrap mt-1 gap-2">
              {getValue("tags", "array")?.map((t, index) => (
                <span
                  key={index}
                  className="text-slate-100 text-xs bg-slate-600 px-2 py-1 rounded flex items-center gap-2"
                >
                  {t}
                  <IoIosClose
                    onClick={() => removeArrayValue("tags", index)}
                    className="text-lg cursor-pointer bg-gray-200 text-gray-800 rounded-full"
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[50%] p-3 rounded-md lg:p-4 bg-white flex flex-col gap-6">
          <div className="mt-6 md:mt-7">
            <p className="text-xs lg:text-sm text-gray-600 mb-2">Category*</p>
            <Select
              className="basic-single flex-1 border-0 relative max-w-[500px]"
              classNamePrefix="select"
              placeholder="Category"
              styles={{ control: (baseStyles) => inputStyle(baseStyles) }}
              onChange={(e) =>
                onInputChange({
                  target: {
                    name: "category",
                    value: e.value,
                  },
                })
              }
              name="color"
              value={getCategoryOption().find(
                (cat) => cat.value === getValue("category", "string")
              )}
              options={getCategoryOption()}
            />
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600 mb-2">
              Sub Category
            </p>
            <Select
              className="basic-single flex-1 border-0 relative max-w-[500px]"
              classNamePrefix="select"
              placeholder="Sub Category"
              styles={{ control: (baseStyles) => inputStyle(baseStyles) }}
              onChange={(e) =>
                onInputChange({
                  target: {
                    name: "subCategory",
                    value: e.value,
                  },
                })
              }
              value={subCategory.find(
                (cat) => cat.value === getValue("subCategory", "string")
              )}
              options={subCategory}
              name="color"
              getOptionLabel={(option) => (
                <div style={{ backgroundColor: option.color }}>
                  {option.label}
                </div>
              )}
            />
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600 mb-2">
              Sub Sub Category
            </p>
            <Select
              className="basic-single flex-1 border-0 relative max-w-[500px]"
              classNamePrefix="select"
              placeholder="Sub Sub Category"
              styles={{ control: (baseStyles) => inputStyle(baseStyles) }}
              onChange={(e) =>
                onInputChange({
                  target: {
                    name: "subSubCategory",
                    value: e.value,
                  },
                })
              }
              value={subSubCategory.find(
                (cat) => cat.value == getValue("subSubCategory", "string")
              )}
              name="color"
              options={subSubCategory}
            />
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-600 mb-2">Color</p>
            {getValue("color", "array").length > 0 && (
              <div className="text-xs">
                <table className="table mb-5">
                  <thead>
                    <tr>
                      <th>Color</th>
                      <th>Extra Charge</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getValue("color", "array").map((c, i) => (
                      <tr key={i}>
                        <td>
                          <p
                            style={{ backgroundColor: c.value }}
                            className={`h-4 w-4`}
                          ></p>
                        </td>
                        <td>{c.extraCharge}</td>
                        <td
                          onClick={() => removeArrayValue("color", i)}
                          className="cursor-pointer"
                        >
                          x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <span
              onClick={() => setAddNewColor((prev) => !prev)}
              className="bg-gray-600 text-gray-100 py-1 px-3 cursor-pointer text-xs rounded"
            >
              Add Color +
            </span>
            {addNewColor && (
              <AddColor
                setAddNewColor={setAddNewColor}
                onInputChange={onInputChange}
                getValue={getValue}
              />
            )}
          </div>
          {additionalAttributes.map((attr, index) => (
            <Attributes
              key={index}
              name={attr}
              getValue={getValue}
              removeArrayValue={removeArrayValue}
              onInputChange={onInputChange}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={productData ? onUpdate : onSubmit}
          className="bg-gray-700 py-2 px-10 rounded-md text-white mt-3 shadow-md"
        >
          {productData ? "Save Changes" : "Create"}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
