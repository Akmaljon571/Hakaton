const CustomError = require("../../utils/custom_error")
const repo = require("../../repository")
const { sortvalueObjectsForList, sortvalueObjectsForListArchive } = require("../../utils/sortvalue_bydate")
const { totalCalculation } = require("../../utils/total")

module.exports.getGraphDataList = async (req, res) => {
    try {
        const { id } = req.params
        const query = req.data

        let result = new Map()
        if (query.type === "current") {
            const dataListDocuments = await repo.repositories().electObjectRepository().findOneAndDataList(id, query)
            if (dataListDocuments && ['meter', 'feeder'].includes(dataListDocuments.type) && dataListDocuments.parameters[0]) {
                result = await sortvalueObjectsForList(dataListDocuments.parameters[0], dataListDocuments._id, query)
            }

            const totalData = totalCalculation(Object.fromEntries(result))
            const data = {}

            let count = 0
            for (const key in totalData) {
                if (count == 150) break
                data[key] = totalData[key]
                count++
            }

            res.status(200).json({ status: 200, error: null, data })
        } else {
            const dataListDocuments = await repo.repositories().electObjectRepository().findOneAndDataListArchive(id, query)
            if (dataListDocuments) result = await sortvalueObjectsForListArchive(dataListDocuments.parameters, dataListDocuments._id, query)

            const total = totalCalculation(Object.fromEntries(result))
            const data = Object.keys(total)
                .sort((a, b) => b - a)
                .reduce((obj, key) => {
                    obj[key] = total[key];
                    return obj;
                }, {});
            res.status(200).json({ status: 200, error: null, data })
        }
    } catch (err) {
        console.log(err)
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getGraphDataListCalculation = async (req, res) => {
    try {
        const { id } = req.params
        const args = req.data
        const query = { ...args, type: args.type, limit: args.limit, finishDate: args.date2, startDate: args.date1 }

        let result = new Map()
        if (query.type === "current") {
            res.status(400).json({ status: 400, error: 'current for meter or feeder only', data: null })
        } else {
            const dataListDocuments = await repo.repositories().calculationObjectRepository().findOneAndDataListArchive(id, query)
            if (dataListDocuments) result = await sortvalueObjectsForListArchive(dataListDocuments.parameters, dataListDocuments._id, query)

            const total = totalCalculation(Object.fromEntries(result))
            const data = Object.keys(total)
                .sort((a, b) => b - a)
                .reduce((obj, key) => {
                    obj[key] = total[key];
                    return obj;
                }, {});
            res.status(200).json({ status: 200, error: null, data })
        }
    } catch (err) {
        console.log(err)
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getGraphDataListFull = async (req, res) => {
    try {
        const { id } = req.params
        const query = req.data

        let result = new Map()

        const dataListDocuments = await repo.repositories().electObjectRepository().findOneAndDataListArchiveFull(id, query)
        if (dataListDocuments) result = await sortvalueObjectsForListArchive(dataListDocuments.parameters, dataListDocuments._id, query)

        const location = await repo.repositories().electObjectRepository().findLocation(id)
        const total = totalCalculation(Object.fromEntries(result))
        const data = Object.keys(total)
            .sort((a, b) => b - a)
            .reduce((obj, key) => {
                obj[key] = total[key];
                return obj;
            }, {});

        res.status(200).json({ status: 200, error: null, data, location })
    } catch (err) {
        console.log(err)
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getGraphDataListCalculationFull = async (req, res) => {
    try {
        const { id } = req.params
        const args = req.data
        const query = { ...args, type: args.type, limit: args.limit, finishDate: args.date2, startDate: args.date1 }

        let result = new Map()
        const dataListDocuments = await repo.repositories().calculationObjectRepository().findOneAndDataListArchiveFull(id, query)
        if (dataListDocuments) result = await sortvalueObjectsForListArchive(dataListDocuments.parameters, dataListDocuments._id, query)

        const location = await repo.repositories().electObjectRepository().findLocation(id)
        const total = totalCalculation(Object.fromEntries(result))
        const data = Object.keys(total)
            .sort((a, b) => b - a)
            .reduce((obj, key) => {
                obj[key] = total[key];
                return obj;
            }, {});

        res.status(200).json({ status: 200, error: null, data, location })
    } catch (err) {
        console.log(err)
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}
