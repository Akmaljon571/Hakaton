const mongoose = require("mongoose")

const portErrorsSchema = new mongoose.Schema({
    message: String
})

module.exports.portErrors = mongoose.model("port_errors", portErrorsSchema)
