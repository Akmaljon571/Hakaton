const Joi = require("joi")
const { allParametersWithType } = require("../global/variable")
const { all_short_name } = require("../global/file-path")

const type_folder_enum = ["factory", "substation", "tire_section", "feeder"]
const type_meter_enum = ["meter"]

module.exports.createElectFolder = Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.valid(...type_folder_enum).required(),
    parent_object: Joi.string(),
}).required()

module.exports.getQuery = Joi.object().keys({
    type: Joi.string().required(),
}).required()

module.exports.createElectMeter = Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.valid(...type_meter_enum).required(),
    parent_object: Joi.string().required(),
    meter_id: Joi.string().required(),
    vt: Joi.object().keys({
        dividend: Joi.number().required(),
        divisor: Joi.number().required()
    }).required(),
    ct: Joi.object().keys({
        dividend: Joi.number().required(),
        divisor: Joi.number().required()
    }).required(),
    date: Joi.date().required(),
    multiply: Joi.array().items(Joi.number()).required(),
}).required()

module.exports.updateElectFolder = Joi.object().keys({
    name: Joi.string().required()
}).required()

module.exports.updateElectMeter = Joi.object().keys({
    name: Joi.string(),
    vt: Joi.object().keys({
        dividend: Joi.number(),
        divisor: Joi.number()
    }),
    ct: Joi.object().keys({
        dividend: Joi.number(),
        divisor: Joi.number()
    }),
    date: Joi.date(),
    multiply: Joi.array().items(Joi.number()),
}).required()

module.exports.attachParamsElectJoi = Joi.object().keys({
    parameters: Joi.array().items(
        Joi.object().keys({
            meter: Joi.string().required(),
            from: Joi.string().required(),
            type: Joi.string().required(),
            multiply: Joi.array().items(Joi.number()).required(),
            params_meter: Joi.object(),
            params_feeder: Joi.object(),
            activate: Joi.array()
        }).required()
    ).required()
}).required()
