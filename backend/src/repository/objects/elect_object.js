const mongoose = require("mongoose")
const CustomError = require("../../utils/custom_error")
const repo = require("..")
const { electObjectModel, folderModel, currentModel, lastCurrentModel, archiveModel, calculationObjectModel } = require("../../models")
const { energyarchive, realTimeVariable, realTimeVariableTarif } = require("../../global/variable")
const { multiplyTcAndTT } = require("../../utils/sortvalue_bydate")
const { existListFN, time3Format } = require("../../utils/utils_fn")
const { formula2 } = require("../../utils/formula")
const { uniqueShortName } = require("../../utils/unique_short-names")
const { electModel } = require("../../global/enum")

module.exports.electObjectRepository = () => {
    return Object.freeze({
        insert,
        findById,
        findMeter,
        findParentMeter,
        findWithQuery,
        findAll,
        findOne,
        findOneVectorDiagram,
        findOneGraphAndObjectArchive,
        findOneGraphAndObjectCurrent,
        findOneAndDataList,
        findOneAndDataListArchive,
        findOneAndDataListArchiveFull,
        findOneAndDashboard,
        findLocation,
        firstTemplateReport,
        secondTemplateReport,
        thirdTemplateReport,
        fourthTemplateReport,
        listUse,
        update,
        insertParentParams,
        countDocuments,
        realTime,
        factory,
        remove,
        removeWithMeter,
    })

    async function factory() {
        try {
            return await electObjectModel.find({ type: 'factory' })
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findWithQuery(args) {
        try {
            const elect = JSON.parse(JSON.stringify(await electObjectModel.find(args)))
            const calculation = JSON.parse(JSON.stringify(await calculationObjectModel.find(args)))

            return [...elect, ...calculation]
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function countDocuments(args) {
        try {
            return await electObjectModel.countDocuments(args)
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function listUse() {
        try {
            const list = await electObjectModel.find({ meter_id: { $exists: true } })
            const meters = await folderModel.find()
            const result = []
            let ids = []
            for (let i = 0; i < meters.length; i++) {
                const find = list.map(e => String(e.meter_id))
                if (!find.includes(String(meters[i].meter)) && !ids.includes(meters[i].meter) && meters[i].meter) {
                    result.push({ id: String(meters[i].meter), name: meters[i].name })
                    ids.push(meters[i].meter)
                }
            }
            return result
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function realTime(id) {
        const realTimeData = { date: null, "AP": null, "RP": null, "FP": null, "CP": null }

        const find = await electObjectModel.findOne({ _id: id })
        if (!find || !['meter', 'feeder'].includes(find.type)) return realTimeData

        for (const params of find.parameters) {
            const parameter_values = await lastCurrentModel.findOne({ meter: params.meter })

            if (parameter_values) {
                const dataValues = parameter_values.parameters

                const values = {}
                const sign = {}
                for (const value of dataValues) {
                    const shortName = value.param_short_name
                    if (params.params_feeder[shortName] != undefined || params.params_meter[shortName] != undefined)
                        values[shortName] = value.value

                    if (Object.values(realTimeVariableTarif).includes(shortName))
                        for (const keyTarif in realTimeVariableTarif) {
                            sign[keyTarif] = params.params_feeder[shortName] || params.params_meter[shortName]
                        }
                }

                const obj = { ...formula2(values) }
                for (const key in obj) {
                    if (realTimeVariable.includes(key) && (Number(obj[key]) || Number(obj[key]) == 0)) {
                        obj[key] = multiplyTcAndTT(params.multiply, { value: obj[key] }, key)
                        realTimeData.date = dataValues[0].date

                        const value = obj[key].value
                        if (realTimeVariable[0] == key)
                            if (realTimeData.AP != null) realTimeData.AP += value
                            else realTimeData.AP = value
                        else if (realTimeVariable[1] == key)
                            if (realTimeData.RP != null) realTimeData.RP += value
                            else realTimeData.RP = value
                        else if (realTimeVariable[2] == key)
                            if (realTimeData.FP != null) realTimeData.FP += value
                            else realTimeData.FP = value
                        else if (realTimeVariable[3] == key)
                            if (realTimeData.CP != null) realTimeData.CP += value
                            else realTimeData.CP = value
                    }
                }
            }
        }

        return realTimeData
    }

    async function insert(args) {
        try {
            const objectDocuments = await electObjectModel.create(args)
            return objectDocuments
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function update(_id, query) {
        try {
            const objectDocuments = await electObjectModel.updateOne({ _id }, { $set: query })
            return objectDocuments
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findById(id) {
        try {
            const objectDocuments = await electObjectModel.findById(id)
            return objectDocuments
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findParentMeter(id) {
        try {
            const getMeter = await electObjectModel.findOne({ parent_object: id })
            return getMeter
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function insertParentParams(_id, parameters) {
        try {
            await electObjectModel.updateOne({ _id }, { $set: { parameters } })
            return 'ok'
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findAndRemoveParameter(id) {
        const list = [id]

        async function listUpdate(fromId) {
            const fromList = await findWithQuery({ "parameters.from": fromId })
            for (const elect of fromList) {
                elect.parameters = elect.parameters.filter(e => String(e.from) != String(fromId))
                if (electModel.includes(elect.type)) {
                    await update(elect._id, { parameters: elect.parameters })
                } else {
                    await repo.repositories().calculationObjectRepository().update(elect._id, { parameters: elect.parameters })
                }
                if (!list.includes(fromId)) await listUpdate(elect._id)
            }
        }
        await listUpdate(id)
    }

    async function remove(id) {
        try {
            await findAndRemoveParameter(id)

            await electObjectModel.deleteOne({ _id: id })
            const find = await electObjectModel.find({ parent_object: id })
            for (const value of find) {
                remove(value._id)
            }
            return 'ok'
        } catch (error) {
            throw new CustomError(404, "ElectObject Not Found")
        }
    }

    async function removeWithMeter(id) {
        await findAndRemoveParameter(id)
        await electObjectModel.deleteOne({ meter_id: id })
    }

    async function findLocation(id) {
        try {
            const location = []
            const findTop = async (parent_object) => {
                const find = await electObjectModel.find({ _id: parent_object })
                for (const value of find) {
                    location.push(value.name)
                    await findTop(value.parent_object)
                }
            }

            await findTop(id)
            return location
        } catch (error) {
            throw new CustomError(error.status, error.message);
        }
    }

    async function findMeter(id) {
        try {
            const objectDocuments = await electObjectModel.findOne({ meter_id: id })
            return objectDocuments
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findAll(args) {
        try {
            const pipArray = [
                {
                    $lookup: {
                        from: "elect_objects",
                        localField: "_id",
                        foreignField: "parent_object",
                        pipeline: [
                            {
                                $lookup: {
                                    from: "elect_objects",
                                    localField: "_id",
                                    foreignField: "parent_object",
                                    as: "child_objects"
                                }
                            }
                        ],
                        as: "child_objects"
                    }
                },
                {
                    $unwind: {
                        path: "$parameters",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "parameters.parameter_id",
                        foreignField: "_id",
                        as: "parameters.param_details"
                    }
                },
                {
                    "$group": {
                        "_id": "$_id",
                        "parameters": {
                            "$push": "$parameters"
                        },
                        "name": { $first: "$name" },
                        "type": { $first: "$type" },
                        "createdAt": { $first: "$createdAt" },
                        "updatedAt": { $first: "$updatedAt" },
                        "child_objects": { $first: "$child_objects" },
                    }
                },
                {
                    $sort: {
                        createdAt: 1
                    }
                }
            ]
            if (args.type && args.type !== "") {
                pipArray.unshift({
                    $match: {
                        type: args.type
                    }
                })
            }
            if (args.list && args.list.length !== 0) {
                pipArray.unshift({
                    $match: {
                        $expr: {
                            $in: ["$_id", args.list.map(id => new mongoose.Types.ObjectId(id))]
                        }
                    }
                });
            }
            const electObject = await electObjectModel.aggregate(pipArray)
            if (!electObject[0]) return []

            for (const param of electObject[0].parameters) {
                if (param.params_feeder) {
                    for (const key in param.params_feeder) {
                        if (!energyarchive.includes(key)) {
                            delete param.params_feeder[key]
                        }
                    }
                }
                if (param.params_meter) {
                    for (const key in param.params_meter) {
                        if (!energyarchive.includes(key)) {
                            delete param.params_meter[key]
                        }
                    }
                }
            }
            return electObject
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findOne(id, query) {
        try {
            const pipArray = [
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                {
                    $lookup: {
                        from: "elect_objects",
                        localField: "_id",
                        foreignField: "parent_object",
                        pipeline: [{
                            $lookup: {
                                from: "elect_objects",
                                localField: "_id",
                                foreignField: "parent_object",
                                as: "child_objects"
                            }
                        }],
                        as: "child_objects"
                    }
                }
            ]

            if (query.type === 'feeder') {
                pipArray.push(
                    {
                        $lookup: {
                            from: "elect_objects",
                            localField: "_id",
                            foreignField: "parent_object",
                            pipeline: [
                                {
                                    $lookup: {
                                        from: "meters",
                                        localField: "meter_id",
                                        foreignField: "_id",
                                        as: "meter"
                                    }
                                }
                            ],
                            as: "elect_meter"
                        }
                    },
                    {
                        $unwind: {
                            path: "$elect_meter",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: "$elect_meter.meter",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        "$group": {
                            "_id": "$_id",
                            "name": { $first: "$name" },
                            "parameters": { $first: "$parameters" },
                            "vt": { $first: "$elect_meter.vt" },
                            "ct": { $first: "$elect_meter.ct" },
                            "type": { $first: "$type" },
                            "meter_type": { $first: "$elect_meter.meter.meter_type" },
                            "meter_id": { $first: "$elect_meter.meter._id" },
                            "number_meter": { $first: "$elect_meter.meter.number_meter" },
                            "createdAt": { $first: "$createdAt" },
                            "parent_object": { $first: "$parent_object" },
                            "updatedAt": { $first: "$updatedAt" },
                            "child_objects": { $first: "$child_objects" },
                        }
                    }
                )
            } else if (query.type === 'meter') {
                pipArray.push(
                    {
                        $lookup: {
                            from: "meters",
                            localField: "meter_id",
                            foreignField: "_id",
                            as: "meter"
                        }
                    },
                    {
                        $unwind: {
                            path: "$meter",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        "$group": {
                            "_id": "$_id",
                            "name": { $first: "$name" },
                            "parameters": { $first: "$parameters" },
                            "type": { $first: "$type" },
                            "meter_id": { $first: "$meter._id" },
                            "meter_type": { $first: "$meter.meter_type" },
                            "number_meter": { $first: "$meter.number_meter" },
                            "createdAt": { $first: "$createdAt" },
                            "parent_object": { $first: "$parent_object" },
                            "updatedAt": { $first: "$updatedAt" },
                            "child_objects": { $first: "$child_objects" },
                            "vt": { $first: "$vt" },
                            "ct": { $first: "$ct" }
                        }
                    }
                )
            } else {
                pipArray.push(
                    {
                        "$group": {
                            "_id": "$_id",
                            "name": { $first: "$name" },
                            "parameters": { $first: "$parameters" },
                            "type": { $first: "$type" },
                            "createdAt": { $first: "$createdAt" },
                            "parent_object": { $first: "$parent_object" },
                            "updatedAt": { $first: "$updatedAt" },
                            "child_objects": { $first: "$child_objects" },
                        }
                    }
                )
            }
            const electObjectDocument = await electObjectModel.aggregate(pipArray)
            if (!electObjectDocument[0]) return

            if (!["meter", "feeder"].includes(electObjectDocument[0].type)) {
                for (const param of electObjectDocument[0].parameters) {
                    if (param.params_feeder) {
                        for (const key in param.params_feeder) {
                            if (!energyarchive.includes(key)) {
                                delete param.params_feeder[key]
                            }
                        }
                    }
                    if (param.params_meter) {
                        for (const key in param.params_meter) {
                            if (!energyarchive.includes(key)) {
                                delete param.params_meter[key]
                            }
                        }
                    }
                }
            }

            for (const child of electObjectDocument[0].child_objects) {
                if (!['meter', 'feeder'].includes(query.type)) {
                    child.meter_id = child.child_objects[0] ? child.child_objects[0].meter_id : null
                } else if (query.type == 'feeder') {
                    child.meter_id = electObjectDocument[0].meter_id
                }
            }

            return electObjectDocument[0]
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findOneVectorDiagram(id, query) {
        try {
            const find = await electObjectModel.findOne({ _id: id })
            if (!find) return

            if (query && query.paramDate) {
                query.date1 = new Date(query.paramDate)
                query.date1.setHours(0, 0, 0, 0)
                query.date2 = new Date(query.date1)
                query.date2.setDate(query.date1.getDate() + 1)
                if (!query.finish) query.finish = query.date2
            }

            const result = { multiply: [1], parameters: [], type: find.type }
            const limit = Number(query.limit) || 150
            let values = []

            if (find.type == 'meter') {
                const parent = await electObjectModel.findOne({ _id: find.parent_object })
                result.multiply = parent.parameters[0].multiply
            }

            for (const params of find.parameters) {
                if (find.type != 'meter') result.multiply = params.multiply

                const findCurrent = async (date) => {
                    const parameter_values = await currentModel.findOne({ meter_id: params.meter, day: { $lt: new Date(date), $gte: new Date(query.date1) } }, null, { sort: { day: -1 } })
                    if (parameter_values) {
                        parameter_values.data = parameter_values.data.filter(e => e.date - new Date(date) < 0)

                        values.unshift(...parameter_values.data)
                        if (values.length < limit) {
                            await findCurrent(parameter_values.day)
                        } else {
                            values = values.slice(-limit)
                            result.parameters.push({ ...params._doc, parameter_values: values })
                        }
                    } else {
                        const currentDate = time3Format(date)
                        if (currentDate - query.date1 > 0) {
                            await findCurrent(currentDate)
                        } else if (values.length) {
                            result.parameters.push({ ...params._doc, parameter_values: values })
                        }
                    }
                }
                await findCurrent(new Date(query.finish))
            }

            if (result.parameters[0]) result.finish = result.parameters[0].parameter_values[0].date
            else result.finish = query.finish

            return result
        } catch (err) {
            console.log(err)
            throw new CustomError(err.status, err.message)
        }
    }

    async function findOneGraphAndObjectArchive(id, query) {
        try {
            const existList = existListFN(query, energyarchive)
            const limit = Number(query.limit) || 150

            const electObjectPipelines = [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $unwind: {
                        path: "$parameters",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "parameters.meter",
                        foreignField: "meter",
                        as: "parameters.param_details"
                    }
                },
                {
                    $unwind: {
                        path: "$parameters.param_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        parameters: { $push: "$parameters" },
                        name: { $first: "$name" },
                        type: { $first: "$type" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        child_objects: { $first: "$child_objects" }
                    }
                },
                {
                    $project: {
                        parameters: {
                            $filter: {
                                input: "$parameters",
                                as: "param",
                                cond: {
                                    $in: [
                                        "$$param.param_details.param_short_name",
                                        existList
                                    ]
                                }
                            }
                        },
                        name: 1,
                        type: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        child_objects: 1
                    }
                },
            ];

            const electObjectDocument = await electObjectModel.aggregate(electObjectPipelines, { maxTimeMS: 50000 })
            if (!electObjectDocument[0]) return undefined

            const result = { ...electObjectDocument[0], parameters: [] }
            for (const value of electObjectDocument[0].parameters) {
                const obj = value.param_details
                const archives = await archiveModel.find({
                    parameter: obj._id,
                    date: {
                        $lte: new Date(query.date2),
                        $gte: new Date(query.date1)
                    }
                })
                    .limit(limit)
                    .sort({ date: -1 })

                result.parameters.push({ ...value, parameter_values: archives })
            }
            return result
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findOneGraphAndObjectCurrent(id, query) {
        try {
            const elect = await electObjectModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $unwind: {
                        path: "$parameters",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "parameters.meter",
                        foreignField: "meter",
                        as: "parameters.param_details"
                    }
                },
                {
                    $unwind: {
                        path: "$parameters.param_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        parameters: { $push: "$parameters" },
                        name: { $first: "$name" },
                        type: { $first: "$type" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        child_objects: { $first: "$child_objects" }
                    }
                }])
            const find = elect[0]
            if (!find) return

            let values = []
            const limit = Number(query.limit) || 150
            const result = { type: find.type, parameters: [], _id: find._id }

            for (const params of find.parameters) {
                const findCurrent = async (date) => {
                    const parameter_values = await currentModel.findOne({ meter_id: params.meter, day: { $lt: new Date(date), $gte: new Date(query.date1) } }, null, { sort: { day: -1 } })
                    if (parameter_values) {
                        parameter_values.data = parameter_values.data.filter(e => e.date - new Date(date) < 0)

                        values.unshift(...parameter_values.data)
                        if (values.length < limit) {
                            await findCurrent(parameter_values.day)
                        } else {
                            values = values.slice(-limit)
                            result.parameters.push({ ...params, parameter_values: values })
                        }
                    } else {
                        const currentDate = time3Format(date)
                        if (currentDate - query.date1 > 0) {
                            await findCurrent(currentDate)
                        } else if (values.length) {
                            result.parameters.push({ ...params, parameter_values: values })
                        }
                    }
                }
                await findCurrent(query.date2)
            }

            return result
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findOneAndDataListArchive(id, query) {
        try {
            const existList = existListFN(query, energyarchive)
            const limit = Number(query.limit) || 150

            const electObjectPipelines = [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $unwind: {
                        path: "$parameters",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "parameters.meter",
                        foreignField: "meter",
                        as: "parameters.param_details"
                    }
                },
                {
                    $unwind: {
                        path: "$parameters.param_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        parameters: { $push: "$parameters" },
                        name: { $first: "$name" },
                        type: { $first: "$type" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        child_objects: { $first: "$child_objects" }
                    }
                },
                {
                    $project: {
                        parameters: {
                            $filter: {
                                input: "$parameters",
                                as: "param",
                                cond: {
                                    $in: [
                                        "$$param.param_details.param_short_name",
                                        existList
                                    ]
                                }
                            }
                        },
                        name: 1,
                        type: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        child_objects: 1
                    }
                },
            ];

            const electObjectDocument = await electObjectModel.aggregate(electObjectPipelines, { maxTimeMS: 50000 })
            if (!electObjectDocument[0]) return undefined

            const result = { ...electObjectDocument[0], parameters: [] }
            for (const value of electObjectDocument[0].parameters) {
                const obj = value.param_details
                const archives = await archiveModel.find({
                    parameter: obj._id,
                    date: {
                        $lte: new Date(query.date2),
                        $gte: new Date(query.date1)
                    }
                })
                    .limit(limit)
                    .sort({ date: -1 })

                result.parameters.push({ ...value, parameter_values: archives })
            }
            return result
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findOneAndDataListArchiveFull(id, query) {
        try {
            const existList = existListFN(query, energyarchive)

            const electObjectPipelines = [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $unwind: {
                        path: "$parameters",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "parameters.meter",
                        foreignField: "meter",
                        as: "parameters.param_details"
                    }
                },
                {
                    $unwind: {
                        path: "$parameters.param_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        parameters: { $push: "$parameters" },
                        name: { $first: "$name" },
                        type: { $first: "$type" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        child_objects: { $first: "$child_objects" }
                    }
                },
                {
                    $project: {
                        parameters: {
                            $filter: {
                                input: "$parameters",
                                as: "param",
                                cond: {
                                    $in: [
                                        "$$param.param_details.param_short_name",
                                        existList
                                    ]
                                }
                            }
                        },
                        name: 1,
                        type: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        child_objects: 1
                    }
                },
            ];

            const electObjectDocument = await electObjectModel.aggregate(electObjectPipelines, { maxTimeMS: 50000 })
            if (!electObjectDocument[0]) return undefined

            const result = { ...electObjectDocument[0], parameters: [] }
            for (const value of electObjectDocument[0].parameters) {
                const obj = value.param_details
                const archives = await archiveModel.find({
                    parameter: obj._id,
                    date: {
                        $lte: new Date(query.date2),
                        $gte: new Date(query.date1)
                    }
                }).sort({ date: -1 })

                result.parameters.push({ ...value, parameter_values: archives })
            }
            return result
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findOneAndDataList(id, query) {
        try {
            const find = await electObjectModel.findOne({ _id: id })
            if (!find) return

            let values = []
            const limit = Number(query.limit) || 150
            const result = { type: find.type, parameters: [], _id: find._id }

            for (const params of find.parameters) {
                const findCurrent = async (date) => {
                    const parameter_values = await currentModel.findOne({ meter_id: params.meter, day: { $lt: new Date(date), $gte: new Date(query.date1) } }, null, { sort: { day: -1 } })
                    if (parameter_values) {
                        parameter_values.data = parameter_values.data.filter(e => e.date - new Date(date) < 0)

                        values.unshift(...parameter_values.data)
                        if (values.length < limit) {
                            await findCurrent(parameter_values.day)
                        } else {
                            values = values.slice(-limit)
                            result.parameters.push({ ...params._doc, parameter_values: values })
                        }
                    } else {
                        const currentDate = time3Format(date)
                        if (currentDate - query.date1 > 0) {
                            await findCurrent(currentDate)
                        } else if (values.length) {
                            result.parameters.push({ ...params._doc, parameter_values: values })
                        }
                    }
                }
                await findCurrent(query.date2)
            }

            return result
        } catch (err) {
            console.log(err)
            throw new CustomError(err.status, err.message)
        }
    }

    async function findOneAndDashboard(id, query) {
        try {
            const existList = existListFN(query, energyarchive)
            const year = query.year ? query.year : new Date().getFullYear()
            const month = query.month ? (+query.month) - 1 : new Date().getMonth()
            const fix = 10
            const multyply = 1000000000

            const electObjectPipelines = [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $unwind: {
                        path: "$parameters",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "parameters.meter",
                        foreignField: "meter",
                        as: "parameters.param_details"
                    }
                },
                {
                    $unwind: {
                        path: "$parameters.param_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    "$group": {
                        "_id": "$_id",
                        "parameters": {
                            "$push": "$parameters"
                        },
                        "name": { $first: "$name" },
                        "type": { $first: "$type" },
                        "createdAt": { $first: "$createdAt" },
                        "updatedAt": { $first: "$updatedAt" },
                        "child_objects": { $first: "$child_objects" },
                    }
                },
                {
                    $project: {
                        parameters: {
                            $filter: {
                                input: "$parameters",
                                as: "param",
                                cond: {
                                    $in: [
                                        "$$param.param_details.param_short_name",
                                        existList
                                    ]
                                }
                            }
                        },
                        name: 1,
                        type: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        child_objects: 1
                    }
                }
            ]

            const electObjectDocument = await electObjectModel.aggregate(electObjectPipelines, { maxTimeMS: 50000 })
            if (!electObjectDocument[0]) return

            const yearResultMap = new Map()
            const monthResultMap = new Map()
            const parameters = []
            for (const param of electObjectDocument[0].parameters) {
                const shortName = param.param_details.param_short_name
                if ("params_feeder" in param && param.params_feeder[shortName]) {
                    parameters.push(param)
                } else if ("params_meter" in param && param.params_meter[shortName]) {
                    parameters.push(param)
                }
            }

            for (const value of parameters) {
                const list = await archiveModel.find({ parameter: value.param_details._id, $expr: { $eq: [{ $year: "$date" }, year] } });

                for (const archive of list) {
                    if (String(value.param_details._id) == String(archive.parameter)) {
                        const date = new Date(archive.date)
                        const yearDate = date.getFullYear() + '' + date.getMonth()
                        const shortName = value.param_details.param_short_name

                        if (value.params_feeder && value.params_feeder[shortName] != undefined) {
                            value.multiply.forEach(element => { archive.value *= element })
                        }

                        let sign
                        if (value.params_feeder && value.params_feeder[shortName] != undefined) {
                            sign = value.params_feeder[shortName]
                        } else if (value.params_meter && value.params_meter[shortName] != undefined) {
                            sign = value.params_meter[shortName]
                        }

                        if (yearResultMap.has(yearDate) && date.getMonth() != month) {
                            const find = yearResultMap.get(yearDate)
                            if (find[shortName]) {
                                find[shortName] += sign || sign == undefined ? archive.value : -archive.value
                                yearResultMap.set(yearDate, find)
                            } else {
                                archive.value = sign || sign == undefined ? archive.value : -archive.value
                                yearResultMap.set(yearDate, { ...find, [shortName]: archive.value })
                            }
                        } else {
                            archive.value = sign || sign == undefined ? archive.value : -archive.value
                            yearResultMap.set(yearDate, { date: { month: date.getMonth() + 1, year: date.getFullYear() }, [shortName]: archive.value })
                        }

                        if (date.getHours() == 0 && date.getMinutes() == 0) {
                            date.setMinutes(date.getMinutes() - 30)
                        }

                        if (date.getMonth() == month) {
                            const value = Number(archive.value.toFixed(fix)) * multyply
                            const monthDate = date.getFullYear() + '' + date.getMonth() + '' + date.getDate()

                            if (monthResultMap.has(monthDate)) {
                                const find = monthResultMap.get(monthDate)
                                if (find[shortName]) {
                                    const signValue = sign || sign == undefined ? value : -value
                                    find[shortName] = ((find[shortName] * multyply) + signValue) / multyply
                                    monthResultMap.set(monthDate, find)
                                } else {
                                    archive.value = sign || sign == undefined ? value / multyply : -value / multyply
                                    monthResultMap.set(monthDate, { ...find, [shortName]: archive.value })
                                }
                            } else {
                                archive.value = sign || sign == undefined ? value / multyply : -value / multyply
                                monthResultMap.set(monthDate, { date: { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() }, [shortName]: archive.value })
                            }
                        }
                    }
                }
            }

            const data = Object.fromEntries(monthResultMap)
            const total = {
                'energyarchive_A+': null,
                'energyarchive_A-': null,
                'energyarchive_R+': null,
                'energyarchive_R-': null
            }
            for (const key in data) {
                for (const key2 in data[key]) {
                    if (key2 == 'date' && !total.year) {
                        total.month_key = data[key][key2].month - 1
                        total.month = data[key][key2].month
                        total.year = data[key][key2].year
                    } else {
                        total[key2] = total[key2] + data[key][key2] || data[key][key2]
                    }
                }
            }
            if (total.month) {
                yearResultMap.set(total.year + '' + total.month_key, {
                    date: { month: total.month, year: total.year },
                    'energyarchive_A+': total['energyarchive_A+'],
                    'energyarchive_A-': total['energyarchive_A-'],
                    'energyarchive_R+': total['energyarchive_R+'],
                    'energyarchive_R-': total['energyarchive_R-'],
                })
            }

            const sortedData = Object.keys(data)
                .sort((a, b) => a - b)
                .reduce((obj, key) => {
                    obj[key] = data[key];
                    return obj;
                }, {});

            const dataYear = Object.fromEntries(yearResultMap)
            const monthlyDocuments = Object.keys(dataYear)
                .sort((a, b) => a - b)
                .reduce((obj, key) => {
                    obj[key] = dataYear[key];
                    return obj;
                }, {});

            return { dailyDocuments: Object.values(sortedData), monthlyDocuments: Object.values(monthlyDocuments) };
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function firstTemplateReport(id, date1, date2, bool) {
        try {
            const startDate = new Date(date1)
            const finishDate = new Date(date2)
            startDate.setMinutes(15)

            const existList = bool ? [energyarchive[0], energyarchive[2]] : [energyarchive[1], energyarchive[3]]
            const electObjectPipelines = [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $unwind: {
                        path: "$parameters",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "parameters.meter",
                        foreignField: "meter",
                        as: "parameters.param_details"
                    }
                },
                {
                    $unwind: {
                        path: "$parameters.param_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        parameters: { $push: "$parameters" },
                        name: { $first: "$name" },
                        type: { $first: "$type" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        child_objects: { $first: "$child_objects" }
                    }
                },
                {
                    $project: {
                        parameters: {
                            $filter: {
                                input: "$parameters",
                                as: "param",
                                cond: {
                                    $in: [
                                        "$$param.param_details.param_short_name",
                                        existList
                                    ]
                                }
                            }
                        },
                        name: 1,
                        type: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        child_objects: 1
                    }
                },
            ];

            const electObjectDocument = await electObjectModel.aggregate(electObjectPipelines, { maxTimeMS: 50000 })
            if (!electObjectDocument[0]) return undefined

            const result = []
            for (const value of electObjectDocument[0].parameters) {
                const obj = value.param_details
                const archives = await archiveModel.find({
                    parameter: obj._id,
                    date: {
                        $lte: new Date(finishDate),
                        $gte: new Date(startDate)
                    }
                })

                result.push({ ...value, parameter_values: archives })
            }
            return result
        } catch (err) {
            console.log(err)
            throw new CustomError(err.status, err.message)
        }
    }

    async function secondTemplateReport(id, startDate, finishDate) {
        try {
            const existList = [energyarchive[0]]

            const electObjectPipelines = [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $unwind: {
                        path: "$parameters",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "parameters.meter",
                        foreignField: "meter",
                        as: "parameters.param_details"
                    }
                },
                {
                    $unwind: {
                        path: "$parameters.param_details",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        parameters: { $push: "$parameters" },
                        name: { $first: "$name" },
                        type: { $first: "$type" },
                        createdAt: { $first: "$createdAt" },
                        updatedAt: { $first: "$updatedAt" },
                        child_objects: { $first: "$child_objects" }
                    }
                },
                {
                    $project: {
                        parameters: {
                            $filter: {
                                input: "$parameters",
                                as: "param",
                                cond: {
                                    $in: [
                                        "$$param.param_details.param_short_name",
                                        existList
                                    ]
                                }
                            }
                        },
                        name: 1,
                        type: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        child_objects: 1
                    }
                },
            ];

            const electObjectDocument = await electObjectModel.aggregate(electObjectPipelines, { maxTimeMS: 50000 })
            if (!electObjectDocument[0]) return undefined

            const result = { ...electObjectDocument[0], parameters: [] }
            for (const value of electObjectDocument[0].parameters) {
                const obj = value.param_details
                const archives = await archiveModel.find({
                    parameter: obj._id,
                    date: {
                        $lt: new Date(finishDate),
                        $gte: new Date(startDate)
                    }
                })

                result.parameters.push({ ...value, parameter_values: archives })
            }
            return result
        } catch (err) {
            console.log(err)
            throw new CustomError(err.status, err.message)
        }
    }

    async function thirdTemplateReport(id, date1, date2) {
        try {
            const fix = 10
            const multyply = 1000000000

            const startDate = new Date(date1)
            const finishDate = new Date(date2)
            startDate.setMinutes(15)

            const existList = energyarchive
            const objects = []
            const A1 = energyarchive[0]
            const A0 = energyarchive[1]
            const R1 = energyarchive[2]
            const R0 = energyarchive[3]
            let find = {}

            const findFamily = async (key, findId) => {
                const electObjectPipelines = [
                    {
                        $match: {
                            [key]: new mongoose.Types.ObjectId(findId)
                        }
                    },
                    {
                        $unwind: {
                            path: "$parameters",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $lookup: {
                            from: "parameters",
                            localField: "parameters.meter",
                            foreignField: "meter",
                            as: "parameters.param_details"
                        }
                    },
                    {
                        $unwind: {
                            path: "$parameters.param_details",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            parameters: { $push: "$parameters" },
                            name: { $first: "$name" },
                            type: { $first: "$type" },
                            meter_id: { $first: "$meter_id" },
                            parent_object: { $first: "$parent_object" },
                            createdAt: { $first: "$createdAt" },
                            updatedAt: { $first: "$updatedAt" },
                        }
                    },
                    {
                        $project: {
                            parameters: {
                                $filter: {
                                    input: "$parameters",
                                    as: "param",
                                    cond: {
                                        $in: [
                                            "$$param.param_details.param_short_name",
                                            existList
                                        ]
                                    }
                                }
                            },
                            name: 1,
                            type: 1,
                            parent_object: 1,
                            meter_id: 1,
                            createdAt: 1,
                            updatedAt: 1,
                            child_objects: 1
                        }
                    },
                ];

                const electObjectDocument = await electObjectModel.aggregate(electObjectPipelines, { maxTimeMS: 50000 })
                objects.push(...electObjectDocument)
                if (electObjectDocument[0] && electObjectDocument[0]._id == id) {
                    find = electObjectDocument[0]
                    await findFamily("parent_object", id)
                }
            }

            await findFamily("_id", id)
            for (const object of objects) {
                for (const param of object.parameters) {
                    const shortName = param.param_details.param_short_name
                    if (param.params_feeder && typeof param.params_feeder[shortName] === 'boolean') {
                        const all = await archiveModel.find({ parameter: param.param_details._id, date: { $lte: finishDate, $gte: startDate } })
                        let total = 0
                        for (const values of all) {
                            const value = Number(values.value.toFixed(fix)) * multyply
                            const sum = Number(total.toFixed(fix)) * multyply
                            total = (sum + value) / multyply
                        }

                        const thisFeederData = (total * (param.multiply[0] || 1)) * (param.multiply[1] || 1)
                        if (object[shortName]) {
                            const sign = param.params_feeder[shortName]
                            object[shortName] += sign ? thisFeederData : -thisFeederData
                        } else {
                            const sign = param.params_feeder[shortName]
                            object[shortName] = sign ? thisFeederData : -thisFeederData
                        }
                    }
                    if (param.params_meter && typeof param.params_meter[shortName] === 'boolean') {
                        const all = await archiveModel.find({ parameter: param.param_details._id, date: { $lte: finishDate, $gte: startDate } })
                        let total = 0
                        for (const values of all) {
                            const value = Number(values.value.toFixed(fix)) * multyply
                            const sum = Number(total.toFixed(fix)) * multyply
                            total = (sum + value) / multyply
                        }

                        const thisMeterData = total
                        if (object[shortName]) {
                            const sign = param.params_meter[shortName]
                            object[shortName] += sign ? thisMeterData : -thisMeterData
                        } else {
                            const sign = param.params_meter[shortName]
                            object[shortName] = sign ? thisMeterData : -thisMeterData
                        }
                    }
                }
            }

            const childResult = objects.filter(e => String(e.parent_object) == String(id))

            find[A1 + '_UNBALANCE'] = (find[A1] || 0) - childResult.reduce((sum, obj) => sum + (obj[A1] || 0), 0)
            find[A0 + '_UNBALANCE'] = (find[A0] || 0) - childResult.reduce((sum, obj) => sum + (obj[A0] || 0), 0)
            find[R1 + '_UNBALANCE'] = (find[R1] || 0) - childResult.reduce((sum, obj) => sum + (obj[R1] || 0), 0)
            find[R0 + '_UNBALANCE'] = (find[R0] || 0) - childResult.reduce((sum, obj) => sum + (obj[R0] || 0), 0)

            return objects
        } catch (err) {
            console.log(err)
            throw new CustomError(err.status, err.message)
        }
    }

    async function fourthTemplateReport(id, date1, date2) {
        try {
            const fix = 10
            const multyply = 1000000000

            const startDate = new Date(date1)
            const finishDate = new Date(date2)
            startDate.setMinutes(15)

            const objects = {}
            const A1 = energyarchive[0]
            const A0 = energyarchive[1]
            const R1 = energyarchive[2]
            const R0 = energyarchive[3]
            const find = JSON.parse(JSON.stringify(await electObjectModel.findOne({ _id: id })))

            for (const param of find.parameters) {
                if (!objects[param.from]) {
                    const electObjectPipelines = [
                        {
                            $match: {
                                _id: new mongoose.Types.ObjectId(param.from)
                            }
                        },
                        {
                            $unwind: {
                                path: "$parameters",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $lookup: {
                                from: "parameters",
                                localField: "parameters.meter",
                                foreignField: "meter",
                                as: "parameters.param_details"
                            }
                        },
                        {
                            $unwind: {
                                path: "$parameters.param_details",
                                preserveNullAndEmptyArrays: true
                            }
                        },
                        {
                            $group: {
                                _id: "$_id",
                                parameters: { $push: "$parameters" },
                                name: { $first: "$name" },
                                type: { $first: "$type" },
                                meter_id: { $first: "$meter_id" },
                                parent_object: { $first: "$parent_object" },
                                createdAt: { $first: "$createdAt" },
                                updatedAt: { $first: "$updatedAt" },
                            }
                        },
                        {
                            $project: {
                                parameters: {
                                    $filter: {
                                        input: "$parameters",
                                        as: "param",
                                        cond: {
                                            $in: [
                                                "$$param.param_details.param_short_name",
                                                uniqueShortName(param)
                                            ]
                                        }
                                    }
                                },
                                name: 1,
                                type: 1,
                                parent_object: 1,
                                meter_id: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                child_objects: 1
                            }
                        },
                    ];
                    let electObjectDocument
                    if (electModel.includes(param.type)) {
                        electObjectDocument = await electObjectModel.aggregate(electObjectPipelines, { maxTimeMS: 50000 })
                    } else {
                        electObjectDocument = await calculationObjectModel.aggregate(electObjectPipelines, { maxTimeMS: 50000 })
                    }
                    if (electObjectDocument[0]) objects[param.from] = electObjectDocument[0]
                }
            }

            const childrens = Object.values(objects)
            for (const object of childrens) {
                for (const param of object.parameters) {
                    const shortName = param.param_details.param_short_name
                    if (param.params_feeder && typeof param.params_feeder[shortName] === 'boolean') {
                        const all = await archiveModel.find({ parameter: param.param_details._id, date: { $lte: finishDate, $gte: startDate } })
                        let total = 0
                        for (const values of all) {
                            const value = Number(values.value.toFixed(fix)) * multyply
                            const sum = Number(total.toFixed(fix)) * multyply
                            total = (sum + value) / multyply
                        }

                        const thisFeederData = (total * (param.multiply[0] || 1)) * (param.multiply[1] || 1)
                        if (object[shortName]) {
                            const sign = param.params_feeder[shortName]
                            object.sign = sign
                            object[shortName] += sign ? thisFeederData : -thisFeederData
                        } else {
                            const sign = param.params_feeder[shortName]
                            object.sign = sign
                            object[shortName] = sign ? thisFeederData : -thisFeederData
                        }
                    }
                    if (param.params_meter && typeof param.params_meter[shortName] === 'boolean') {
                        const all = await archiveModel.find({ parameter: param.param_details._id, date: { $lte: finishDate, $gte: startDate } })
                        let total = 0
                        for (const values of all) {
                            const value = Number(values.value.toFixed(fix)) * multyply
                            const sum = Number(total.toFixed(fix)) * multyply
                            total = (sum + value) / multyply
                        }

                        const thisMeterData = total
                        if (object[shortName]) {
                            const sign = param.params_meter[shortName]
                            object.sign = sign
                            object[shortName] += sign ? thisMeterData : -thisMeterData
                        } else {
                            const sign = param.params_meter[shortName]
                            object.sign = sign
                            object[shortName] = sign ? thisMeterData : -thisMeterData
                        }
                    }
                }
            }

            find[A1] = childrens.reduce((sum, obj) => sum + (obj[A1] || 0), 0)
            find[A0] = childrens.reduce((sum, obj) => sum + (obj[A0] || 0), 0)
            find[R1] = childrens.reduce((sum, obj) => sum + (obj[R1] || 0), 0)
            find[R0] = childrens.reduce((sum, obj) => sum + (obj[R0] || 0), 0)

            return [find, ...childrens]
        } catch (err) {
            console.log(err)
            throw new CustomError(err.status, err.message)
        }
    }
}
