const { Router } = require("express");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { validateQuery } = require("../../middleware/validate_query");
const { getEventsJoi } = require("../../validation/events");
const { getTypeEventList, getEvents, getLast20, getListForReport } = require("../../controller/server/event");

module.exports.eventRouter = Router()
    .get('/types/:type', adminToken_superToken, getTypeEventList)
    .get('/list/:id', adminToken_superToken, validateQuery(getEventsJoi), getEvents)
    .get('/report/:id', adminToken_superToken, validateQuery(getEventsJoi), getListForReport)
    .get('/last', adminToken_superToken, getLast20)
