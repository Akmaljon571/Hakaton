const { adminRepository } = require("./admin")

module.exports.repositories = function () {
    return Object.freeze({
        adminRepository,
    })
}
