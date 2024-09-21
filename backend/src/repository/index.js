const { meterRepository } = require("./server_request/meter")
const { parameterRepository } = require("./server_request/parameter")
const { adminRepository } = require("./admin")
const { electObjectRepository } = require("./objects/elect_object")
const { calculationObjectRepository } = require("./objects/calculation_object")
const { folderObjectRepository } = require("./server_request/folder")
const { journalRepository } = require("./server_request/journal")
const { billingRepository } = require("./server_request/billing")
const { previousObjectRepository } = require('./server_request/previous_data')
const { authRepository } = require('./server_request/auth')
const { feederRepository } = require('./server_request/feeder')
const { gmRepository } = require('./server_request/gm')
const { lastCurrentRepository } = require("./server_request/last_current")
const { currentRepository } = require("./server_request/current")
const { archiveRepository } = require("./server_request/archive")
const { lastJoinRepository } = require("./server_request/last_join")
const { eventRepository } = require("./server_request/event")
const { logRepository } = require("./server_request/app_log")

module.exports.repositories = function () {
    return Object.freeze({
        meterRepository,
        parameterRepository,
        currentRepository,
        archiveRepository,
        adminRepository,
        electObjectRepository,
        calculationObjectRepository,
        folderObjectRepository,
        journalRepository,
        billingRepository,
        previousObjectRepository,
        authRepository,
        eventRepository,
        feederRepository,
        gmRepository,
        lastCurrentRepository,
        lastJoinRepository,
        logRepository
    })
}
