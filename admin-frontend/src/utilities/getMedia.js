import { BACKEND_URL } from "../App"

const getMedia = (path) => {
    return `${BACKEND_URL}/api/v1/media?name=${path}`
}

export default getMedia