const { Router } = require("express");
const { getElectricityObjectsCalculation, getSingleElectricityObjectCalculation, insertPapkaCalculation, updateFolderCalculationFn, attachParamsCalculationFN, deleteCalculation, calculationMain, getFirstTemplateReport, getSecondTemplateReport, getFourthTemplateReport, getThirdTemplateReport } = require("../../controller/electricity/calculation_object");
const { creatCalculationFolder, updateCalculationFolder } = require("../../validation/calculation_object");
const { firstReportJoi, secondReportJoi } = require("../../validation/billing");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { attachParamsElectJoi } = require("../../validation/elect_object");
const { validateQuery } = require("../../middleware/validate_query");
const { adminToken } = require("../../middleware/admin_token");
const { validate } = require("../../middleware/validate");

module.exports.calculationRouter = Router()
    .get('/list', adminToken_superToken, getElectricityObjectsCalculation)
    .get('/single/:id', adminToken_superToken, getSingleElectricityObjectCalculation)
    .get('/factories', adminToken_superToken, calculationMain)
    .get('/report/:id', adminToken_superToken, validateQuery(firstReportJoi), getFirstTemplateReport)
    .get('/report-second/:id', adminToken_superToken, validateQuery(secondReportJoi), getSecondTemplateReport)
    .get('/report-third/:id', adminToken_superToken, validateQuery(secondReportJoi), getThirdTemplateReport)
    .get('/report-fourth/:id', adminToken_superToken, validateQuery(secondReportJoi), getFourthTemplateReport)
    .post('/create', adminToken, validate(creatCalculationFolder), insertPapkaCalculation)
    .put('/update/:id', adminToken, validate(updateCalculationFolder), updateFolderCalculationFn)
    .patch('/attach-params/:id', adminToken, validate(attachParamsElectJoi), attachParamsCalculationFN)
    .delete('/delete/:id', adminToken, deleteCalculation)
