const { Router } = require("express");
const { getQuery, createElectFolder, createElectMeter, updateElectFolder, updateElectMeter, attachParamsElectJoi } = require("../../validation/elect_object");
const { getElectricityObjects, getSingleElectricityObject, listUseMeterElectFn, insertPapka, insertMeter, updateFolderFn, updateMeterFn, attachParamsElectFN, deleteElect, factories, getFirstTemplate, getSecondTemplateReport, getThirdTemplateReport, getFourthTemplateReport } = require("../../controller/electricity/electricity_object");
const { firstReportJoi, secondReportJoi } = require("../../validation/billing");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { validateQuery } = require("../../middleware/validate_query");
const { adminToken } = require("../../middleware/admin_token");
const { validate } = require("../../middleware/validate");

module.exports.electRouter = Router()
    .get('/list', adminToken_superToken, getElectricityObjects)
    .get('/meter-use', adminToken_superToken, listUseMeterElectFn)
    .get('/factories', adminToken_superToken, factories)
    .get('/report/:id', adminToken_superToken, validateQuery(firstReportJoi), getFirstTemplate)
    .get('/report-second/:id', adminToken_superToken, validateQuery(secondReportJoi), getSecondTemplateReport)
    .get('/report-third/:id', adminToken_superToken, validateQuery(secondReportJoi), getThirdTemplateReport)
    .get('/report-fourth/:id', adminToken_superToken, validateQuery(secondReportJoi), getFourthTemplateReport)
    .get('/single/:id', adminToken_superToken, validateQuery(getQuery), getSingleElectricityObject)
    .post('/create-folder', adminToken, validate(createElectFolder), insertPapka)
    .post('/create-meter', adminToken, validate(createElectMeter), insertMeter)
    .put('/update-folder/:id', adminToken, validate(updateElectFolder), updateFolderFn)
    .put('/update-meter/:id', adminToken, validate(updateElectMeter), updateMeterFn)
    .patch('/attach-params/:id', adminToken, validate(attachParamsElectJoi), attachParamsElectFN)
    .delete('/delete/:id', adminToken, deleteElect)
