const CustomError = require("../../utils/custom_error")
const { authModel } = require("../../models");

module.exports.authRepository = () => {
    return Object.freeze({
        insert,
        findOne,
        remove,
    })

    async function insert(data) {
        try {
            return await authModel.create(data)
        } catch (err) {
            throw new CustomError(500, err.message)
        }
    }

    async function findOne(check) {
        try {
            return await authModel.findOne(check)
        } catch (error) {
            throw new CustomError(500, err.message)
        }
    }

    async function remove(check) {
        try {
            return await authModel.deleteOne(check)
        } catch (error) {
            throw new CustomError(500, err.message)
        }
    }
}