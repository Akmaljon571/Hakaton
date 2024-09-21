const CustomError = require("../../utils/custom_error")
const repo = require("../../repository")
const { totalCalculation } = require("../../utils/total")
const { sortvalueObjectsForGraphObjectArchive, sortvalueObjectsForGraphObjectCurrent } = require("../../utils/sortvalue_bydate")

module.exports.getGraphsAndObjectDataArchive = async (req, res) => {
    try {
        const { id } = req.params
        const archiveQuery = req.data

        let resultArchive = new Map()
        if (archiveQuery) {
            const newQuery = { startDate: archiveQuery.date1, finishDate: archiveQuery.date2, ...archiveQuery }
            const graphDocumentsArchive = await repo.repositories().electObjectRepository().findOneGraphAndObjectArchive(id, newQuery)
            if (graphDocumentsArchive) {
                resultArchive = await sortvalueObjectsForGraphObjectArchive(graphDocumentsArchive.parameters, graphDocumentsArchive._id, archiveQuery)
            }
        }

        const total = totalCalculation(Object.fromEntries(resultArchive))
        const data = Object.keys(total)
            .sort((a, b) => b - a)
            .reduce((obj, key) => {
                obj[key] = total[key];
                return obj;
            }, {});

        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getGraphsAndObjectCurrent = async (req, res) => {
    try {
        const { id } = req.params
        const currentQuery = req.data

        let resultCurrent = new Map()
        if (currentQuery) {
            const newQuery = { startDate: currentQuery.date1, finishDate: currentQuery.date2, ...currentQuery }
            const graphDocumentsCurrent = await repo.repositories().electObjectRepository().findOneGraphAndObjectCurrent(id, newQuery)

            if (graphDocumentsCurrent && ['meter', 'feeder'].includes(graphDocumentsCurrent.type) && graphDocumentsCurrent.parameters[0]) {
                resultCurrent = await sortvalueObjectsForGraphObjectCurrent(graphDocumentsCurrent.parameters, graphDocumentsCurrent._id)
            }
        }

        const total = totalCalculation(Object.fromEntries(resultCurrent))
        const data = Object.keys(total)
            .sort((a, b) => b - a)
            .reduce((obj, key) => {
                obj[key] = total[key];
                return obj;
            }, {});

        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getGraphsAndObjectDataCalculationArchive = async (req, res) => {
    try {
        const { id } = req.params
        const archiveQuery = req.data

        let resultArchive = new Map()
        if (archiveQuery) {
            const newQuery = { startDate: archiveQuery.date1, finishDate: archiveQuery.date2, ...archiveQuery }
            const graphDocumentsArchive = await repo.repositories().calculationObjectRepository().findOneGraphAndObjectArchive(id, newQuery)
            if (graphDocumentsArchive) {
                resultArchive = await sortvalueObjectsForGraphObjectArchive(graphDocumentsArchive.parameters, graphDocumentsArchive._id, archiveQuery)
            }
        }

        const total = totalCalculation(Object.fromEntries(resultArchive))
        const data = Object.keys(total)
            .sort((a, b) => b - a)
            .reduce((obj, key) => {
                obj[key] = total[key];
                return obj;
            }, {});

        res.status(200).json({ status: 200, error: null, data })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getGraphsAndObjectDataCalculationCurrent = async (req, res) => {
    try {
        res.status(400).json({ status: 400, error: 'current for meter or feeder only', data: null })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}
