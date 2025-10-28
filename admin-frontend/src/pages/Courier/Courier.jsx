import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../App";
import { toggleGlobalLoading } from "../../components/Modal/components/GlobalLoading/GlobalLoading";
import getMedia from "../../utilities/getMedia";

const Courier = () => {
    const [courier, setCourier] = useState([]);
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        toggleGlobalLoading('open');
        fetch(`${BACKEND_URL}/api/v1/courier`, {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                toggleGlobalLoading('close');
                setCourier(data)
            })
            .catch(err => console.log(err))
    }, []);



    const chackedChange = (e, status, id) => {
        if (!status && (!apiKey || !apiSecret)) {
            return setIsOpen(true)
        }
        toggleGlobalLoading('open');
        fetch(`${BACKEND_URL}/api/v1/courier`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            },
            body: JSON.stringify({
                courierId: id,
                api: apiKey,
                secret: apiSecret
            })
        })
            .then(res => res.json())
            .then(() => {
                setIsOpen(false)
                setCourier(prev => prev.map(courier => courier._id == id ? { ...courier, is_active: !status } : courier))
            })
            .catch(err => console.log(err))
            .finally(() => toggleGlobalLoading('close'))
    }


    return (
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {courier.map((courier, index) => <div
                className={`shadow-lg bg-white rounded-lg overflow-hidden hover:shadow-xl transition duration-300 ease-in-out ${courier.is_active ? 'border border-green-500' : 'border '}`}
                key={index}>
                <img
                    className="w-full h-40 lg:h-60  rounded-lg"
                    src={getMedia(courier.image)} alt="" />
                <div className="p-2 flex justify-between items-center mt-3">
                    <p className="font-medium ">{courier.name}</p>
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox"
                            onChange={(e) => chackedChange(e, courier.is_active, courier._id)}
                            checked={courier.is_active}
                            className="h-0 w-0 overflow-hidden peer" />
                        <div className="relative w-11 h-6 bg-gray-200  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
                {isOpen && <div className="p-2 mt-2">
                    <input
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none"
                        onChange={(e) => setApiKey(e.target.value)}
                        value={apiKey}
                        placeholder="Api Key"
                        type="text" name="" id="" />
                    <input
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none mt-2"
                        onChange={(e) => setApiSecret(e.target.value)}
                        value={apiSecret}
                        placeholder=" Secret Key"
                        type="text" name="" id="" />
                </div>}
            </div>)}
        </div>
    );
};

export default Courier;