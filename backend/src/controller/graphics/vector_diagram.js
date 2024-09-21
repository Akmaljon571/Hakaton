const CustomError = require("../../utils/custom_error")
const repo = require("../../repository")
const { sortvalueObjectsForVectorDiagram } = require("../../utils/sortvalue_bydate")

module.exports.getVectorDiagramData = async (req, res) => {
    try {
        const { id } = req.params
        const query = req.data

        const digramDocuments = await repo.repositories().electObjectRepository().findOneVectorDiagram(id, query)
        let result = new Map()
        if (digramDocuments && ['meter', 'feeder'].includes(digramDocuments.type) && digramDocuments.parameters[0]) {
            result = await sortvalueObjectsForVectorDiagram(digramDocuments.parameters, query, digramDocuments._id, digramDocuments.multiply)
        }

        res.status(200).json({ status: 200, error: null, data: Object.fromEntries(result), finish: digramDocuments.finish })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}
