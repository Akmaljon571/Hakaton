const mongoose = require("mongoose")
const CustomError = require("../../utils/custom_error")
const { energytotalOBIS } = require("../../global/variable")
const { parameterModel, electObjectModel } = require("../../models")

module.exports.parameterRepository = () => {
    return Object.freeze({
        findOne,
        insert,
        findMeter,
        findEnergyParameter,
        findAll,
        countDocuments,
        updateMany,
        findArchiveParameter
    })

    async function findArchiveParameter(current_id, short_name) {
        try {
            const a = await parameterModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(current_id) } },
                {
                    $lookup: {
                        from: "parameters",
                        localField: "meter",
                        foreignField: "meter",
                        as: "archive"
                    }
                },
                { $unwind: "$archive" },
                { $match: { "archive.param_short_name": short_name } }
            ]);
            return a
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function countDocuments(args) {
        try {
            return await parameterModel.countDocuments(args)
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findMeter(query) {
        try {
            const paramDocuments = await parameterModel.find(query)
            return paramDocuments
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findOne(query) {
        try {
            let pipArray = [{ $match: { ...query } }]
            const paramDocuments = await parameterModel.aggregate(pipArray)

            return paramDocuments[0]
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findEnergyParameter(id) {
        try {
            const paramDocuments = await parameterModel.aggregate([
                {
                    $match: {
                        meter: id,
                        channel_full_id: { $in: energytotalOBIS },
                        status: "active"
                    }
                }
            ]);

            return paramDocuments.map(e => e.channel_full_id)
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findAll(query) {
        try {
            let pipArray = [{ $match: { parameter_type: { $ne: null } } }]
            if (query.channel_full_id && query.channel_full_id !== "") {
                pipArray.unshift({
                    $match: { channel_full_id: query.channel_full_id }
                })
            }
            if (query.massive_full_id) {
                pipArray.unshift({
                    $match: {
                        channel_full_id: {
                            $in: query.massive_full_id
                        }
                    }
                })
            }

            if (query.parameter_type && query.parameter_type !== "") {
                pipArray.unshift({
                    $match: { parameter_type: query.parameter_type }
                })
            }

            const paramDocuments = await parameterModel.aggregate(pipArray)

            return paramDocuments
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function insert(args, meter) {
        try {
            const newParams = args.map((el) => {
                return {
                    meter: meter._id,
                    status: el.status,
                    parameter_type: el.parameter_type,
                    channel_full_id: el.channel_full_id,
                    param_short_name: el.param_short_name,
                    param_name: el.param_name,
                    param_meter_type: meter.meter_form
                }
            })

            await parameterModel.insertMany(newParams)
            return ''
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function updateMany(_id, meter_form, data) {
        try {
            const shorts = data.map((el) => ({
                meter: _id,
                status: el.status,
                parameter_type: el.parameter_type,
                channel_full_id: el.channel_full_id,
                param_short_name: el.param_short_name,
                param_name: el.param_name,
                param_meter_type: meter_form
            }))
            const params_meter = {}
            const params_feeder = {}

            await Promise.all(shorts.map(async (newObj) => {
                const shortName = newObj.param_short_name;
                const status = newObj.status;
                await parameterModel.updateOne({ meter: _id, param_short_name: shortName }, newObj);
                if(status == 'active') {
                    params_meter[`parameters.$[elem].params_meter.${shortName}`] = true;
                    params_feeder[`parameters.$[elem].params_feeder.${shortName}`] = true;
                }
            }));

            const find = await electObjectModel.findOne({ meter_id: _id });
            await electObjectModel.updateOne(
                { meter_id: _id, 'parameters.meter': _id },
                { $set: { "parameters.$[elem].params_meter": {} } },
                { arrayFilters: [{ 'elem.meter': _id }] },
            )
            await electObjectModel.updateOne(
                { meter_id: _id, 'parameters.meter': _id },
                { $set: params_meter },
                { arrayFilters: [{ 'elem.meter': _id }] }
            );

            await electObjectModel.updateOne(
                { _id: find.parent_object, 'parameters.meter': _id },
                { $set: { "parameters.$[elem].params_feeder": {} } },
                { arrayFilters: [{ 'elem.meter': _id }] }
            )
            await electObjectModel.updateMany(
                { _id: find.parent_object, 'parameters.meter': _id },
                { $set: params_feeder },
                { arrayFilters: [{ 'elem.meter': _id }] }
            );
        } catch (err) {
            console.log(err)
            throw new CustomError(500, err.message)
        }
    }
}
