const Joi = require("joi")

module.exports.getEventsJoi = Joi.object().keys({
    date1: Joi.string().required(),
    date2: Joi.string().required(),
    filter: Joi.string().required(),
    limit: Joi.number(),
}).required()
