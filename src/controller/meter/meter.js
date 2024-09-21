const repo = require("../../repository/index")
const CustomError = require("../../utils/custom_error")
const { paramsReadFile, formatParamsList } = require("../../global/file-path")
const { meterListReadFile } = require("../../global/meter-list")

module.exports.createMeter = async (req, res) => {
    try {
        res.status(201).json({ status: 201, error: null, data: "Succesfull saved" })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getListMeter = async (req, res) => {
    try {
        const meterList = await repo.repositories().meterRepository().findAll({})
        res.status(200).json({ status: 200, error: null, data: meterList })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getOneMeter = async (req, res) => {
    try {
        const { id } = req.params
        const meterDocument = await repo.repositories().meterRepository().findOne(id)
        res.status(200).json({ status: 200, error: null, data: meterDocument })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.paramsList = async (req, res) => {
    try {
        const { type } = req.params

        const allParams = Object.values(paramsReadFile(type))
        const formatParams = formatParamsList()
        const data = { indicators: [], indicators_block: [] }

        data.indicators = formatParams.indicators.filter(e => allParams.includes(e.channel_full_id) || e.channel_full_id.startsWith('4.8'))
        const map = data.indicators.map(e => e.channel_full_id.split('.').slice(0, 2).join('.'))
        data.indicators_block = formatParams.indicators_block.filter(e => map.includes(e.channel_full_id) || e.channel_full_id == '4.8')

        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.meterList = async (req, res) => {
    try {
        res.status(200).json({ status: 200, error: null, data: meterListReadFile() })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.portList = async (req, res) => {
    try {
        res.status(200).json({ status: 200, error: null, data: [] })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.updateMeter = async (req, res) => {
    try {
        res.status(200).json({ status: 200, error: null, data: "Succesfull updated" })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.removeMeter = async (req, res) => {
    try {
        res.status(204).json(204)
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.removeFolder = async (req, res) => {
    try {
        res.status(204).json(204)
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}