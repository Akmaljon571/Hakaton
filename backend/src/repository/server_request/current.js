const CustomError = require("../../utils/custom_error");
const { currentModel } = require("../../models");

module.exports.currentRepository = () => {
    return Object.freeze({
        insert,
        update,
        findFilter
    })

    async function insert(args) {
        try {
            await currentModel.create(args);
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function update(_id, args) {
        try {
            await currentModel.updateOne({ _id }, args);
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findFilter(meter_id, start, finish) {
        try {
            const startDate = todayFormat(new Date(start));
            const finishDate = todayFormat(new Date(finish));
            finishDate.setDate(finishDate.getDate()+1)

            function todayFormat(date1) {
                const date2 = new Date(date1)
                date2.setHours(0, 0, 0, 0)
                return date2
            }

            return await currentModel.find({
                meter_id: meter_id,
                day: { $gte: startDate, $lte: finishDate } 
            });
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }
}
