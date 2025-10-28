/* eslint-disable react/prop-types */
import { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { BACKEND_URL } from "../../../App";
import { toggleGlobalLoading } from "../../../components/Modal/components/GlobalLoading/GlobalLoading";
import Select from "react-select";
import useGetSubCategories from "../../../Hooks/useGetSubCategories";
import toast from "react-hot-toast";

const AddNewSubSubCategories = ({ subSubCategories, setSubSubCategories, setState }) => {
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [name, setName] = useState('')
    const [warning, setWarning] = useState([])
    const [subCategories] = useGetSubCategories()
    const [selectedSubCategory, setSelectedSubCategory] = useState(null)

    const warningDetect = (name) => {
        if (warning.includes(name)) {
            return 'border-red-500'
        }
        else {
            return ''
        }
    }


    const options = () => {
        return subCategories.map(category => {
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
        if (!name || !selectedSubCategory) {
            setWarning(prev => [...prev, 'name'])
        }
        if (!selectedMedia || !name) return
        const formData = new FormData()

        formData.append('data', JSON.stringify({ name , subCategoryId: selectedSubCategory.value}))
        formData.append('image', selectedMedia)
        toggleGlobalLoading('open')

        fetch(`${BACKEND_URL}/api/v1/sub-sub-category`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setSubSubCategories([data.subSubCategory, ...subSubCategories])
                toast.success('Sub Sub Category added successfully')
            })
            .finally(() => {
                toggleGlobalLoading('close')
                setState(false)
            })
    }


    const inputStyle = (baseStyles) => {
        return {
            ...baseStyles,
            boxShadow: "none",
            border: "2px dashed #475569",
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
                    placeholder="Sub Category"
                    styles={{ control: (baseStyles) => (inputStyle(baseStyles)) }}
                    onChange={(e) => setSelectedSubCategory(e)}
                    value={selectedSubCategory}
                    name="color"
                    options={options()}
                />

                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Sub Sub Category Name"
                    type="text"
                    className={`w-full bg-slate-100 outline-none p-3 border-dashed focus:border-solid border-2 border-gray-500 rounded-md mt-5 ${warningDetect('name')}`} />

                <label htmlFor="sub-sub-category-image" className={`mt-5 w-full bg-slate-100  border-dashed  border-2  border-gray-500 rounded-md flex items-center justify-center min-h-36 max-h-48 cursor-pointer overflow-hidden ${warningDetect('img')}`}>
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
                id="sub-sub-category-image"
                className="h-0 w-0 overflow-hidden" />
        </div>
    );
};

export default AddNewSubSubCategories;