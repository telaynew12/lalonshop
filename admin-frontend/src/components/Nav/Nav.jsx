/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { FaAlignLeft, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../features/auth/authSlice";

const Nav = ({ setShowLeftSideBar, showLeftSideBar }) => {
    const user = useSelector(state => state.auth.user)
    const [showDetails, setShowDetails] = useState(false)
    const dispatch = useDispatch()
    const ref = useRef(null)

    const signOut = () => {
        localStorage.removeItem('admin-token')
        dispatch(setUser(null))
    }

    const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
            setShowDetails(false)
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClick)
        return () => document.removeEventListener('click', handleClick)
    }, [handleClick])

    return (
        <div className=" bg-white border-b p-4 flex items-center justify-between shadow relative">
            <FaAlignLeft onClick={() => setShowLeftSideBar(!showLeftSideBar)} className=" text-xl cursor-pointer" />
            <div className="flex items-center gap-4 ">
                <div
                    ref={ref}
                    className="relative">
                    <FaUserCircle
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-2xl text-gray-800 cursor-pointer" />
                    <div
                        className={`absolute top-full right-full bg-white p-3 border shadow-xl z-40 min-w-48 rounded-lg flex flex-col items-center select-none duration-200   ${showDetails ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                        <FaUserCircle className="text-4xl text-gray-800" />
                        <p className="font-semibold text-xl mt-2 uppercase">{user?.name}</p>
                        <p className="text-orange-500 text-sm">{user?.role}</p>
                        <p
                            onClick={signOut}
                            className="flex items-center  p-3 rounded-md cursor-pointer gap-3 text-base font-medium  text-red-500"> <FaSignOutAlt /> Sign Out</p>
                    </div>
                </div>
                <IoNotificationsSharp className="text-2xl text-gray-800 " />
            </div>
        </div>
    );
};

export default Nav;