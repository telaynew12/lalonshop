import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import logo from '../../assets/logo/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png'

// eslint-disable-next-line react/prop-types
const AdminAuthGuard = ({ children }) => {

    const { user, loading } = useSelector(state => state.auth)

    if (loading) {
        return <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30">
   <img src={logo} className="w-24 bg-white rounded-full animate-pulse" alt="" />
        </div>
    }

    if (user?.role !== "admin") {
        return <Navigate to="/login" />
    }

    else {
        return children
    }
};

export default AdminAuthGuard;