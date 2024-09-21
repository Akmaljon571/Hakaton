const CustomError = require("../../utils/custom_error")
const repo = require("../../repository")

module.exports.getDashboardData = async (req, res) => {
    try {
        const { id } = req.params
        const query = req.data

        query.childObjects = query.childObjects && query.childObjects === false ? query.childObjects : true
        query.getParameters = query.getParameters && query.getParameters === false ? query.getParameters : true
        const data = await repo.repositories().electObjectRepository().findOneAndDashboard(id, query)

        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        console.log(err)
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getDashboardDataCalculation = async (req, res) => {
    try {
        const { id } = req.params
        const query = req.data

        query.childObjects = query.childObjects && query.childObjects === false ? query.childObjects : true
        query.getParameters = query.getParameters && query.getParameters === false ? query.getParameters : true
        const data = await repo.repositories().calculationObjectRepository().findOneAndDashboard(id, query)

        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getRealTime = async (req, res) => {
    try {
        const { id } = req.params

        const data = await repo.repositories().electObjectRepository().realTime(id)
        res.status(200).json({ status: 200, error: null, data })
    } catch (error) {
        console.log(error)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getRealTimeReport = async (req, res) => {
    try {
        res.status(400).json({ status: 400, error: 'current for meter or feeder only', data: null })
    } catch (error) {
        console.log(error)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}
