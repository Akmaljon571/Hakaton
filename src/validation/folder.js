const Joi = require("joi")

module.exports.folderGetJoi = Joi.object().keys({
    limit: Joi.number(),
}).required()

module.exports.folderCreateJoi = Joi.object().keys({
    name: Joi.string().required(),
    parent_id: Joi.string()
}).required()

module.exports.folderUpdateJoi = Joi.object().keys({
    name: Joi.string(),
}).required()