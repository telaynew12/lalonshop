const getMedia = (path) => {
    // Always use the domain URL for consistency
    return `https://www.lalonshopbd.com/api/v1/media?name=${path}`
}

export default getMedia