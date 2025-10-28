/* eslint-disable react/prop-types */
import { useState } from "react";
import toast from "react-hot-toast";

const AddSize = ({ setState, name, onInputChange, getValue }) => {

    const [size, setSize] = useState('')
    const [extraCharge, setExtraCharge] = useState(0)

    const onSubmit = () => {
        if(!size) return toast.error(`Please enter ${name}`)
        const prevValue = getValue(name.toLowerCase(), 'array')
        const newSize = {
            name: size,
            value: size,
            extraCharge: +extraCharge
        }
        onInputChange({
            target: {
                name: name.toLowerCase(),
                value: [...prevValue, newSize]
            }
        })
        setState(false)
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-50 flex justify-center items-center p-2">
            <div className="bg-gray-100  p-4 rounded-md max-w-[450px] w-full">
                <p className="text-xs lg:text-sm text-gray-600 mb-2 mt-2">{name}*</p>
                <input
                    type="text"
                    placeholder={name}
                    onChange={e => setSize(e.target.value)}
                    value={size}
                    name={name}
                    className="w-full p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500" />
                <p className="text-xs lg:text-sm text-gray-600 mb-2 mt-4">Extra charge</p>
                <input
                    type="number"
                    value={extraCharge}
                    onChange={(e) => setExtraCharge(e.target.value)}
                    placeholder="Extra charge BDT"
                    className="w-full p-2 px-2 rounded-md bg-slate-100 outline-none border border-gray-500 max-w-[300px]" />
                <div className="flex gap-3">
                    <button
                        onClick={() => setState(false)}
                        className="text-gray-700 bg-gray-300 border-gray py-1 px-2 rounded mt-4 ">Cancel</button>
                    <button
                        onClick={onSubmit}
                    className="bg-gray-700 text-gray-200 py-1 px-2 rounded mt-4 ">Add</button>
                </div>
            </div>
        </div>
    );
};

export default AddSize;