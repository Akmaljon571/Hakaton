const mongoose = require("mongoose")
const { electType } = require("../../global/enum")
const { allParametersWithType } = require("../../global/variable")

const electObjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: electType },
    parent_object: { type: mongoose.Schema.Types.ObjectId, ref: "elect_object" },
    meter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "meter",
        require: false
    },
    vt: { dividend: Number, divisor: Number },
    ct: { dividend: Number, divisor: Number },
    parameters: [
        {
            meter: { type: mongoose.Schema.Types.ObjectId, ref: "meter" },
            type: { type: String, required: true, enum: ["elect_object", "calculation_object"], default: 'elect_object' },
            from: { type: mongoose.Schema.Types.ObjectId, refPath: "parameters.type" },
            params_meter: allParametersWithType({ type: Boolean }),
            params_feeder: allParametersWithType({ type: Boolean }),
            multiply: { type: [Number], default: [1] },
        }
    ]
}, {
    timestamps: true
})

module.exports.electObjectModel = mongoose.model("elect_object", electObjectSchema)
