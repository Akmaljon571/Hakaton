const { eventModel } = require("../../models");
const CustomError = require("../../utils/custom_error");

module.exports.eventRepository = () => {
    return Object.freeze({
        find,
        findList,
        findLast20,
        create,
    })

    async function find(args, limit) {
        return await eventModel.find(args).limit(limit);
    }

    async function findList(args) {
        return await eventModel.find(args);
    }

    async function findLast20(id) {
        const data = await eventModel.find().sort({ _id: -1 }).limit(20);
        if (!data.some(e => String(e._id), String(id))) return data;

        const result = [];
        for (const event of data) {
            if (String(event._id) === String(id)) break;
            result.push(event);
        }

        return result
    }

    async function create(args) {
        try {
            return await eventModel.create(args);
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }
}