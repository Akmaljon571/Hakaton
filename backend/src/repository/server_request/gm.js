const mongoose = require("mongoose");
const CustomError = require("../../utils/custom_error");
const { meterModel, electObjectModel } = require("../../models")
const { allMultiply, vectorMultiplyTN, vectorMultiplyTT, energyarchive } = require("../../global/variable");
const { formula } = require("../../utils/formula");
const { meterListReadFile } = require("../../global/meter-list");

module.exports.gmRepository = () => {
    return Object.freeze({
        all,
        single,
        schemaAll,
        schemaSignle
    })

    async function all() {
        try {
            const all = await meterModel.aggregate([
                {
                    $lookup: {
                        from: "lastcurrents",
                        localField: "_id",
                        foreignField: "meter",
                        as: "lastJoin"
                    }
                }
            ])

            for (const meter of all) {
                if (meter && meter.lastJoin[0] && meter.lastJoin[0].parameters.length) {
                    const electObject = await electObjectModel.findOne({ meter_id: meter._id })
                    const map = new Map()
                    let current
                    let obj = {}
                    for (const param of meter.lastJoin[0].parameters) {
                        obj[param.param_short_name] = param
                    }

                    obj = formula(obj)
                    for (const key in obj) {
                        const param = obj[key]

                        if (electObject) {
                            const TT = electObject.vt.dividend / electObject.vt.divisor
                            const TN = electObject.ct.dividend / electObject.ct.divisor
                            param.value = coefficient(key, param.value, [TT, TN])
                        }
                        map.set(`${key}`, param)
                        current = param.date || current
                    }
                    meter.lastJoin = meter.lastJoin[0]
                    meter.lastJoin.parameters = Object.fromEntries(map)
                    meter.lastJoin.current = current
                } else {
                    meter.lastJoin = {}
                }
            }

            return all
        } catch (err) {
            console.log(err)
            throw new CustomError(500, err.message);
        }
    }

    async function single(_id) {
        try {
            const find = await meterModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(_id)
                    }
                },
                {
                    $lookup: {
                        from: "lastcurrents",
                        localField: "_id",
                        foreignField: "meter",
                        as: "lastJoin"
                    }
                }
            ])
            const meter = find[0]
            if (!meter) return

            if (meter && meter.lastJoin[0] && meter.lastJoin[0].parameters.length) {
                const electObject = await electObjectModel.findOne({ meter_id: meter._id })
                const map = new Map()
                let current
                let obj = {}
                for (const param of meter.lastJoin[0].parameters) {
                    obj[param.param_short_name] = param
                }

                obj = formula(obj)
                for (const key in obj) {
                    const param = obj[key]

                    if (electObject) {
                        const TT = electObject.vt.dividend / electObject.vt.divisor
                        const TN = electObject.ct.dividend / electObject.ct.divisor
                        param.value = coefficient(key, param.value, [TT, TN])
                    }
                    map.set(`${key}`, param)
                    current = param.date || current
                }
                meter.lastJoin = meter.lastJoin[0]
                meter.lastJoin.parameters = Object.fromEntries(map)
                meter.lastJoin.current = current
            } else {
                meter.lastJoin = {}
            }

            meter.typeName = meterListReadFile()[meter.meter_type]
            return meter
        } catch (err) {
            console.log(err)
            throw new CustomError(500, err.message);
        }
    }

    async function schemaAll() {
        try {
            const all = await meterModel.aggregate([
                {
                    $lookup: {
                        from: "lastcurrents",
                        localField: "_id",
                        foreignField: "meter",
                        as: "lastJoin"
                    }
                }
            ])

            for (const meter of all) {
                if (meter && meter.lastJoin[0] && meter.lastJoin[0].parameters.length) {
                    const electObject = await electObjectModel.findOne({ meter_id: meter._id })
                    const map = new Map()
                    let current
                    let obj = {}
                    for (const param of meter.lastJoin[0].parameters) {
                        obj[param.param_short_name] = param
                    }

                    obj = formula(obj)
                    for (const key in obj) {
                        const param = obj[key]

                        if (electObject) {
                            const TT = electObject.vt.dividend / electObject.vt.divisor
                            const TN = electObject.ct.dividend / electObject.ct.divisor
                            param.value = coefficient(key, param.value, [TT, TN])
                        }
                        map.set(`${key}`, param)
                        current = param.date || current
                    }
                    meter.lastJoin = meter.lastJoin[0]
                    meter.lastJoin.parameters = Object.fromEntries(map)
                    meter.lastJoin.current = current
                } else {
                    meter.lastJoin = {}
                }
            }

            return all
        } catch (err) {
            console.log(err)
            throw new CustomError(500, err.message);
        }
    }

    async function schemaSignle(_id) {
        try {
            const find = await meterModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(_id)
                    }
                },
                {
                    $lookup: {
                        from: "lastcurrents",
                        localField: "_id",
                        foreignField: "meter",
                        as: "lastJoin"
                    }
                }
            ])
            const meter = find[0]

            if (meter && meter.lastJoin[0] && meter.lastJoin[0].parameters.length) {
                const electObject = await electObjectModel.findOne({ meter_id: meter._id })
                const map = new Map()
                let current
                let obj = {}
                for (const param of meter.lastJoin[0].parameters) {
                    obj[param.param_short_name] = param
                }

                obj = formula(obj)
                for (const key in obj) {
                    const param = obj[key]

                    if (electObject) {
                        const TT = electObject.vt.dividend / electObject.vt.divisor
                        const TN = electObject.ct.dividend / electObject.ct.divisor
                        param.value = coefficient(key, param.value, [TT, TN])
                    }
                    map.set(`${key}`, param)
                    current = param.date || current
                }
                meter.lastJoin = meter.lastJoin[0]
                meter.lastJoin.parameters = Object.fromEntries(map)
                meter.lastJoin.current = current
            } else {
                meter.lastJoin = {}
            }

            meter.typeName = meterListReadFile()[meter.meter_type]
            return meter
        } catch (err) {
            console.log(err)
            throw new CustomError(500, err.message);
        }
    }

    function coefficient(name, value, multiply) {
        if (energyarchive.concat(allMultiply).includes(name)) {
            multiply.map(element => value = Math.round(value * element * 1000) / 1000)
        } else if (vectorMultiplyTN.includes(name)) {
            if (multiply && multiply[1]) {
                value = Math.round(value * multiply[1] * 1000) / 1000
            }
        } else if (vectorMultiplyTT.includes(name)) {
            if (multiply && multiply[0]) {
                value = Math.round(value * multiply[0] * 1000) / 1000
            }
        }

        return value
    }
}
