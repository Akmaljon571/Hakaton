const { Router } = require("express");
const { allGM, singleGM } = require("../../controller/server/gm");

module.exports.routerGM = Router()
    .get('/all', allGM)
    .get('/single/:id', singleGM)