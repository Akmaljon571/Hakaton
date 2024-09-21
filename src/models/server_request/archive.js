const mongoose = require("mongoose")

const archiveSchema = new mongoose.Schema({
    value: { type: Number, required: true },
    date: { type: Date, index: true },
    parameter: { type: mongoose.Schema.Types.ObjectId, ref: "parameter", index: true }
}, {
    timestamps: true
})

module.exports.archiveModel = mongoose.model("archive", archiveSchema)
