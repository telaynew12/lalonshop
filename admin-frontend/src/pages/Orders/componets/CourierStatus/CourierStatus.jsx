import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../../App";

const CourierStatus = ({ trackId }) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!trackId) {
            setLoading(false)
            return;
        }
        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/courier/track/${trackId}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')} `
            }
        })
            .then(response => response.json())
            .then(data => {
                setStatus(data?.delivery_status)
            })
            .finally(() => {
                setLoading(false)
            })
    }, []);

    if (loading) return <span>Loading...</span>;
    if (!status) return <span></span>;

    return (
        <span className="text-orange-500">{status}</span>
    );
};

export default CourierStatus;