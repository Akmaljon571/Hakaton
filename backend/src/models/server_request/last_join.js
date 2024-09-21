const mongoose = require("mongoose");
const { journalStatus, journalType } = require("../../global/enum");

const lastJoinSchema = new mongoose.Schema({
    meter: { type: mongoose.Schema.Types.ObjectId, ref: "meter", unique: true },
    archive: String,
    current: String,
    event: String,
    archive_date: Date,
    current_date: Date,
    request_type: {
        type: String,
        enum: journalType,
    },
    status: {
        type: String,
        enum: journalStatus
    }
});

module.exports.lastJoinModel = mongoose.model("lastJoin", lastJoinSchema)
