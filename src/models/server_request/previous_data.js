const mongoose = require("mongoose")

const previousSchema = new mongoose.Schema({
    meter_id: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
    billing: { type: Date, required: true },
    archive: { type: Date, required: true },
    event: {
        open_close: Date,
        on_off: Date,
        phase_current: Date,
        phase_volt: Date
    },
    currentTime: Date,
    time30: Date,
    archiveTotalA: Number,
    archiveTotalR: Number,
    plusA: Number,
    tarifA1: Number,
    tarifA2: Number,
    tarifA3: Number,
    tarifA4: Number,
    plusR: Number,
    tarifR1: Number,
    tarifR2: Number,
    tarifR3: Number,
    tarifR4: Number,
    count: Number
})

module.exports.previousModel = mongoose.model("previous", previousSchema)
