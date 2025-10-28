import  { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BACKEND_URL } from '../../App';
const Products = () => {

    const [total, setTotal] = useState({});

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/v1/product/in-total-product`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setTotal(data);
            })
            .finally(() => {
            })
    }, []);


    return (
        <div>
            <div className="grid grid-cols-3 gap-3">
                <NavLink to="/products/approved" className={({ isActive }) => `${isActive ? 'bg-slate-700 rounded-lg text-white' : 'border-b rounded-none border-slate-700 bg-slate-200'} hover:bg-slate-700 hover:rounded-lg hover:text-white duration-500  text-center  md:p-3 p-2 overflow-hidden  text-xs md:text-base`}>
                    <p>Active</p>
                </NavLink>
                <NavLink to="/products/pending" className={({ isActive }) => `${isActive ? 'bg-slate-700 rounded-lg text-white' : 'border-b rounded-none border-slate-700 bg-slate-200'} hover:bg-slate-700 hover:rounded-lg hover:text-white duration-500  text-center  md:p-3 p-2 overflow-hidden  text-xs md:text-base`}>
                    <p className='justify-center gap-2  relative flex '>Pending
                        {total?.pendingProduct > 0 && <span className='text-xs bg-red-600 rounded-full px-2  text-white flex items-center justify-center'>{total?.pendingProduct}</span>}
                    </p>
                </NavLink>
                <NavLink to="/products/rejected" className={({ isActive }) => `${isActive ? 'bg-slate-700 rounded-lg text-white' : 'border-b rounded-none border-slate-700 bg-slate-200'} hover:bg-slate-700 hover:rounded-lg hover:text-white duration-500  text-center  md:p-3 p-2 overflow-hidden  text-xs md:text-base`}>
                    <p>Rejected</p>
                </NavLink>
            </div>
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Products;