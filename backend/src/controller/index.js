module.exports.notFound = (req, res) => {
    res.status(404).json({ status: 404, error: "Page Not Found", data: null })
}
