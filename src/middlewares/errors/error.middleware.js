export default (err, req, res, next) => {
    console.log('err', err)
    res.status(err.statusCode || 500)
        .json({ message: err.message || "server is error", success: false, detail: err.detail })

}
