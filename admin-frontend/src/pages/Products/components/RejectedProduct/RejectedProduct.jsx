import { useEffect, useState } from "react";
import getMedia from "../../../../utilities/getMedia";
import { toggleGlobalLoading } from "../../../../components/Modal/components/GlobalLoading/GlobalLoading";
import { BACKEND_URL } from "../../../../App";
import TableSkelaton from "../../../../components/TableSkelaton/TableSkelaton";

const RejectedProduct = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadMore, setLoadMore] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/product/reject`, {
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

    const loadMoreData = () => {
        fetch(`${BACKEND_URL}/api/v1/product/reject?skip=${data.length}`, {
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

    const approve = (id) => {
        toggleGlobalLoading('open')
        fetch(`${BACKEND_URL}/api/v1/product/approve/${id}`, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')} `
            }
        })
            .then(response => response.json())
            .then(data => {
                setData(prev => prev.filter(product => product._id !== id))
                toggleGlobalLoading('close')
            })
    }
    return (
        <div>
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
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                details
                            </th>
                            <th scope="col" className="px-6 py-3">
                                approve
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
                            <td className="text-red-600">
                                {product?.status}
                            </td>
                            <td>
                                <button className="bg-blue-500 text-white px-2 py-1 text-xs rounded-md ">Details</button>
                            </td>
                            <td className="">
                                <button
                                    onClick={() => approve(product?._id)}
                                    className="bg-green-600 text-white px-2 py-1 text-xs rounded-md ">Approve</button>
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

export default RejectedProduct;