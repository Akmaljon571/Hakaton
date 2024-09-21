const CustomError = require("../utils/custom_error")
const { adminModel } = require("../models")

module.exports.adminRepository = () => {
    return Object.freeze({
        findAll,
        findById,
        insert,
        remove,
        active,
        update,
        findOne,
        countDocuments
    })

    async function countDocuments(args) {
        try {
            return await adminModel.countDocuments(args)
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findAll() {
        const admins = await adminModel.find().exec()
        return admins
    }
    async function findById(id) {
        const admins = await adminModel.findOne({ _id: id }, null, { lean: true })
        return admins
    }
    async function findOne(query) {
        const admins = await adminModel.findOne(query)
        return admins
    }
    async function insert(args) {
        const admins = await adminModel.create(args)
        return admins
    }
    async function update(id, args) {
        const admins = await adminModel.updateOne({ _id: id }, { ...args })
        return admins
    }
    async function remove(id) {
        const admins = await adminModel.updateOne({ _id: id }, { active: false })
        return admins
    }
    async function active(id) {
        const admins = await adminModel.updateOne({ _id: id }, { active: true })
        return admins
    }
}