const { archiveModel } = require("../../models");
const mongoose= require("mongoose");
const CustomError = require("../../utils/custom_error");

module.exports.archiveRepository = () => {
    return Object.freeze({
        insert,
        update,
        findTodayList
    })

    async function insert(args) {
        try {
            await archiveModel.insertMany(args);
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function update(_id, args) {
        try {
            await archiveModel.updateOne({ _id }, args);
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }

    async function findTodayList(id, date) {
        try {
            const startDate = new Date(date);

            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);

            return await archiveModel.find({
                parameter: new mongoose.Types.ObjectId(id),
                date: { $gte: startDate, $lt: endDate }
            });
        } catch (err) {
            throw new CustomError(err.status, err.message)
        }
    }
}
