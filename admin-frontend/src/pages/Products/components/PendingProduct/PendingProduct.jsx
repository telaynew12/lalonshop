import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../../App";
import { toggleGlobalLoading } from "../../../../components/Modal/components/GlobalLoading/GlobalLoading";
import getMedia from "../../../../utilities/getMedia";
import TableSkelaton from "../../../../components/TableSkelaton/TableSkelaton";

const PendingProduct = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [loadMore, setLoadMore] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/product/pending`, {
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

    console.log(data)

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

    const reject = (id) => {
        toggleGlobalLoading('open')
        fetch(`${BACKEND_URL}/api/v1/product/reject/${id}`, {
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

    const loadMoreData = () => {
        fetch(`${BACKEND_URL}/api/v1/product/pending?skip=${data.length}`, {
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
        <div>
            <div className="overflow-x-auto">
                <table className=" mt-3 text-sm text-left  text-gray-500  w-full  bg-white shadow-md">
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
                                status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                details
                            </th>
                            <th scope="col" className="px-6 py-3">
                                approve
                            </th>
                            <th scope="col" className="px-6 py-3">
                                reject
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
                            <td className="text-orange-500">
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
                            <td className="">
                                <button
                                    onClick={() => reject(product?._id)}
                                    className="bg-red-600 text-white px-2 py-1 text-xs rounded-md">Reject</button>
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

export default PendingProduct;