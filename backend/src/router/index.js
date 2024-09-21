const { Router } = require("express");
const { loginRouter } = require("./auth/login");
const { adminRouter } = require("./admin/admin");
const { meterRouter } = require("./meter/meter");
const { notFound } = require("../controller");
const { billingRouter } = require("./server/billing");
const { folderRouter } = require("./server/folder");
const { journalRouter } = require("./server/journal");
const { dashboardRouter } = require("./graphics/dashboard");
const { graphRouter } = require("./graphics/graph");
const { vectorRouter } = require("./graphics/vector");
const { calculationRouter } = require("./electricity/calculation_object");
const { electRouter } = require("./electricity/elect_object");
const { routerGM } = require("./server/gm");
const { checkPort } = require("./server/check_port");
const { sendMessage } = require("../controller/server/send_message");
const { eventRouter } = require("./server/events");
const { licenseRouter } = require("./server/license");
const { routerSchema } = require("./server/schema");

module.exports.router = Router()
    .use('/', loginRouter)
    .use('/admin', adminRouter)
    .use('/meter', meterRouter)
    .use('/billing', billingRouter)
    .use('/folder', folderRouter)
    .use('/journal', journalRouter)
    .use('/graph', graphRouter)
    .use('/license', licenseRouter)
    .use('/electricity', electRouter)
    .use('/vector', vectorRouter)
    .use('/event', eventRouter)
    .use('/calculation', calculationRouter)
    .use('/dashboard', dashboardRouter)
    .use('/gm', routerGM)
    .use('/mnemo-schema', routerSchema)
    .use('/port', checkPort)
    .use('/send-message', sendMessage)
    .use('/*', notFound)
