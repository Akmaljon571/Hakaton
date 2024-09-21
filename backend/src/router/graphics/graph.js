const { Router } = require("express");
const { getGraphsAndObjectDataArchive, getGraphsAndObjectCurrent, getGraphsAndObjectDataCalculationArchive, getGraphsAndObjectDataCalculationCurrent } = require("../../controller/graphics/graphs_object_data");
const { getGraphDataList, getGraphDataListCalculation, getGraphDataListFull, getGraphDataListCalculationFull } = require("../../controller/graphics/data_list");
const { graphArchive, tableData, tableDataFull } = require("../../validation/graph");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { validateQuery } = require("../../middleware/validate_query");

module.exports.graphRouter = Router()
    .get('/data/:id', adminToken_superToken, validateQuery(tableData), getGraphDataList)
    .get('/data-calculation/:id', adminToken_superToken, validateQuery(tableData), getGraphDataListCalculation)
    .get('/data-list/:id', adminToken_superToken, validateQuery(tableDataFull), getGraphDataListFull)
    .get('/data-calculation-list/:id', adminToken_superToken, validateQuery(tableDataFull), getGraphDataListCalculationFull)
    .get('/data-archive/:id', adminToken_superToken, validateQuery(graphArchive), getGraphsAndObjectDataArchive)
    .get('/data-current/:id', adminToken_superToken, validateQuery(graphArchive), getGraphsAndObjectCurrent)
    .get('/calculation-archive/:id', adminToken_superToken, validateQuery(graphArchive), getGraphsAndObjectDataCalculationArchive)
    .get('/calculation-current/:id', adminToken_superToken, validateQuery(graphArchive), getGraphsAndObjectDataCalculationCurrent)
