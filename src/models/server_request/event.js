const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    meter_id: { type: mongoose.Schema.Types.ObjectId, ref: "meter", index: true },
    date: { type: Date, index: true },
    meter_name: String,
    event: String,
    value: String,
}, {
    timestamps: true
})

module.exports.eventModel = mongoose.model("event", eventSchema)
