import { useRef, useState } from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import useGetAllUsers from "../../Hooks/useGetAllUsers";
import moment from "moment";
import BottomLoading from "../../components/BottomLoading/BottomLoading";
import TableSkelaton from "../../components/TableSkelaton/TableSkelaton";

const Users = () => {
    const [search, setSearch] = useState('')
    const searchInputRef = useRef()

    const [users, setUsers, loading, totalUsers, setTotalUsers, loadMore] = useGetAllUsers(search)

    const handleSearch = () => {
        setSearch(searchInputRef.current.value)
    }


    return (
        <div>
            <div className="flex justify-between items-end">
                <div>
                    <p className="flex items-center text-gray-700 gap-1"><FaUser className="text-xl" /> Total Users: {totalUsers}</p>
                </div>
                <div className="relative">
                    <input
                        ref={searchInputRef}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        type="text"
                        className="outline-none p-2 bg-white rounded-md border-b-2 w-[180px] md:w-[250px]"
                        placeholder="Search User" />
                    <FaSearch onClick={handleSearch} className="absolute top-2/4 -translate-y-2/4 right-3 cursor-pointer text-gray-500" />
                </div>
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
                                    Full Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    User Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Join Date
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) =>
                                <tr key={index} className="bg-white border-b  ">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {index + 1}
                                    </th>
                                    <td className="px-6 py-4">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.userName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {moment(user.createdAt).format("Do MMM YY")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={user.isActive ? 'text-green-600' : 'text-red-500'}>{user.isActive ? 'Active' : 'Inactive'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={user.role === 'admin' ? 'text-orange-500' : ''}>{user.role}</p>
                                    </td>
                                </tr>)}
                        </tbody>
                    </table>
                </div>
                {loading && <TableSkelaton/>}
                {totalUsers > users.length && <div className="flex justify-center mt-4">
                    <button
                        onClick={loadMore}
                        className="py-1 px-3 rounded bg-orange-500 text-white hover:bg-orange-700">Load More</button>
                </div>}
                {/* <BottomLoading loading={loading} /> */}
            </div>
        </div>
    );
};

export default Users;