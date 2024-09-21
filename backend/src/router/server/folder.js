const { Router } = require("express");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { validateQuery } = require("../../middleware/validate_query");
const { getSingleFolder, getListFolders, createFolder, folderStatus, updateFolder, getParentFolder } = require("../../controller/server/folder");
const { folderGetJoi, folderCreateJoi, folderUpdateJoi } = require("../../validation/folder");
const { validate } = require("../../middleware/validate");

module.exports.folderRouter = Router()
    .get('/list', adminToken_superToken, validateQuery(folderGetJoi), getListFolders)
    .get('/one/:id', adminToken_superToken, getSingleFolder)
    .get('/parents-list', getParentFolder)
    .get('/status/:id', adminToken_superToken, folderStatus)
    .post('/create', adminToken_superToken, validate(folderCreateJoi), createFolder)
    .patch('/update/:id', adminToken_superToken, validate(folderUpdateJoi), updateFolder)
