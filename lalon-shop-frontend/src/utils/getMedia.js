const getMedia = (path) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/media?name=${path}`
}

export default getMedia