const { Router } = require("express");
const { adminToken } = require("../../middleware/admin_token");
const { validate } = require("../../middleware/validate");
const { createAdminJoi, validatorUpdateAdmin } = require("../../validation/admin");
const { createAdmin, listActive, updateAdmin, activeAdmin, deleteAdmin } = require("../../controller/admin/admin");
const { adminToken_superToken } = require("../../middleware/admin_or_super_token");

module.exports.adminRouter = Router()
    .get('/list', adminToken_superToken, listActive)
    .post('/create', adminToken, validate(createAdminJoi), createAdmin)
    .patch('/update/:id', adminToken_superToken, validate(validatorUpdateAdmin), updateAdmin)
    .put('/activate/:id', adminToken, activeAdmin)
    .delete('/remove/:id', adminToken, deleteAdmin)
