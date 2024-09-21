const Joi = require("joi")

module.exports.billingGetJoi = Joi.object().keys({
    date1: Joi.string().required(),
    date2: Joi.string().required(),
}).required()

module.exports.firstReportJoi = Joi.object().keys({
    date1: Joi.string().required(),
    date2: Joi.string().required(),
    step: Joi.boolean().required()
}).required()

module.exports.secondReportJoi = Joi.object().keys({
    date1: Joi.string().required(),
    date2: Joi.string().required(),
}).required()
