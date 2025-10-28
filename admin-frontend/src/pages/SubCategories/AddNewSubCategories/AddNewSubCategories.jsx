/* eslint-disable react/prop-types */
import { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { BACKEND_URL } from "../../../App";
import { json } from "react-router-dom";
import { toggleGlobalLoading } from "../../../components/Modal/components/GlobalLoading/GlobalLoading";
import Select from "react-select";
import useGetCategories from "../../../Hooks/useGetCategories";
import toast from "react-hot-toast";

const AddNewSubCategories = ({ setSubCategories, subCategories, setState }) => {
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [name, setName] = useState('')
    const [warning, setWarning] = useState([])
    const [categories] = useGetCategories()
    const [selectedCategory, setSelectedCategory] = useState(null)

    const warningDetect = (name) => {
        if (warning.includes(name)) {
            return 'border-red-500'
        }
        else {
            return ''
        }
    }


    const options = () => {
        return categories.map(category => {
            return {
                value: category._id,
                label: category.name
            }
        })
    }

    const createCategory = () => {
        setWarning([])
        if (!selectedMedia) {
            setWarning(prev => [...prev, 'img'])
        }
        if (!name || !selectedCategory) {
            setWarning(prev => [...prev, 'name'])
        }
        if (!selectedMedia || !name) return
        const formData = new FormData()

        formData.append('data', JSON.stringify({ name , categoryId: selectedCategory.value}))
        formData.append('image', selectedMedia)
        toggleGlobalLoading('open')

        fetch(`${BACKEND_URL}/api/v1/sub-category`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setSubCategories([data.subCategory, ...subCategories])
                toast.success('Sub Category added successfully')
            })
            .finally(() => {
                toggleGlobalLoading('close')
                setState(false)
            })
    }


    const inputStyle = (baseStyles, state, name) => {
        return {
            ...baseStyles,
            boxShadow: "none",
            border: "2px dashed #475569",
            // borderBottom: state.isFocused ? "2px solid #f97316" : "2px solid #e5e7eb",
            borderRadius: 5,
            backgroundColor: "#F1F5F9",
        }
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-30 p-3 flex items-center justify-center">
            <div className="bg-white p-5 max-w-[550px] rounded w-full">
                <Select
                    className="basic-single flex-1 border-0 relative"
                    classNamePrefix="select"
                    placeholder="Category"
                    styles={{ control: (baseStyles) => (inputStyle(baseStyles)) }}
                    onChange={(e) => setSelectedCategory(e)}
                    value={selectedCategory}
                    name="color"
                    options={options()}
                />

                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Sub Category Name"
                    type="text"
                    className={`w-full bg-slate-100 outline-none p-3 border-dashed focus:border-solid border-2 border-gray-500 rounded-md mt-5 ${warningDetect('name')}`} />

                <label htmlFor="sub-category-image" className={`mt-5 w-full bg-slate-100  border-dashed  border-2  border-gray-500 rounded-md flex items-center justify-center min-h-36 max-h-48 cursor-pointer overflow-hidden ${warningDetect('img')}`}>
                    {!selectedMedia && <div className="flex flex-col items-center opacity-60">
                        <LuImagePlus className="text-4xl " />
                        <p>Add Image</p>
                    </div>}
                    {selectedMedia && <img className="w-24" src={URL.createObjectURL(selectedMedia)} alt="" />}
                </label>

                <div className="mt-7 flex justify-center gap-3">
                    <button
                        onClick={() => setState(false)}
                        className="border-2 border-slate-600 py-1  w-20 rounded-md active:scale-95 duration-75">Cancel</button>
                    <button
                        onClick={createCategory}
                        className="bg-slate-600 border-2 border-slate-600 rounded-md text-white py-1 w-20 active:scale-95 duration-75">Add</button>
                </div>
            </div>

            <input
                onChange={e => {
                    if (e.target.files[0].type.includes('image')) {
                        setSelectedMedia(e.target.files[0])
                    }
                }}
                type="file"
                id="sub-category-image"
                className="h-0 w-0 overflow-hidden" />
        </div>
    );
};

export default AddNewSubCategories;