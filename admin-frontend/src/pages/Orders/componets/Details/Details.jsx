/* eslint-disable react/prop-types */
import React, { useRef, useState } from 'react';
import { BACKEND_URL } from '../../../../App';
import { toggleGlobalLoading } from '../../../../components/Modal/components/GlobalLoading/GlobalLoading';
import getMedia from '../../../../utilities/getMedia';
import Swal from 'sweetalert2';
import Edit from '../Edit/Edit';
import PosPrint from '../../../../components/PosPrint/PosPrint';
import { useReactToPrint } from 'react-to-print';
import { IoPrintOutline } from 'react-icons/io5';
import moment from 'moment';

const Details = ({ order, setOrder }) => {
    const { _id, name, phone, subDistrict, district, address, total, orderProduct, status, deliveryCharge, consignment_id, email, createdAt } = order
    const [showModal, setShowModal] = useState(false)
    const [note, setNote] = useState('')
    const printRef = useRef()


    const accept = (id) => {
        toggleGlobalLoading('open')
        fetch(`${BACKEND_URL}/api/v1/order/accept`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orderId: id, note })
        })
            .then(response => response.json())
            .then(data => {
                setShowModal(false)
                setOrder(prev => prev.filter(order => order._id != id))
            })
            .finally(() => {
                toggleGlobalLoading('close')
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
                setShowModal(false)
                setOrder(prev => prev.filter(order => order._id != id))
            })
            .finally(() => {
                toggleGlobalLoading('close')
            })
    }

    const clickCancel = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!"
        }).then((result) => {
            if (result.isConfirmed) {
                changeStatus(id, 'canceled')
            }
        });
    }


    return (
        <div>
            <button
                onClick={() => setShowModal(true)}
                className="bg-green-600 text-white px-2 py-1 text-xs rounded-md ">Details</button>

            {showModal && <div className='bg-black fixed top-0 left-0 w-full h-full z-50 bg-opacity-30 flex items-center justify-center p-2'>
                <div className='p-4 bg-white max-w-[600px] max-h-[90%] overflow-y-auto w-full rounded-lg relative'>

                    <p
                        onClick={() => setShowModal(false)}
                        className="absolute top-3 right-3 cursor-pointer"> &#10006;</p>
                    <h3 className='border-b border-gray-300 pb-3 text-center font-bold md:text-lg v'>Order Id: {_id}</h3>
                    <div className='mt-3 border-b border-gray-300 pb-3'>
                        <IoPrintOutline
                            onClick={() => {
                                if (printRef.current) {
                                    printRef.current.print()
                                }
                            }}
                            className='text-2xl text-black mb-2 cursor-pointer' />
                        <p className='text-gray-800 text-lg md:text-xl font-medium'>Consignment id : <span>{consignment_id}</span></p>
                        <p className='text-gray-800 md:text-lg font-medium'>Date : <span>{moment(createdAt).format('D MMMM, YYYY, h:mm a')}</span></p>
                        <p className='text-gray-800 md:text-lg font-medium'>Name : <span>{name}</span></p>
                        <p className='text-gray-800 md:text-lg font-medium'>Phone : <span>{phone}</span></p>
                        <p className='text-gray-800 md:text-lg font-medium'>Email : <span>{email || ''}</span></p>
                        <p className='text-gray-800 md:text-lg font-medium'>Upazila : <span>{subDistrict}</span></p>
                        <p className='text-gray-800 md:text-lg font-medium'>District : <span>{district}</span></p>
                        <p className='text-gray-800 md:text-lg font-medium'>Address : <span>{address}</span></p>
                        <p className='text-gray-800 md:text-lg font-medium'>Delivery Charge : <span>{deliveryCharge}</span></p>
                        <p className='text-gray-800 md:text-lg font-medium'>Total : <span>{total}</span></p>
                    </div>
                    <div className=' md:text-lg'>
                        {orderProduct.map((product, index) => <div
                            className=' mt-4 flex gap-2'
                            key={index}>
                            <p>{index + 1}.</p>
                            <img
                                className='md:w-24 md:h-24  w-20 h-20 rounded object-cover'
                                src={getMedia(product?.product?.media?.name)} alt="" />
                            <div>
                                <p>Product Name: {product?.product.title}</p>
                                <p>Product Price: {product?.product.price - product?.product.discount}</p>
                                <p>Product Quantity: {product?.quantity}x</p>
                                {product?.color && (product?.color !== "N/A") && <p>Color : {product?.color}</p>}
                                {product?.size && (product?.size !== "N/A") && <p>Size : {product?.size}</p>}
                                {product?.height && (product?.height !== "N/A") && <p>Height : {product?.height}</p>}
                                {product?.width && (product?.width !== "N/A") && <p>Width : {product?.width}</p>}
                                {product?.material && (product?.material !== "N/A") && <p>Material : {product?.material}</p>}
                                {product?.variant && (product?.variant !== "N/A") && <p>Variant : {product?.variant}</p>}

                                <p> Total: {(product?.quantity * (product?.product.price - product?.product.discount))}</p>
                            </div>
                        </div>)}
                    </div>

                    {status === 'pending' && <textarea
                        value={note}
                        placeholder='Write a note here...'
                        onChange={e => setNote(e.target.value)}
                        className='w-full h-24 border bg-white border-gray-300 outline-none p-2 mt-3'
                    ></textarea>}

                    <div className='mt-3 flex justify-center items-center gap-4'>
                        {
                            status === 'pending' && <>
                                <Edit order={order} setOrder={setOrder}></Edit>
                                <button
                                    onClick={() => clickCancel(_id)}
                                    className="btn btn-error text-white">Cancel</button>
                                <button
                                    onClick={() => accept(_id)}
                                    className="btn btn-success text-white">Accept</button>
                            </>
                        }
                        {
                            status === 'accepted' && <>
                                <button
                                    onClick={() => clickCancel(_id)}
                                    className="btn btn-error text-white">Cancel</button>
                                <button
                                    onClick={() => {
                                        if (printRef.current) {
                                            printRef.current.print()
                                        }
                                        changeStatus(_id, 'shipped')
                                    }}
                                    className="btn btn-success text-white">Go to ship</button>
                            </>
                        }
                        {
                            status === 'shipped' && <>
                                <button
                                    onClick={() => changeStatus(_id, 'returned')}
                                    className="btn btn-success text-white">Return</button>
                                <button
                                    onClick={() => changeStatus(_id, 'delivered')}
                                    className="btn btn-success text-white">Delivered</button>
                            </>
                        }
                        <PosPrint order={order} ref={printRef} />
                    </div>

                </div>
            </div>}
        </div>
    );
};

export default Details;