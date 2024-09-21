const Joi = require("joi")

module.exports.createAdminJoi = Joi.object().keys({
   name: Joi.string(),
   login: Joi.string().required(),
   password: Joi.string().required(),
   role: Joi.string().valid("super"),
   open_page: Joi.array().required(),
   open_folders: Joi.array(),
   open_factory: Joi.array().required()
}).required()

module.exports.validatorUpdateAdmin = Joi.object().keys({
   name: Joi.string(),
   login: Joi.string(),
   password: Joi.string(),
   role: Joi.string().valid("super"),
   open_page: Joi.array(),
   open_folders: Joi.array(),
   open_factory: Joi.array()
}).required()
