import { useEffect, useState } from "react";
import Select from 'react-select';
import { BACKEND_URL } from "../../App";
import { useNavigate } from "react-router-dom";

const CreateLandingPage = () => {
    const [product, setProduct] = useState('');
    const [headline, setHeadline] = useState('');
    const [title1, setTitle1] = useState('');
    const [title2, setTitle2] = useState('');
    const [description1, setDescription1] = useState('');
    const [description2, setDescription2] = useState('');
    const [img1, setImg1] = useState(null);
    const [img2, setImg2] = useState(null);
    const [img3, setImg3] = useState(null);
    const [option, setOption] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`${BACKEND_URL}/api/v1/product/get-all`)
            .then(response => response.json())
            .then(data => {
                setOption(data.map(item => ({ value: item._id, label: item.title })));
            })
    }, []);

    const handleImageUpload = (e, setImage) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('file', img1)
        formData.append('file', img2)
        formData.append('file', img3)
        formData.append('data', JSON.stringify({
            product,
            headline,
            title1,
            title2,
            description1,
            description2,
        }))
        fetch(`${BACKEND_URL}/api/v1/landing-page/create`, {
            method: 'POST',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                navigate('/landing-page')
            })
    };

    return (
        <div className="">
            <h2 className="text-3xl font-semibold text-center mb-6">Create Landing Page</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product">
                        Product Name
                    </label>
                    <Select
                        className="basic-single flex-1 border-0 relative max-w-[500px]"
                        classNamePrefix="select"
                        placeholder="Product"
                        onChange={(selectedOption) => setProduct(selectedOption.value)}
                        name="color"
                        options={option}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="headline">
                        Headline
                    </label>
                    <input
                        type="text"
                        id="headline"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title1">
                            Title 1
                        </label>
                        <input
                            type="text"
                            id="title1"
                            value={title1}
                            onChange={(e) => setTitle1(e.target.value)}
                            className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title2">
                            Title 2
                        </label>
                        <input
                            type="text"
                            id="title2"
                            value={title2}
                            onChange={(e) => setTitle2(e.target.value)}
                            className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description1">
                            Description 1
                        </label>
                        <textarea
                            id="description1"
                            value={description1}
                            onChange={(e) => setDescription1(e.target.value)}
                            className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description2">
                            Description 2
                        </label>
                        <textarea
                            id="description2"
                            value={description2}
                            onChange={(e) => setDescription2(e.target.value)}
                            className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="img1">
                            Image 1
                        </label>
                        <input
                            type="file"
                            id="img1"
                            onChange={(e) => handleImageUpload(e, setImg1)}
                            className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {img1 && <img src={URL.createObjectURL(img1)} alt="Preview 1" className="mt-4 h-40 w-full object-cover" />}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="img2">
                            Image 2
                        </label>
                        <input
                            type="file"
                            id="img2"
                            onChange={(e) => handleImageUpload(e, setImg2)}
                            className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {img2 && <img src={URL.createObjectURL(img2)} alt="Preview 2" className="mt-4 h-40 w-full object-cover" />}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="img3">
                            Image 3
                        </label>
                        <input
                            type="file"
                            id="img3"
                            onChange={(e) => handleImageUpload(e, setImg3)}
                            className="w-full px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {img3 && <img src={URL.createObjectURL(img3)} alt="Preview 3" className="mt-4 h-40 w-full object-cover" />}
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Save Landing Page
                </button>
            </form>
        </div>
    );
};

export default CreateLandingPage;
