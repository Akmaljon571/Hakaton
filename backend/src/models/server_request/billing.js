const mongoose = require("mongoose")

const billingSchema = new mongoose.Schema({
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
    meter_id: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
    date: { type: Date, required: true }
}, {
    timestamps: true
})

module.exports.billingModel = mongoose.model("billing", billingSchema)
