const CustomError = require("../../utils/custom_error")
const repo = require("../../repository")

module.exports.getListBilling = async (req, res) => {
    try {
        const { id } = req.params
        const { date1, date2 } = req.data

        const data = await repo.repositories().billingRepository().findList(id, date1, date2)
        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getListForTable = async (req, res) => {
    try {
        const { id } = req.params
        const { date1, date2 } = req.data

        const data = await repo.repositories().billingRepository().list(id, date1, date2)
        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}
