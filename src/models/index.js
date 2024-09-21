const { meterModel } = require("./server_request/meter")
const { currentModel } = require("./server_request/current")
const { archiveModel } = require("./server_request/archive")
const { parameterModel } = require("./server_request/parameter")
const { adminModel } = require("./admin")
const { electObjectModel } = require("./objects/elect_object")
const { calculationObjectModel } = require("./objects/calculation_object")
const { folderModel } = require("./server_request/folder")
const { journalModel } = require("./server_request/journal")
const { billingModel } = require("./server_request/billing")
const { previousModel } = require('./server_request/previous_data')
const { authModel } = require('./server_request/auth')
const { feederModel } = require('./server_request/feeder')
const { lastCurrentModel } = require("./server_request/last_current")
const { lastJoinModel } = require("./server_request/last_join")
const { eventModel } = require("./server_request/event")
const { logModel } = require("./server_request/app_log")

module.exports = Object.freeze({
    meterModel,
    parameterModel,
    currentModel,
    archiveModel,
    adminModel,
    electObjectModel,
    eventModel,
    calculationObjectModel,
    folderModel,
    journalModel,
    billingModel,
    previousModel,
    authModel,
    feederModel,
    lastCurrentModel,
    lastJoinModel,
    logModel
})
