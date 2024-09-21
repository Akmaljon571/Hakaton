module.exports.ErrorHandle = (err, req, res, next) => {
    console.log(err)
    res.status(err.status).json({ status: err.status, error: err.message, data: null });
}