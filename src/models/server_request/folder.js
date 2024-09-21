const mongoose = require("mongoose")
const folderSchema = new mongoose.Schema({
    name: {
        type: String
    },
    folder_type: {
        type: String,
        enum: ["folder", "meter"]
    },
    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "folders"
    },
    meter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "meter"
    }
})

module.exports.folderModel = mongoose.model("folders", folderSchema)
