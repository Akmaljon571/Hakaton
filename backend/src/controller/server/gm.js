const repo = require("../../repository")
const CustomError = require("../../utils/custom_error")

module.exports.allGM = async (req, res) => {
    try {
        const allData = await repo.repositories().gmRepository().all()

        res.status(200).json({ status: 200, error: null, data: allData })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.singleGM = async (req, res) => {
    try {
        const singleData = await repo.repositories().gmRepository().single(req.params.id)
        if (!singleData) return res.status(404).json({ status: 404, error: "Meter not found", data: null })

        res.status(200).json({ status: 200, error: null, data: singleData })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}


module.exports.allSchema = async (req, res) => {
    try {
        const allData = await repo.repositories().gmRepository().schemaAll()

        res.status(200).json({ status: 200, error: null, data: allData })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.singleSchema = async (req, res) => {
    try {
        const singleData = await repo.repositories().gmRepository().schemaSignle(req.params.id)

        res.status(200).json({ status: 200, error: null, data: singleData })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}
