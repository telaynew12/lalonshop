import { useEffect } from "react"
import { BACKEND_URL } from "../App"
import io from "socket.io-client"
import { useSelector } from "react-redux"

export let socket = null

const useSocketConnect = () => {
    const user = useSelector(state => state.auth.user)
    useEffect(() => {
        if (!user) {
            if (socket) socket.disconnect()
            socket = null
            return
        }
        const socketConnection = io.connect(BACKEND_URL, {
            query: {
                userID: user?._id || '',
            }
        })
        socket = socketConnection
        return () => {
            socketConnection.disconnect()
        }
    }, [user])
}

export default useSocketConnect