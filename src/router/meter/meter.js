const { Router } = require("express");
const { createMeter, getListMeter, getOneMeter, updateMeter, paramsList, meterList, portList, removeMeter, removeFolder } = require("../../controller/meter/meter");
const { createMeterJoi, updateMeterJoi } = require("../../validation/meter");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { meterValidate } = require("../../middleware/meter_validate");

module.exports.meterRouter = Router()
    .get('/list', adminToken_superToken, getListMeter)
    .get('/one/:id', adminToken_superToken, getOneMeter)
    .get('/params/:type', adminToken_superToken, paramsList)
    .get('/meter-list', adminToken_superToken, meterList)
    .get('/port-list', adminToken_superToken, portList)
    .post('/create', adminToken_superToken, meterValidate(createMeterJoi), createMeter)
    .patch('/update/:id', adminToken_superToken, meterValidate(updateMeterJoi), updateMeter)
    .delete('/remove-meter/:id', removeMeter)
    .delete('/remove-folder/:id', removeFolder)
