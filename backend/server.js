const { server } = require("./socket")
const port = process.env.PORT || 2004

server.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
