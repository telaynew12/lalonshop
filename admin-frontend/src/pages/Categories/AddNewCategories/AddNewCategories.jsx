import { useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { BACKEND_URL } from "../../../App";
import { json } from "react-router-dom";
import { toggleGlobalLoading } from "../../../components/Modal/components/GlobalLoading/GlobalLoading";
import toast from "react-hot-toast";

const AddNewCategories = ({ setState, setCategories, categories }) => {
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [name, setName] = useState('')
    const [warning, setWarning] = useState([])

    const warningDetect = (name) => {
        if (warning.includes(name)) {
            return 'border-red-500'
        }
        else {
            return ''
        }
    }

    const createCategory = () => {
        setWarning([])
        if (!selectedMedia) {
            setWarning(prev => [...prev, 'img'])
        }
        if (!name) {
            setWarning(prev => [...prev, 'name'])
        }
        if (!selectedMedia || !name) return
        const formData = new FormData()

        formData.append('data', JSON.stringify({ name }))
        formData.append('image', selectedMedia)
        toggleGlobalLoading('open')

        fetch(`${BACKEND_URL}/api/v1/category/create-category`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                setCategories(prev => [data.category, ...categories])
                toast.success('Category added successfully')
            })
            .finally(() => {
                toggleGlobalLoading('close')
                setState(false)
            })
    }

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 z-30 p-3 flex items-center justify-center">
            <div className="bg-white p-5 max-w-[550px] rounded w-full">
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Category Name"
                    type="text"
                    className={`w-full bg-slate-100 outline-none p-3 border-dashed focus:border-solid border-2 border-gray-500 rounded-md ${warningDetect('name')}`} />
                <label htmlFor="category-image" className={`mt-5 w-full bg-slate-100  border-dashed  border-2  border-gray-500 rounded-md flex items-center justify-center min-h-36 max-h-48 cursor-pointer overflow-hidden ${warningDetect('img')}`}>
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
                name="category-image"
                id="category-image"
                className="h-0 w-0 overflow-hidden" />
        </div>
    );
};

export default AddNewCategories;