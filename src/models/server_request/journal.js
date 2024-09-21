const mongoose = require("mongoose")
const { journalStatus, journalType } = require("../../global/enum")

const journalSchema = new mongoose.Schema({
    request_type: { type: String, enum: journalType },
    message: { type: String },
    parameter: { type: mongoose.Schema.Types.ObjectId, ref: "parameter" },
    manual_request: { type: mongoose.Schema.Types.ObjectId, ref: "manualRequests" },
    meter: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
    status: { type: String, enum: journalStatus },
    body: {
        status: Number,
        attempted: Number,
        obis: String
    }
}, {
    timestamps: true
})

module.exports.journalModel = mongoose.model("journal", journalSchema)
