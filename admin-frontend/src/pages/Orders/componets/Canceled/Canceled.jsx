import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../../App";
import Details from "../Details/Details";
import TableSkelaton from "../../../../components/TableSkelaton/TableSkelaton";
import CourierStatus from "../CourierStatus/CourierStatus";
import { toggleGlobalLoading } from "../../../../components/Modal/components/GlobalLoading/GlobalLoading";

const Canceled = () => {
    const [orders, setOrder] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadMore, setLoadMore] = useState(false)
    const [phone, setPhone] = useState('')

    useEffect(() => {
        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/order?status=canceled&phone=${phone}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setOrder(data)
                if (data.length === 10) {
                    setLoadMore(true)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [phone])

    const loadMoreData = () => {
        fetch(`${BACKEND_URL}/api/v1/order?status=canceled&skip=${orders.length}&phone=${phone}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setOrder(prev => [...prev, ...data])
                setLoading(false)
                if (data.length < 10) {
                    setLoadMore(false)
                }
            })
    }

    const changeStatus = (id, status) => {
        toggleGlobalLoading('open')
        fetch(`${BACKEND_URL}/api/v1/order`, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId: id, status })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setOrder(prev => prev.filter(order => order._id != id))
            })
            .finally(() => {
                toggleGlobalLoading('close')
            })
    }


    return (
        <div>
          <div className="flex justify-between my-4">
                <h1 className="mt-3">Total: {orders.length}</h1>
                <input
                    onChange={(e) => setPhone(e.target.value)}
                    value={phone}
                    className="p-2  outline-none border-b-2 border-gray-500 bg-white"
                    placeholder="search phone number"
                    type="text" name="" id="" />
            </div>
            <div className="overflow-x-auto mt-2">
                <table className=" text-sm text-left  text-gray-500  w-full  bg-white shadow-md">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                SN.
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Order id
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Courier Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Details
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Recover Order
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => <tr className="bg-white  border-b " key={order?._id}>
                            <td className="py-4">
                                {index + 1}
                            </td>
                            <td >
                                {order?._id}
                            </td>
                            <td>
                                {order?.total}
                            </td>
                            <td>
                            <CourierStatus trackId={order?.tracking_id}></CourierStatus>
                            </td>
                            <td className="">
                                <Details order={order} setOrder={setOrder}></Details>
                            </td>
                            <td className="">
                               <button
                                onClick={() => changeStatus(order?._id, 'pending')}
                               className="btn btn-error text-white px-2 py-1 text-xs rounded-md btn-xs">Recovery order</button>
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

export default Canceled;