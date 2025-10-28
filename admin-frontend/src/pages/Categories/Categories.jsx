import { useEffect, useState } from "react";
import AddNewCategories from "./AddNewCategories/AddNewCategories";
import { BACKEND_URL } from "../../App";
import { toggleGlobalLoading } from "../../components/Modal/components/GlobalLoading/GlobalLoading";
import getMedia from "../../utilities/getMedia";
import BottomLoading from "../../components/BottomLoading/BottomLoading";
import useGetCategories from "../../Hooks/useGetCategories";
import toast from "react-hot-toast";
import TableSkelaton from "../../components/TableSkelaton/TableSkelaton";

const Categories = () => {
    const [addNew, setAddNew] = useState(false)

    const [categories, setCategories, loading] = useGetCategories()

    const deleteCategory = (id) => {
        toggleGlobalLoading('open')
        fetch(`${BACKEND_URL}/api/v1/category/delete-category/${id}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
            }
        }
        )
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setCategories(categories.filter(category => category._id !== id))
                    toast.success('Category deleted successfully')
                }
            })
            .finally(() => {
                toggleGlobalLoading('close')
            })

    }

    return (
        <div>
            <div className="flex justify-between items-end">
                <p className="flex items-center text-gray-700 gap-2"> Total Categories: {categories.length}</p>
                <button
                    onClick={() => setAddNew(true)}
                    className="bg-slate-700 text-white py-1 px-3 rounded active:scale-95 duration-75">Add</button>
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
                                    Category
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category, index) =>
                                <tr key={index} className="bg-white border-b  ">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        <img className="w-9 h-9" src={getMedia(category.avatar)} alt="" />
                                    </td>
                                    <td className="px-6 py-4">
                                        {category.name}
                                    </td>
                                    <td
                                        onClick={() => deleteCategory(category._id)}
                                        className="px-6 py-4">
                                        <button className="btn btn-sm text-white bg-red-600 hover:bg-red-700 
                                      ">Delete</button>
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
                {/* <BottomLoading loading={loading} /> */}
                {addNew && <AddNewCategories setCategories={setCategories} categories={categories} setState={setAddNew} />}
            </div>
            {loading && <TableSkelaton />}
        </div>
    );
};

export default Categories;