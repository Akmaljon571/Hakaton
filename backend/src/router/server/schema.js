const { Router } = require("express");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { allSchema, singleSchema } = require("../../controller/server/gm");

module.exports.routerSchema = Router()
    .get('/all', adminToken_superToken, allSchema)
    .get('/single/:id', adminToken_superToken, singleSchema)
