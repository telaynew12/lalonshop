import { useEffect, useState } from "react"
import { BACKEND_URL } from "../App"
import { toggleGlobalLoading } from "../components/Modal/components/GlobalLoading/GlobalLoading"

const useGetSubSubCategories = (text) => {
    const [subSubCategories, setSubSubCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalSubSubCategories, setTotalSubSubCategories] = useState(0)

    const loadData = () => {
        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/sub-sub-category?name=${text || ''}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setSubSubCategories([...subSubCategories, ...data.subSubCategories])
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        setLoading(true)
        fetch(`${BACKEND_URL}/api/v1/sub-sub-category?name=${text || ''}`, {
            headers: {
                'authorization': `Bearer ${localStorage.getItem('admin-token')}`
            }
        })
            .then(res => res.json())
            .then(data => {
                setSubSubCategories(data.subSubCategories)
                setTotalSubSubCategories(data.totalSubSubCategories)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [text])

    return [subSubCategories, setSubSubCategories, totalSubSubCategories, setTotalSubSubCategories,loadData, loading]
}

export default useGetSubSubCategories