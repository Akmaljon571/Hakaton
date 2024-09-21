const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
    name: String,
    password: String,
    login: { type: String, unique: true },
    active: { type: Boolean, default: true },
    last_active: { type: String, default: '' },
    open_page: [{ type: String, default: [] }],
    open_folders: [{ type: String, default: [] }],
    open_factory: [{ type: String, default: [] }],
    role: { type: String, enum: ["super", "admin"], default: "super" },
})

module.exports.adminModel = mongoose.model("admin", adminSchema)