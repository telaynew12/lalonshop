import { useEffect, useState } from "react";
import getMedia from "../../../../utilities/getMedia";
import { BACKEND_URL } from "../../../../App";
import { toggleGlobalLoading } from "../../../../components/Modal/components/GlobalLoading/GlobalLoading";
import TableSkelaton from "../../../../components/TableSkelaton/TableSkelaton";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ApprovedProduct = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const [loadMore, setLoadMore] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/product/approve`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')} `
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(data)
                setLoading(false)
                if (data.length === 10) {
                    setLoadMore(true)
                }
            })
    }, []);

    const active = (id) => {
        toggleGlobalLoading('open')
        fetch(`${BACKEND_URL}/api/v1/product/active/${id}`, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')} `
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(prev => prev.filter(product => {
                    if (product._id === id) {
                        product.status = 'active'
                    }
                    return product
                }))
                toggleGlobalLoading('close')
            })
    }

    const inActive = (id) => {
        toggleGlobalLoading('open')
        fetch(`${BACKEND_URL}/api/v1/product/inactive/${id}`, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')} `
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(prev => prev.filter(product => {
                    if (product._id === id) {
                        product.status = 'inactive'
                    }
                    return product
                }))
                toggleGlobalLoading('close')
            })
    }

    const onDelete = (id) => {
        toggleGlobalLoading('open')
        fetch(`${BACKEND_URL}/api/v1/product/${id}`, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${localStorage.getItem('admin-token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(prev => prev.filter(product => product._id !== id))
                toggleGlobalLoading('close')
                toast.success('Product Deleted Successfully')
            })
    }

    const loadMoreData = () => {
        fetch(`${BACKEND_URL}/api/v1/product/approve?skip=${data.length}`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')} `
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(prev => [...prev, ...data])
                setLoading(false)
                if (data.length < 10) {
                    setLoadMore(false)
                }
            })
    }

    return (
        <div className="w-full">
            <p className="mt-3">Total: {data?.length}</p>
            <div className="overflow-x-auto">
                <table className="  text-sm text-left  text-gray-500  w-full  bg-white shadow-md">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                img
                            </th>
                            <th scope="col" className="px-6 py-3">
                                name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                discount
                            </th>
                            <th scope="col" className="px-6 py-3">
                                status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                cng status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                edit
                            </th>
                            <th scope="col" className="px-6 py-3">
                                delete
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(product => <tr className="bg-white border-b " key={product?._id}>
                            <td >
                                <img className="w-14 h-14" src={getMedia(product?.media[0]?.name)} alt="" />
                            </td>
                            <td>
                                {product?.title}
                            </td>
                            <td>
                                ৳{product?.price}
                            </td>
                            <td>
                                ৳{product?.discount}
                            </td>
                            <td className={product?.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                                {product?.status}
                            </td>
                            <td>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input type="checkbox"
                                        onChange={() => product?.status === 'active' ? inActive(product?._id) : active(product?._id)}
                                        checked={product?.status === 'active' ? true : false}
                                        className="h-0 w-0 overflow-hidden peer" />
                                    <div className="relative w-11 h-6 bg-gray-200  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </td>
                            <td>
                                <button
                                    onClick={() => navigate(`/add-product?updateId=${product?._id}`)}
                                    className="bg-orange-500 text-white px-2 py-1 text-xs rounded-md ">Edit</button>
                            </td>
                            <td className="">
                                <button
                                    onClick={() => onDelete(product?._id)}
                                    className="bg-red-600 text-white px-2 py-1 text-xs rounded-md ">Delete</button>
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center">
                {loadMore && <button onClick={loadMoreData} className="bg-blue-600 text-white px-2 py-1  rounded-md mt-2">Load More</button>}
            </div>
            {loading && <TableSkelaton />}
        </div>
    );
};

export default ApprovedProduct;