/* eslint-disable react/prop-types */
import { useState } from "react";
import AddSize from "../AddSize/AddSize";

const Attributes = ({ name, getValue, removeArrayValue, onInputChange }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <p className="text-xs lg:text-sm text-gray-600 mb-2">{name}</p>
            {getValue(name.toLowerCase(), 'array').length > 0 && <div className="text-xs">
                <table className="table mb-5">
                    <thead>
                        <tr>
                            <th>{name}</th>
                            <th>Extra Charge</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getValue(name.toLowerCase(), 'array').map((c, i) => <tr key={i}>
                            <td>{c.value}</td>
                            <td>{c.extraCharge}</td>
                            <td
                                onClick={() => removeArrayValue(name.toLowerCase(), i)}
                                className="cursor-pointer">x</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>}
            <span
                onClick={() => setIsOpen(prev => !prev)}
                className="bg-gray-600 text-gray-100 py-1 px-3 cursor-pointer text-xs rounded">Add {name} +</span>
            {isOpen && <AddSize
                setState={setIsOpen}
                onInputChange={onInputChange}
                getValue={getValue}
                name={name.toLowerCase()}
            />}
        </div>
    );
};

export default Attributes;