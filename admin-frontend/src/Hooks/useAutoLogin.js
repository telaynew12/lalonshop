import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toggleGlobalLoading } from "../components/Modal/components/GlobalLoading/GlobalLoading"
import { setLoading, setUser } from "../features/auth/authSlice"
import { BACKEND_URL } from "../App"

const useAutoLogin = () => {
 const { user } = useSelector(state => state.auth)
 const dispatch = useDispatch()

    useEffect(() => {
        const token = localStorage.getItem('admin-token')
        if (!token || user) dispatch(setLoading(false))
        if (token) {
          toggleGlobalLoading('open')
          dispatch(setLoading(true))
          fetch(`${BACKEND_URL}/api/v1/auth/admin-auto-login`, {
            headers: {
              'authorization': `Bearer ${token}`
            }
          })
            .then(res => res.json())
            .then(data => {
              if (data?.success && data?.info?.role === 'admin') {
                dispatch(setUser(data.info))
              }
            })
            .finally(() => {
              toggleGlobalLoading('close')
              dispatch(setLoading(false))
            })
        }
      }, [])
}

export default useAutoLogin;