const mongoose = require("mongoose")
const { allParametersWithType } = require("../../global/variable")

const currentSchema = new mongoose.Schema({
    meter_id: { type: mongoose.Schema.Types.ObjectId, ref: "meter", index: true },
    day: { type: Date, index: true },
    data: [{
        date: { type: Date, index: true },
        values: allParametersWithType({ type: String, default: "Empty" })
    }]
}, {
    timestamps: true
})

module.exports.currentModel = mongoose.model("current", currentSchema)
