const mongoose = require("mongoose");
const { manualStatus, journalStatus } = require("../../global/enum");

const manualRequestSchema = new mongoose.Schema({
    meter: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
    billing: {
        summa_A1: { type: Number },
        summa_A0: { type: Number },
        summa_R0: { type: Number },
        summa_R1: { type: Number },
        tarif1_A1: { type: Number },
        tarif2_A1: { type: Number },
        tarif3_A1: { type: Number },
        tarif4_A1: { type: Number },
        tarif1_A0: { type: Number },
        tarif2_A0: { type: Number },
        tarif3_A0: { type: Number },
        tarif4_A0: { type: Number },
        tarif1_R1: { type: Number },
        tarif2_R1: { type: Number },
        tarif3_R1: { type: Number },
        tarif4_R1: { type: Number },
        tarif1_R0: { type: Number },
        tarif2_R0: { type: Number },
        tarif3_R0: { type: Number },
        tarif4_R0: { type: Number },
        date: { type: Date },
        status: { type: String, enum: manualStatus },
        message: String
    },
    archive: [{
        value: { type: Number },
        date: { type: Date, index: true },
        state: { type: Number },
        tariff: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        parameter: { type: mongoose.Schema.Types.ObjectId, ref: "parameter", index: true },
        status: { type: String, enum: manualStatus },
        message: String
    }],
    current: [{
        value: { type: Number },
        date: { type: Date, index: true },
        state: { type: Number },
        tariff: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
        parameter: { type: mongoose.Schema.Types.ObjectId, ref: "parameter", index: true },
        status: { type: String, enum: manualStatus },
        message: String
    }],
    event: [{
        open_close: [{ date: Date, status: Number }],
        on_off: [{ date: Date, status: Number }],
        status: { type: String, enum: manualStatus },
        message: String
    }],
    open: {
        data: String,
        status: { type: String, enum: manualStatus },
        message: String
    },
    password: {
        data: String,
        status: { type: String, enum: manualStatus },
        message: String
    },
    datetime: {
        data: Date,
        status: { type: String, enum: manualStatus },
        message: String
    },
    status: { type: String, enum: journalStatus }
}, {
    timestamps: true
});

module.exports.manualRequestModel = mongoose.model("manualRequest", manualRequestSchema);
