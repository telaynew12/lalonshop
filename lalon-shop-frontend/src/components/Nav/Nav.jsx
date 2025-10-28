import { FaSearch } from "react-icons/fa";
import logo3 from "../../../public/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png";
import { useEffect, useRef, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { PiShoppingCartLight } from "react-icons/pi";
import Image from "next/image";
import { useGetCategoryListQuery } from "@/redux/api/query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { changeShowCartSideBar } from "@/redux/slice/cartSideBarSlice";
const Nav = ({ showLeftSideBar, setShowLeftSideBar }) => {
  const [navShow, setNavShow] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const [navTop, setNavTop] = useState(true);
  const searchTextRef = useRef();
  const parentRef = useRef();
  const [inputFocus, setInputFocus] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState([]);
  const { data, isLoading } = useGetCategoryListQuery();
  const router = useRouter();
  const cart = useAppSelector((state) => state?.cart?.cart);

  const getKey = () => {
    const key = localStorage.getItem("search-key");
    if (key) {
      setSearchKeyword(key.split(","));
    } else {
      setSearchKeyword([]);
    }
  };

  const removeKey = (e, index) => {
    e.stopPropagation();
    const key = localStorage.getItem("search-key");
    const toArray = key.split(",");
    toArray.splice(index, 1);
    localStorage.setItem(
      "search-key",
      toArray
        .filter((s) => {
          if (s) {
            return s;
          }
        })
        .slice(0, 5)
        .join(",")
    );
    getKey();
  };

  useEffect(() => {
    getKey();
  }, []);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    setScrollTop(scrollY);
    if (scrollY > 200) {
      if (scrollY > scrollTop) {
        setNavShow(false);
      } else if (scrollY < scrollTop) {
        setNavShow(true);
      }
    }
    if (scrollY > 0) {
      setNavTop(false);
    } else {
      setNavTop(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const openCartSidebar = () => {
    // toggleCartSideBar('open')
  };

  const setNewSearchKey = (text) => {
    const searchKey = localStorage.getItem("search-key") || "";
    const toArray = searchKey.split(",");
    if (toArray.length >= 5 && !toArray.includes(text)) {
      toArray.pop();
      toArray.unshift(text);
    } else if (!toArray.includes(text)) {
      toArray.unshift(text);
    }
    localStorage.setItem(
      "search-key",
      toArray
        .filter((s) => {
          if (s) {
            return s;
          }
        })
        .slice(0, 5)
        .join(",")
    );
    getKey();
  };

  const handleSearch = () => {
    if (searchTextRef.current.value) {
      setNewSearchKey(searchTextRef.current.value);
      searchTextRef.current.blur();
      setInputFocus(false);
      router.push(`/?search=${searchTextRef.current.value}`);
    } else {
      router.push(`/`);
    }
  };

  const searchBtn = (e) => {
    e.stopPropagation();
    handleSearch();
  };

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (!parentRef?.current?.contains(e.target)) {
        setInputFocus(false);
      }
    });
    return () => {
      window.removeEventListener("click", () => {
        setInputFocus(false);
      });
    };
  }, []);

  const clickSearchKey = (e, key) => {
    e.stopPropagation();
    searchTextRef.current.value = key;
    handleSearch();
  };

  const getCartLength = () => {
    return Object.keys(cart).length
  };

  const dispatch = useAppDispatch();

  const openCartSideBar = () => {
    dispatch(changeShowCartSideBar(true))
  };

  return (
    <div
      className={`sticky select-none ${navShow ? "top-0" : "-top-52"} ${
        navTop ? "shadow-none" : "shadow-md"
      }  left-0 w-full duration-700  z-[80] `}
    >
      <div className="bg-white py-3">
        <div className="max-w-7xl mx-auto flex gap-3 lg:justify-between items-center lg:gap-7 px-4">
          <div className="flex items-center gap-3">
            <RiMenu2Fill
              onClick={() => setShowLeftSideBar(!showLeftSideBar)}
              className={` text-2xl md:hidden cursor-pointer duration-200 ${
                showLeftSideBar ? "rotate-180" : "rotate-0"
              }`}
            />
            <Link href={"/"}>
              <Image src={logo3} alt="" className="hidden md:block w-12" />
            </Link>
          </div>
          <div
            ref={parentRef}
            onClick={() => setInputFocus(true)}
            className="flex-1 relative flex items-center bg-slate-100 rounded-full p-1"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex-1"
            >
              <input
                placeholder="Search your products "
                type="text"
                ref={searchTextRef}
                className="w-full bg-transparent pl-3 px-2 py-2 outline-none "
              />
            </form>
            <div
              onClick={searchBtn}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-fit flex items-center justify-center bg-main hover:bg-orange-700 cursor-pointer text-white duration-300 p-2 lg:p-3 select-none group rounded-full"
            >
              <FaSearch className="group-active:scale-50 duration-300" />
            </div>
            {inputFocus && searchKeyword.length > 0 && (
              <div className="absolute text-xs md:text-sm top-full left-0 w-full p-2 bg-white shadow-lg">
                <p className="text-xs text-gray-400">Search Key</p>
                {searchKeyword.map((key, index) => (
                  <p
                    key={index}
                    onClick={(e) => clickSearchKey(e, key)}
                    className="flex cursor-pointer hover:bg-slate-50 justify-between items-center gap-2 p-2 border-b border-gray-100"
                  >
                    {key}
                    <span
                      className="text-gray-400 font-light"
                      onClick={(e) => removeKey(e, index)}
                    >
                      &#10006;
                    </span>
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className=" flex items-center gap-5">
            <div onClick={openCartSideBar} className="w-6 md:w-7 relative">
              <PiShoppingCartLight
                className="text-3xl cursor-pointer"
                onClick={openCartSidebar}
              />
              {getCartLength() > 0 && (
                <div className="absolute shadow-md -top-2 -right-2 bg-main text-white text-xs rounded-full w-5 h-5 flex justify-center items-center font-medium ">
                  {getCartLength()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {
        <div className="bg-white pb-5 pt-2 px-3 hidden md:block">
          <div className="flex gap-x-10 justify-center gap-y-4 flex-wrap  max-w-[1480px] mx-auto">
            {data?.category?.slice(0, 10).map((item, i) => (
              <div key={i}>
                <Link
                  href={`/?category=${item?._id}&categoryName=${item?.name}`}
                >
                  {item?.name}
                </Link>
              </div>  
            ))}
            {data?.category?.length && (
              <div> 
                <p
                  className=" cursor-pointer"
                  onClick={() => setShowLeftSideBar(!showLeftSideBar)}
                >
                  See More
                </p>
              </div>
            )}
            {isLoading &&
              new Array(10)
                .fill(0)
                .map((item, i) => (
                  <p
                    key={i}
                    className="animate-pulse bg-gray-200 w-20 h-5 rounded-md"
                  ></p>
                ))}
          </div>
        </div>
      }
    </div>
  );
};

export default Nav;
