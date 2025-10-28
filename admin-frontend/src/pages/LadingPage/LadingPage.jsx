import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../App";
import { FaLink, FaTrashAlt } from "react-icons/fa";
import getMedia from "../../utilities/getMedia";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LadingPage = () => {
    const [landing, setLanding] = useState([])
    useEffect(() => {
        fetch(`${BACKEND_URL}/api/v1/landing-page`)
            .then(response => response.json())
            .then(data => {
                setLanding(data.data)
            })
    }, []);

    const onDelete = (id) => {
        fetch(`${BACKEND_URL}/api/v1/landing-page/${id}`, {
            method: 'DELETE',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            },
        })
            .then(response => response.json())
            .then(data => {
                setLanding(prev => prev.filter(item => item._id !== id))
            })
    }

    const onCopy = (id) => {
         window.navigator.clipboard.writeText(`https://www.lalonshopbd.com/landing/${id}`)
         toast.success('Link Copied')
    }

    return (
        <div>
            <Link to='/create-landing-page'>
                <button className="btn mb-4 btn-primary">Create New Landing Page</button>
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {landing.map((item, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="p-6">
                            <img className="
                            h-[150px] object-cover w-full" src={getMedia(item.img1)} alt="" />
                            <h2 className="text-xl mt-4 font-bold text-gray-800 mb-4">{item.product.title}</h2>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => onCopy(item.id)}
                                className="flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 btn-sm rounded">
                                    <FaLink className="mr-2" /> Copy Link
                                </button>
                                <button
                                    onClick={() => onDelete(item._id)}
                                    className="flex items-center bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 btn-sm rounded">
                                    <FaTrashAlt className="mr-2" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LadingPage;