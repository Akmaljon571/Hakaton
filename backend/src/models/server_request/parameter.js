const mongoose = require("mongoose")

const parameterSchema = new mongoose.Schema({
    param_meter_type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "active"
    },
    channel_full_id: {
        type: String,
        required: true,
    },
    parameter_type: {
        type: String,
        required: true,
    },
    param_short_name: {
        type: String,
        required: true,
    },
    param_name: {
        type: String
    },
    indicator: String,
    meter: { type: mongoose.Schema.Types.ObjectId, ref: "meter" }
})


module.exports.parameterModel = mongoose.model("parameter", parameterSchema)
