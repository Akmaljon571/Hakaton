const { Router } = require("express");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { checkPortFn } = require("../../controller/server/check_port");

module.exports.checkPort = Router()
    .get('/:port', adminToken_superToken, checkPortFn)
