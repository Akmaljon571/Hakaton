const mongoose = require("mongoose")
const CustomError = require("../../utils/custom_error")
const { meterModel } = require("../../models")

module.exports.meterRepository = () => {
    return Object.freeze({
        insert,
        findAll,
        find,
        findOne,
        reActivateMeter,
        findWithNumber,
        findPrevious,
        countDocuments,
        updateOne,
        findListAlreadyPorts,
        updateProtokol,
        removeMeter
    })

    async function countDocuments(args) {
        try {
            return await meterModel.countDocuments(args)
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function insert(args) {
        try {
            const newMeterDocument = await meterModel.create(args)
            return newMeterDocument
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function find() {
        try {
            return (await meterModel.find()).filter(e => e.status)
        } catch (error) {
            throw new CustomError(error.status, error.message)
        }
    }

    async function findWithNumber(number_meter) {
        try {
            return await meterModel.findOne({ number_meter })
        } catch (error) {
            throw new CustomError(error.status, error.message)
        }
    }

    async function findAll() {
        try {
            const pipeline = [
                {
                    $lookup: {
                        from: "parameters",
                        let: { meterId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$meter", "$$meterId"] },
                                }
                            }
                        ],
                        as: "parameters"
                    }
                },
                {
                    $sort: { "_id": 1 }
                }
            ];

            const meterDocuments = await meterModel.aggregate(pipeline);
            return meterDocuments.filter(e => e.status);
        } catch (err) {
            console.error('findAll funktsiyasida xato:', err);
            throw new CustomError(500, err.message);
        }
    }

    async function findOne(id) {
        try {
            const meterDocuments = await meterModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(id) }
                },
                {
                    $lookup: {
                        from: "parameters",
                        foreignField: "meter",
                        localField: "_id",
                        as: "parameters"
                    }
                }
            ])
            if (meterDocuments[0] && meterDocuments[0].status) return meterDocuments[0]
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findListAlreadyPorts() {
        try {
            const meterDocuments = await meterModel.find({ connection_channel: { $in: ["3", "4"] }, status: true })
            return meterDocuments.map(e => e.port)
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findPrevious(_id, obj) {
        try {
            const meterDocuments = await meterModel.aggregate([
                {
                    $match: {
                        _id,
                        ...obj
                    }
                },
                {
                    $lookup: {
                        from: "parameters",
                        foreignField: "meter",
                        localField: "_id",
                        as: "parameters"
                    }
                }
            ])
            return meterDocuments[0].filter(e => e.status)
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function updateProtokol(_id, version) {
        try {
            await meterModel.updateOne({ _id }, { protokol: version })
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function updateOne(id, data) {
        try {
            const find = await meterModel.findById(id)
            let meter_param = {
                name: data.name ? data.name : find.name,
                meter_type: data.meter_type ? data.meter_type : find.meter_type,
                number_meter: data.number_meter ? data.number_meter : find.number_meter,
                meter_form: data.meter_form ? data.meter_form : find.meter_form,
                connection_address: data.connection_address ? data.connection_address : find.connection_address,
                password: data.password ? data.password : find.password,
                connection_channel: data.connection_channel ? data.connection_channel : find.connection_channel,
                ip_address: data.ip_address ? data.ip_address : find.ip_address,
                port: data.port ? data.port : find.port,
                waiting_time: data.waiting_time ? data.waiting_time : find.waiting_time,
                interval_time: data.interval_time ? data.interval_time : find.interval_time,
                pause_time: data.pause_time ? data.pause_time : find.pause_time,
                package_size: data.package_size ? data.package_size : find.package_size,
                com_port: data.com_port ? data.com_port : find.com_port,
                init_line: data.init_line ? data.init_line : find.init_line,
                phone_number: data.phone_number ? data.phone_number : find.phone_number,
                data_polling_length: data.data_polling_length ? data.data_polling_length : find.data_polling_length,
                data_refresh_length: data.data_refresh_length ? data.data_refresh_length : find.data_refresh_length,
                period_type: data.period_type ? data.period_type : find.period_type,
                days_of_month: data.days_of_month ? data.days_of_month : find.days_of_month,
                days_of_week: data.days_of_week ? data.days_of_week : find.days_of_week,
                hours_of_day: data.hours_of_day ? data.hours_of_day : find.hours_of_day,
                time_difference: data.time_difference || data.time_difference == 0 ? data.time_difference : find.time_difference
            }

            const meterDocuments = await meterModel.updateOne({ _id: id }, meter_param)
            return meterDocuments
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function removeMeter(_id) {
        try {
            await meterModel.updateOne({ _id }, { status: false })
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function reActivateMeter(_id) {
        try {
            await meterModel.updateOne({ _id }, { status: true })
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }
}
