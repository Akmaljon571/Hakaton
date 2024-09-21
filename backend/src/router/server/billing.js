const { Router } = require("express");
const { getListBilling, getListForTable } = require("../../controller/server/billing");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { validateQuery } = require("../../middleware/validate_query");
const { billingGetJoi } = require("../../validation/billing");

module.exports.billingRouter = Router()
    .get('/table/:id', validateQuery(billingGetJoi), getListForTable)
    .get('/:id', adminToken_superToken, validateQuery(billingGetJoi), getListBilling)
