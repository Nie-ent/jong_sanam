export default (req, res) => {
    res.status(404).json({ message: `requst not found ${req.method} ${req.url}` })
}