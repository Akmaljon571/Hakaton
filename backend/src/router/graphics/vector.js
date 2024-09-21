const { Router } = require("express");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { validateQuery } = require("../../middleware/validate_query");
const { getVectorDiagramData } = require("../../controller/graphics/vector_diagram");
const { vector } = require("../../validation/graph");

module.exports.vectorRouter = Router()
    .get('/data/:id', adminToken_superToken, validateQuery(vector), getVectorDiagramData)
