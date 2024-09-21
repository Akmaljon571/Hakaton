const mongoose = require("mongoose")

const feederSchema = new mongoose.Schema({
    TT: { type: [Number] },
    TN: { type: [Number] },
    VT: { type: [{ dividend: Number, divisor: Number }] },
    CT: { type: [{ dividend: Number, divisor: Number }] },
    date: { type: [Date] },
    feeder: { type: mongoose.Schema.Types.ObjectId, ref: "elect_object" }
});

module.exports.feederModel = mongoose.model("feeders", feederSchema)
