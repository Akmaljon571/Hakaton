const CustomError = require("../../utils/custom_error")
const repo = require("../../repository")

module.exports.getLastInsertedJournal = async (req, res) => {
    try {
        const lastInsertedDocument = await repo.repositories().journalRepository().findLastInserted(req.params)

        res.status(200).json({ status: 200, error: null, data: lastInsertedDocument })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getLastSuccessfullyInsertedJournal = async (req, res) => {
    try {
        const lastInsertedDocument = await repo.repositories().journalRepository().findLastSuccesfullyInserted(req.params)

        res.status(200).json({ status: 200, error: null, data: lastInsertedDocument })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}

module.exports.getJournalList = async (req, res) => {
    try {
        const documentsOfJournal = await repo.repositories().journalRepository().findAll(req.params)

        res.status(200).json({ status: 200, error: null, data: documentsOfJournal })
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
}
