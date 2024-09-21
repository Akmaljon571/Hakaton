const mongoose = require("mongoose");
const { journalStatus } = require("../../global/enum");

const lastCurrentSchema = new mongoose.Schema({
    meter: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
    parameters: [
        {
            param_short_name: String,
            value: Number,
            date: Date
        }
    ],
    status: {
        type: String,
        enum: journalStatus
    }
});

module.exports.lastCurrentModel = mongoose.model("lastCurrent", lastCurrentSchema)
