/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { BACKEND_URL } from '../../../../App';
import { toggleGlobalLoading } from '../../../../components/Modal/components/GlobalLoading/GlobalLoading';
import getMedia from '../../../../utilities/getMedia';
import Swal from 'sweetalert2';

const Edit = ({ order, setOrder }) => {
    const { _id } = order
    const [showModal, setShowModal] = useState(false)
    const [name, setName] = useState(order?.name)
    const [phone, setPhone] = useState(order?.phone)
    const [subDistrict, setSubDistrict] = useState(order?.subDistrict)
    const [district, setDistrict] = useState(order?.district)
    const [address, setAddress] = useState(order?.address)
    const [total, setTotal] = useState(order?.total)
    const [deliveryCharge, setDeliveryCharge] = useState(order?.deliveryCharge)


    const clickSave = (id) => {
        toggleGlobalLoading('open')
        const data = {
            name,
            phone,
            subDistrict,
            district,
            address,
            total: (+order.total - +order.deliveryCharge) + +deliveryCharge,
            deliveryCharge: +deliveryCharge
        }
        fetch(`${BACKEND_URL}/api/v1/order/edit`, {
            method: 'PUT',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                orderId: id,
                data
            })
        })
            .then(response => response.json())
            .then(() => {
                setShowModal(false)
                setOrder(prev => prev.map(order => {
                    if (order._id == id) {
                        return {
                            ...order,
                            ...data
                        }
                    }
                    return order
                }))
            })
            .finally(() => {
                toggleGlobalLoading('close')
            })
    }



    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className="bg-yellow-500 text-white btn rounded-md ">Edit</button>

            {showModal && <div className='bg-black backdrop-blur fixed top-0 left-0 w-full h-full z-50 bg-opacity-30 flex items-center justify-center p-2'>
                <div className='p-4 bg-white max-w-[600px] w-full rounded-lg relative'>

                    <p
                        onClick={() => setShowModal(false)}
                        className="absolute top-3 right-3 cursor-pointer"> &#10006;</p>

                    <h1 className="text-center text-lg font-bold">Edit Order</h1>

                    <p className='mt-3'>Name</p>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='w-full border bg-white border-gray-300 outline-none rounded-md p-2 '
                        type="text" name="" id="" />

                    <p className='mt-3'>Phone</p>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className='w-full border bg-white border-gray-300 outline-none rounded-md p-2 '
                        type="text" name="" id="" />

                    <p className='mt-3'>Sub District</p>
                    <input
                        value={subDistrict}
                        onChange={(e) => setSubDistrict(e.target.value)}
                        className='w-full border bg-white border-gray-300 outline-none rounded-md p-2 '
                        type="text" name="" id="" />

                    <p className='mt-3'>District</p>
                    <input
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className='w-full border bg-white border-gray-300 outline-none rounded-md p-2 '
                        type="text" name="" id="" />

                    <p className='mt-3'>Address</p>
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className='w-full border bg-white border-gray-300 outline-none rounded-md p-2 '
                        type="text" name="" id="" />

                    {/* <p className='mt-3'>Total</p>
                    <input
                        value={total}
                        onChange={(e) => setTotal(e.target.value)}
                        className='w-full border bg-white border-gray-300 outline-none rounded-md p-2 '
                        type="text" name="" id="" /> */}

                    <p className='mt-3'>Delivery Charge</p>
                    <input
                        value={deliveryCharge}
                        onChange={(e) => setDeliveryCharge(e.target.value)}
                        className='w-full border bg-white border-gray-300 outline-none rounded-md p-2 '
                        type="number" name="" id="" />

                    <div className=' flex justify-center mt-4'>
                        <button
                            onClick={() => clickSave(_id)}
                            className="text-white btn btn-sm btn-success">Save changes</button>
                    </div>

                </div>
            </div>}
        </div>
    );
};

export default Edit;