const Joi = require("joi")

module.exports.tableData = Joi.object().keys({
    type: Joi.string().required(),
    selectedParameters: Joi.string().required(),
    date1: Joi.string().required(),
    date2: Joi.string().required(),
    limit: Joi.string(),
}).required()

module.exports.tableDataFull = Joi.object().keys({
    selectedParameters: Joi.string().required(),
    date1: Joi.string().required(),
    date2: Joi.string().required(),
    limit: Joi.string(),
}).required()

module.exports.graphArchive = Joi.object().keys({
    selectedParameters: Joi.string(),
    limit: Joi.string(),
    date1: Joi.string(),
    date2: Joi.string()
}).required()

module.exports.vector = Joi.object().keys({
    selectedParameters: Joi.string(),
    limit: Joi.string(),
    finish: Joi.string(),
    modelDate: Joi.string(),
    paramDate: Joi.string(),
    coefficient: Joi.boolean()
}).required()
