const CustomError = require("../../utils/custom_error")
const { paramsIndex3ForClient } = require("../../global/file-path")
const { eventRepository } = require("../../repository/server_request/event")

module.exports.getTypeEventList = async (req, res) => {
    try {
        const { type } = req.params

        res.status(200).json({ status: 200, error: null, data: Object.keys(paramsIndex3ForClient(type)) })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getLast20 = async (req, res) => {
    try {
        const { id } = req.query
        const data = await eventRepository().findLast20(id)

        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getEvents = async (req, res) => {
    try {
        const { id } = req.params
        const { date1, date2, filter, limit } = req.data
        const pageLimit = limit || 150
        const eventList = JSON.parse(filter)

        const findCriteria = {
            meter_id: id,
            date: {
                $gte: new Date(date1),
                $lt: new Date(date2)
            }
        };

        if (eventList.length > 0) {
            findCriteria.event = { $in: eventList };
        }
        const baza = (await eventRepository().find(findCriteria, pageLimit)).reverse().sort((a, b) => b.date - a.date);
        const arr = {}
        baza.forEach(e => arr[e.date + e.event] ? '' : arr[e.date + e.event] = e)

        const data = Object.values(arr)
        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getListForReport = async (req, res) => {
    try {
        const { id } = req.params
        const { date1, date2, filter } = req.data
        const eventList = JSON.parse(filter)

        const findCriteria = {
            meter_id: id,
            date: {
                $gte: new Date(date1),
                $lt: new Date(date2)
            }
        };

        if (eventList.length > 0) {
            findCriteria.event = { $in: eventList };
        }
        const data = (await eventRepository().findList(findCriteria)).reverse().sort((a, b) => b.date - a.date);

        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}
