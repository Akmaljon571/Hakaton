const Joi = require("joi")
const { calculationType } = require("../global/enum")

module.exports.creatCalculationFolder = Joi.object().keys({
    name: Joi.string().required(),
    type: Joi.valid(...calculationType).required(),
    parent_object: Joi.string(),
}).required()

module.exports.updateCalculationFolder = Joi.object().keys({
    name: Joi.string().required()
}).required()
