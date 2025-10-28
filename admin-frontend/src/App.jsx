import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout/DashboardLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Login/Login";
import AdminAuthGuard from "./authGuard/AdminAuthGuard/AdminAuthGuard";
import Modal from "./components/Modal/Modal";
import LoginGuard from "./authGuard/LoginGuard/LoginGuard";
import Users from "./pages/Users/Users";
import Categories from "./pages/Categories/Categories";
import SubCategories from "./pages/SubCategories/SubCategories";
import SubSubCategories from "./pages/SubSubCategories/SubSubCategories";
import useSocketConnect from "./Hooks/useSockeConnect";
import useAutoLogin from "./Hooks/useAutoLogin";
import AddProduct from "./pages/AddProduct/AddProduct";
import { Toaster } from "react-hot-toast";
import Products from "./pages/Products/Products";
import ApprovedProduct from "./pages/Products/components/ApprovedProduct/ApprovedProduct";
import PendingProduct from "./pages/Products/components/PendingProduct/PendingProduct";
import RejectedProduct from "./pages/Products/components/RejectedProduct/RejectedProduct";
import Courier from "./pages/Courier/Courier";
import Orders from "./pages/Orders/Orders";
import Pending from "./pages/Orders/componets/Pending/Pending";
import Accepted from "./pages/Orders/componets/Accepted/Accepted";
import Shipped from "./pages/Orders/componets/Shipped/Shipped";
import Returned from "./pages/Orders/componets/Returned/Returned";
import Canceled from "./pages/Orders/componets/Canceled/Canceled";
import Confirmed from "./pages/Orders/componets/Confirmed/Confirmed";
import LadingPage from "./pages/LadingPage/LadingPage";
import CreateLandingPage from "./pages/CreateLandingPage/CreateLandingPage";
import Summery from "./pages/Summery/Summery";

// export const BACKEND_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3013' : 'https://galiver-backend.onrender.com'
export const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "https://www.xyz.lalonshopbd.com"
    : "https://www.xyz.lalonshopbd.com";

const App = () => {
  //socket connection
  useSocketConnect();

  //auto login
  useAutoLogin();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AdminAuthGuard>
          <DashboardLayout />
        </AdminAuthGuard>
      ),
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "/users",
          element: <Users></Users>,
        },
        {
          path: "/landing-page",
          element: <LadingPage></LadingPage>,
        },
        {
          path: "/create-landing-page",
          element: <CreateLandingPage />,
        },
        {
          path: "/summary",
          element: <Summery></Summery>,
        },
        {
          path: "/products",
          element: <Products></Products>,
          children: [
            {
              path: "/products",
              element: <Navigate to="/products/approved"></Navigate>,
            },
            {
              path: "/products/approved",
              element: <ApprovedProduct></ApprovedProduct>,
            },
            {
              path: "/products/pending",
              element: <PendingProduct></PendingProduct>,
            },
            {
              path: "/products/rejected",
              element: <RejectedProduct></RejectedProduct>,
            },
          ],
        },
        {
          path: "/categories",
          element: <Categories></Categories>,
        },
        {
          path: "/sub-categories",
          element: <SubCategories></SubCategories>,
        },
        {
          path: "/sub-sub-categories",
          element: <SubSubCategories></SubSubCategories>,
        },
        {
          path: "/add-product",
          element: <AddProduct></AddProduct>,
        },
        {
          path: "/courier",
          element: <Courier></Courier>,
        },
        {
          path: "/orders",
          element: <Orders></Orders>,
          children: [
            {
              path: "/orders",
              element: <Navigate to="/orders/pending"></Navigate>,
            },
            {
              path: "/orders/pending",
              element: <Pending></Pending>,
            },
            {
              path: "/orders/accepted",
              element: <Accepted></Accepted>,
            },
            {
              path: "/orders/shipped",
              element: <Shipped></Shipped>,
            },
            {
              path: "/orders/returned",
              element: <Returned></Returned>,
            },
            {
              path: "/orders/canceled",
              element: <Canceled></Canceled>,
            },
            {
              path: "/orders/delivered",
              element: <Confirmed></Confirmed>,
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: (
        <LoginGuard>
          {" "}
          <Login />
        </LoginGuard>
      ),
    },
  ]);

  return (
    <div className="bg-white text-black h-screen overflow-y-auto">
      <RouterProvider router={router}></RouterProvider>

      <Modal />

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
