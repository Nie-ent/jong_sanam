import app from "./app.js";

const PORT = process.env.PORT || 8888

app.listen(PORT, (req, res) => {
    console.log(`server is running on http://localhost:${PORT}`)
})