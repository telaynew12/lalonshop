import { NavLink, Outlet } from "react-router-dom";

const Orders = () => {
    return (
        <div>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                <NavLink to="/orders/pending" className={({ isActive }) => `${isActive ? 'bg-slate-700 rounded-lg text-white' : 'border-b rounded-none border-slate-700 bg-slate-200'} hover:bg-slate-700 hover:rounded-lg hover:text-white duration-500  text-center  md:p-3 p-2 overflow-hidden  text-xs md:text-base`}>
                    <p>Pending</p>
                </NavLink>
                <NavLink to="/orders/accepted" className={({ isActive }) => `${isActive ? 'bg-slate-700 rounded-lg text-white' : 'border-b rounded-none border-slate-700 bg-slate-200'} hover:bg-slate-700 hover:rounded-lg hover:text-white duration-500  text-center  md:p-3 p-2 overflow-hidden  text-xs md:text-base`}>
                    <p>Accepted</p>
                </NavLink>
                <NavLink to="/orders/shipped" className={({ isActive }) => `${isActive ? 'bg-slate-700 rounded-lg text-white' : 'border-b rounded-none border-slate-700 bg-slate-200'} hover:bg-slate-700 hover:rounded-lg hover:text-white duration-500  text-center  md:p-3 p-2 overflow-hidden  text-xs md:text-base`}>
                    <p>Shipped</p>
                </NavLink>
                <NavLink to="/orders/returned" className={({ isActive }) => `${isActive ? 'bg-slate-700 rounded-lg text-white' : 'border-b rounded-none border-slate-700 bg-slate-200'} hover:bg-slate-700 hover:rounded-lg hover:text-white duration-500  text-center  md:p-3 p-2 overflow-hidden  text-xs md:text-base`}>
                    <p>Returned</p>
                </NavLink>
                <NavLink to="/orders/canceled" className={({ isActive }) => `${isActive ? 'bg-slate-700 rounded-lg text-white' : 'border-b rounded-none border-slate-700 bg-slate-200'} hover:bg-slate-700 hover:rounded-lg hover:text-white duration-500  text-center  md:p-3 p-2 overflow-hidden  text-xs md:text-base`}>
                    <p>Canceled</p>
                </NavLink>
                <NavLink to="/orders/delivered" className={({ isActive }) => `${isActive ? 'bg-slate-700 rounded-lg text-white' : 'border-b rounded-none border-slate-700 bg-slate-200'} hover:bg-slate-700 hover:rounded-lg hover:text-white duration-500  text-center  md:p-3 p-2 overflow-hidden  text-xs md:text-base`}>
                    <p>Delivered</p>
                </NavLink>
            </div>
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Orders;