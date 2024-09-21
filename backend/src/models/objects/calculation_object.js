const mongoose = require("mongoose")
const { calculationType } = require("../../global/enum")
const { allParametersWithType } = require("../../global/variable")

const calculationObject = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: calculationType },
    parent_object: { type: mongoose.Schema.Types.ObjectId, ref: "calculation_object" },
    meter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "meter",
        require: false
    },
    parameters: [
        {
            meter: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
            type: { type: String, required: true, enum: ["elect_object", "calculation_object"] },
            from: { type: mongoose.Schema.Types.ObjectId, refPath: "parameters.type" },
            params_meter: allParametersWithType({ type: Boolean }),
            params_feeder: allParametersWithType({ type: Boolean }),
            multiply: { type: [Number], default: [1] },
        }
    ]
}, {
    timestamps: true
})

module.exports.calculationObjectModel = mongoose.model("calculation_object", calculationObject)
