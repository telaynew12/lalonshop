import { useEffect, useState } from "react"
import { BACKEND_URL } from "../App"
import { toggleGlobalLoading } from "../components/Modal/components/GlobalLoading/GlobalLoading"

const useGetSubCategories = (text) => {
    const [subCategories, setSubCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalSubCategories, setTotalSubCategories] = useState(0)

    const loadData = () => {
        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/sub-category?name=${text || ''}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setSubCategories([...subCategories, ...data.subCategories])
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/sub-category?name=${text || ''}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setSubCategories(data.subCategories)
                setTotalSubCategories(data.totalSubCategories)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [text])

    return [subCategories, setSubCategories, totalSubCategories,setTotalSubCategories, loadData, loading]
}

export default useGetSubCategories