import logo from "../../assets/logo/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import img from "../../assets/bg/arrangement-black-friday-shopping-carts-with-copy-space.jpg";
import { BACKEND_URL } from "../../App";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import { toggleGlobalLoading } from "../../components/Modal/components/GlobalLoading/GlobalLoading";
import toast from "react-hot-toast";
const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!email) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    setError("");
    toggleGlobalLoading("open");
    fetch(`${BACKEND_URL}/api/v1/auth/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        toggleGlobalLoading("close");
        if (data.message) return toast.error(data.message);
        else {
          localStorage.setItem("admin-token", data.token);
          dispatch(setUser(data.info));
        }
      });
  };

  return (
    <div
      style={{ backgroundImage: `url(${img})` }}
      className="w-screen h-screen overflow-y-auto bg-current bg-cover bg-no-repeat  "
    >
      <div className="fixed top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 max-w-[400px] w-full px-5">
        <div className="rounded-lg bg-white  w-full">
          <div className="relative h-auto"></div>
          <div className="px-7 pt-4 pb-8 rounded-3xl shadow-xl">
            <img
              className="w-[100px] md:w-[130px] mt-2 mb-7 mx-auto"
              src={logo}
              alt=""
            />
            {error && <p className="my-4 text-red-500 text-sm">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  required
                  name="email"
                  type="text"
                  className="peer w-full px-0.5 border-0 border-b-2 
                                                    py-2
                                                    focus:outline-none
                                                    border-gray-300 placeholder-transparent 
                                                    focus:ring-0
                                                    bg-white
                                                    focus:border-orange-500"
                  placeholder="willPig@tailwind.com"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-orange-500 peer-focus:text-sm"
                >
                  Email
                </label>
              </div>
              <div className="mt-5 relative">
                {showPass ? (
                  <FaEye
                    onClick={() => setShowPass(false)}
                    className="absolute cursor-pointer right-2 bottom-3"
                  />
                ) : (
                  <FaEyeSlash
                    onClick={() => setShowPass(true)}
                    className="absolute cursor-pointer right-2 bottom-3"
                  />
                )}
                <input
                  required
                  type={showPass ? "text" : "password"}
                  name="password"
                  className="peer w-full px-0.5 border-0 py-2 focus:outline-none bg-white
                                                    border-b-2 border-gray-300 placeholder-transparent focus:ring-0 focus:border-orange-500"
                  placeholder="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-orange-500 peer-focus:text-sm"
                >
                  Password
                </label>
              </div>
              <input
                type="submit"
                value="Sign In"
                className="w-full mt-14 py-2  text-white font-semibold text-center rounded-full bg-main transition-all hover:bg-orange-700 focus:outline-none cursor-pointer"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
