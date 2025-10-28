import { useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import getMedia from "../../utilities/getMedia";
import useGetSubSubCategories from "../../Hooks/useGetSubSubCategories";
import AddNewSubSubCategories from "./AddNewSubSubCategories/AddNewSubSubCategories";
import { toggleGlobalLoading } from "../../components/Modal/components/GlobalLoading/GlobalLoading";
import { BACKEND_URL } from "../../App";
import toast from "react-hot-toast";
import TableSkelaton from "../../components/TableSkelaton/TableSkelaton";

const SubSubCategories = () => {
    const [search, setSearch] = useState('')
    const [addNew, setAddNew] = useState(false)
    const [subSubCategories, setSubSubCategories, totalSubSubCategories, setTotalSubSubCategories, loadData, loading] = useGetSubSubCategories(search)
    const searchInputRef = useRef()


    const deleteCategory = (id) => {
        toggleGlobalLoading('open')
        fetch(`${BACKEND_URL}/api/v1/sub-sub-category/${id}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
            }
        }
        )
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSubSubCategories(subSubCategories.filter(category => category._id !== id))
                    setTotalSubSubCategories(totalSubSubCategories - 1)
                    toast.success('Sub Sub Category deleted successfully')
                }
            })
            .finally(() => {
                toggleGlobalLoading('close')
            })
    }


    const handleSearch = () => {
        setSearch(searchInputRef.current.value)
    }

    return (
        <div>
            <div className="flex justify-between items-end">
                <p className="flex items-center text-gray-700 gap-2 mt-1"> Total Sub Sub Categories: {totalSubSubCategories}</p>
            </div>
            <div className='flex justify-between items-end'>
                <div className="relative w-[180px] md:w-[250px] mt-1">
                    <input
                        ref={searchInputRef}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        type="text"
                        className="outline-none p-1 bg-white rounded-md border-b-2 w-full mt-1"
                        placeholder="Search Sub Sub Categories" />
                    <FaSearch onClick={handleSearch} className="absolute top-2/4 -translate-y-2/4 right-3 cursor-pointer bg-white text-gray-500" />
                </div>
                <button
                    onClick={() => setAddNew(true)}
                    className="bg-slate-700 text-white py-1 px-3 rounded active:scale-95 duration-75 btn-sm">Add</button>
            </div>
            <div className=" mt-3  w-full">
                <div className="overflow-x-auto">
                    <table className=" text-sm text-left  text-gray-500  w-full  bg-white shadow-md">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-200  ">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    #SN.
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    img
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sub Sub Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sub Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {subSubCategories.map((subCategory, index) =>
                                <tr key={index} className="bg-white border-b  ">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        <img className="w-9 h-9" src={getMedia(subCategory.avatar)} alt="" />
                                    </td>
                                    <td className="px-6 py-4">
                                        {subCategory?.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {subCategory?.subCategory?.name}
                                    </td>
                                    <td
                                        onClick={() => deleteCategory(subCategory._id)}
                                        className="px-6 py-4">
                                        <button className="btn btn-sm text-white bg-red-600 hover:bg-red-700 
                                  ">Delete</button>
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
                {loading && <TableSkelaton />}
                {totalSubSubCategories > subSubCategories.length && <div className="flex justify-center mt-4">
                    <button
                        onClick={loadData}
                        className="py-1 px-3 rounded bg-orange-500 text-white hover:bg-orange-700">Load More</button>
                </div>}
                {addNew && <AddNewSubSubCategories setSubSubCategories={setSubSubCategories} subSubCategories={subSubCategories} setState={setAddNew} />}
            </div>
        </div>
    );
};

export default SubSubCategories;