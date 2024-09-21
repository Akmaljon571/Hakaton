const CustomError = require("../../utils/custom_error")
const { lastJoinModel } = require("../../models")
const { default: mongoose } = require("mongoose")

module.exports.lastJoinRepository = () => {
  return Object.freeze({
    findWithMeter,
    insertMany,
    update,
    updateLastFailed
  })

  async function findWithMeter(meter) {
    try {
      return await lastJoinModel.findOne({ meter: meter })
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function insertMany(args) {
    try {
      await lastJoinModel.insertMany(args)
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function update(meter_id, args) {
    try {
      await lastJoinModel.updateOne({ meter: new mongoose.Types.ObjectId(meter_id) }, args)
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function updateLastFailed() {
    try {
      await lastJoinModel.updateMany({ status: "sent" }, { $set: { status: "failed" } });
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }
}