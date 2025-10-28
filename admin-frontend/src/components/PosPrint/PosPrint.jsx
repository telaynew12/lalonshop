/* eslint-disable react/prop-types */
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import logo from '../../assets/logo/WhatsApp_Image_2024-12-11_at_23,31,47_25b2a114-removebg-preview_enhanced.png'
import { IoMdPrint } from 'react-icons/io';
import useFormattedDateTime from '../../Hooks/useFormatDateTime';
import QRCode from 'react-qr-code';

const PosPrint = forwardRef(({ order }, ref) => {
    const contentRef = useRef()
    const { formattedDate, formattedTime } = useFormattedDateTime(new Date().toISOString());

    const { _id, name, phone, subDistrict, district, address, total, orderProduct, status, deliveryCharge, consignment_id } = order

    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        pageStyle: `@media print {
            @page {
              size: 58mm ${contentRef.current?.clientHeight + 20}px;
              margin: 0;
            }
          }`
    });


    useImperativeHandle(ref, () => ({
        print: handlePrint
    }));



    return (
        <div>
            <div
                className='cursor-pointer'
                onClick={handlePrint}>
            </div>
            <div
                className='w-0 h-0 overflow-hidden'>
                <div ref={contentRef} className={` p-2 mx-auto text-black`}>
                    <div className=" text-xs ">
                        <div className="text-center mb-4">
                            <img src={logo} className="mx-auto  w-16" />
                            <p className="text-xs mt-1">{formattedDate} | {formattedTime}</p>
                            <p className="text-xs mt-1 font-bold">#{_id}</p>
                        </div>

                        {/* Customer Details */}
                        <div className="text-xs mb-4">
                            <div className="flex justify-between gap-2">
                                <span className="font-bold">Con. ID:</span>
                                <span>{consignment_id || "N/A"}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <span className="font-bold">Customer:</span>
                                <span>{name}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <span className="font-bold">Phone:</span>
                                <span>{phone}</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                <span className="font-bold ">Address:</span>
                                <span className='text-right'>{`${address}, ${subDistrict}, ${district}`}</span>
                            </div>
                        </div>

                        {/* Products Table */}
                        <table className="w-full text-xs mb-4">
                            <thead>
                                <tr className="border-b border-gray-400">
                                    <th className="text-left">Product</th>
                                    <th className="text-right">Qty</th>
                                    <th className="text-right">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderProduct.map((item, index) => (
                                    <tr key={index} className="border-b border-dashed border-gray-400">
                                        <td>
                                            <p>{item?.product?.title}</p>
                                            {item?.color && (item?.color !== "N/A") && <p>Color : {item?.color}</p>}
                                            {item?.size && (item?.size !== "N/A") && <p>Size : {item?.size}</p>}
                                            {item?.height && (item?.height !== "N/A") && <p>Height : {item?.height}</p>}
                                            {item?.width && (item?.width !== "N/A") && <p>Width : {item?.width}</p>}
                                            {item?.material && (item?.material !== "N/A") && <p>Material : {item?.material}</p>}
                                            {item?.variant && (item?.variant !== "N/A") && <p>Variant : {item?.variant}</p>}
                                        </td>
                                        <td className="text-right">{item.quantity}x</td>
                                        <td className="text-right"> {(item?.quantity * (item?.product.price - item?.product.discount))}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Order Summary */}
                        <div className="text-xs mb-4">
                            <div className="flex justify-between">
                                <span>Vat</span>
                                <span>{(0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Charge</span>
                                <span>{deliveryCharge.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-4">
                            <p className="text-xs">Thank you for shopping with Lalon Shop BD!</p>
                            <p className="text-xs">Visit us: <a href="https://www.lalonshopbd.com" className="font-bold">www.lalonshopbd.com</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PosPrint;