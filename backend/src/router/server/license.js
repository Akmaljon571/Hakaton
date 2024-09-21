const { Router } = require("express");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");
const { getDesktopData, newLicense, getLicenseData } = require("../../controller/server/license");

module.exports.licenseRouter = Router()
    .get('/data', adminToken_superToken, getLicenseData)
    .get('/data-desktop', adminToken_superToken, getDesktopData)
    .post('/new-license', adminToken_superToken, newLicense)
