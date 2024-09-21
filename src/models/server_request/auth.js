const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
    session_id: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
    a_t_created_date: { type: Date },
    session_created_date: { type: Date },
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "admins" }
})

module.exports.authModel = mongoose.model("auth", authSchema)
