const CustomError = require("../../utils/custom_error")
const { lastCurrentModel } = require("../../models")

module.exports.lastCurrentRepository = () => {
  return Object.freeze({
    updateSucceed,
    updateFailed
  })

  async function updateSucceed(args) {
    try {
      const find = await lastCurrentModel.findOne({ meter: args.meter_id })
      if (find) {
        const updateObj = {
          meter: args.meter_id,
          parameters: args.parameters,
          status: "succeed"
        }
        await lastCurrentModel.updateOne({ meter: args.meter_id }, updateObj)
      } else {
        const newObj = {
          meter: args.meter_id,
          parameters: args.parameters,
          status: "succeed"
        }
        await lastCurrentModel.create(newObj)
      }
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function updateFailed(args) {
    try {
      const find = await lastCurrentModel.findOne({ meter: args.meter_id })
      if (find) {
        await lastCurrentModel.updateOne({ meter: args.meter_id }, { status: 'failed' })
      }
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }
}