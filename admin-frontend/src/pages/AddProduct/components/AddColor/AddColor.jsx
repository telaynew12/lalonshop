/* eslint-disable react/prop-types */

import Select from 'react-select';
import { colorsArray } from '../../constant/constant';
import { useState } from 'react';
import toast from 'react-hot-toast';

const AddColor = ({ setAddNewColor, onInputChange, getValue }) => {
    const [extraCharge, setExtraCharge] = useState(0)
    const [selectedColor, setSelectedColor] = useState(null)
    const inputStyle = (baseStyles) => {
        return {
            ...baseStyles,
            boxShadow: "none",
            border: "1px solid #475569",
            borderRadius: 5,
            backgroundColor: "#F1F5F9",
        }
    }

    const onSubmit = () => {
        if (!selectedColor) return toast.error('Please select a color')
        const prevValue = getValue('color', 'array')
        const newColor = {
            name: selectedColor.label,
            value: selectedColor.color,
            extraCharge: +extraCharge
        }
        onInputChange({
            target: {
                name: 'color',
                value: [...prevValue, newColor]
            }
        })
        setAddNewColor(false)
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center p-2">
            <div className="bg-gray-100  p-4 rounded-md max-w-[450px] w-full">
                <p className="text-xs lg:text-sm text-gray-600 mb-2 mt-2">Select Color*</p>
                <Select
                    className="basic-single flex-1 border-0 relative max-w-[500px]"
                    classNamePrefix="select"
                    placeholder="Color"
                    styles={{ control: (baseStyles) => (inputStyle(baseStyles)) }}
                    onChange={(e) => setSelectedColor(e)}
                    value={selectedColor}
                    getOptionLabel={(option) => (
                        <div className='flex items-center gap-3'>
                            <p
                                style={{
                                    backgroundColor: option.color,
                                    width: "20px",
                                    height: "20px",
                                }}
                                className='shadow-md'
                            ></p>
                            {option.label}</div>
                    )}
                    name="color"
                    options={colorsArray}
                />
                <p className="text-xs lg:text-sm text-gray-600 mb-2 mt-4">Extra charge</p>
                <input
                    type="number"
                    value={extraCharge}
                    onChange={(e) => setExtraCharge(e.target.value)}
                    placeholder="Extra charge (BDT)"
                    className="w-full p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500 max-w-[300px]" />
                <div className="flex gap-3">
                    <button
                        onClick={() => setAddNewColor(false)}
                        className="text-gray-700 bg-gray-300 border-gray py-1 px-2 rounded mt-4 ">Cancel</button>
                    <button
                        onClick={onSubmit}
                        className="bg-gray-700 text-gray-200 py-1 px-2 rounded mt-4 ">Add</button>
                </div>
            </div>
        </div>
    );
};

export default AddColor;