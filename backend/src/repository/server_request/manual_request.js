const CustomError = require("../../utils/custom_error")
const { manualRequestModel } = require("../../models")

module.exports.manualRequestRepository = () => {
  return Object.freeze({
    insert,
    update,
    updateSucceed,
    updateFailed,
  })

  async function insert(meter) {
    try {
      return await manualRequestModel.create({ meter, status: "sent" })
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function update(_id, status) {
    try {
      return await manualRequestModel.updateOne({ _id }, { status })
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function updateSucceed(_id, data, step) {
    try {
      return await manualRequestModel.updateOne({ _id }, { [step.toLowerCase()]: { ...data, status: "succeed" } })
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function updateFailed(_id, step, message) {
    try {
      return await manualRequestModel.updateOne({ _id }, { [step.toLowerCase()]: { status: "failed", message } })
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }
}