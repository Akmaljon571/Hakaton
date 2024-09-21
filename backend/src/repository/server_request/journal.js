const mongoose = require("mongoose");
const CustomError = require("../../utils/custom_error")
const repo = require("..");
const { journalModel, lastJoinModel } = require("../../models");
const { sendEventMessage } = require("../../controller/server/send_message");

module.exports.journalRepository = () => {
  return Object.freeze({
    insert,
    insertManualRequest,
    findLastInserted,
    findLastSuccesfullyInserted,
    updateManualRequest,
    findAll,
    update,
    updateBody
  })

  async function insert(args) {
    try {
      if (args.request_type != 'connect') sendEventMessage({ id: args.meter, status: args.status, where: args.request_type })

      if (args.request_type == "connect" && args.status == 'failed') {
        updateLastJoin = { status: args.status, archive: 'failed', current: "failed", event: "failed" }
        await repo.repositories().lastJoinRepository().update(args.meter, updateLastJoin)
        await repo.repositories().lastCurrentRepository().updateFailed({ meter_id: args.meter })
      }

      const newJournalDocument = await journalModel.insertMany(args)
      if (!await repo.repositories().lastJoinRepository().findWithMeter(args.meter)) {
        await repo.repositories().lastJoinRepository().insertMany(args)
      } else {
        await repo.repositories().lastJoinRepository().update(args.meter, { status: args.status, request_type: args.request_type })
      }
      return newJournalDocument[0]
    } catch (err) {
      console.log(err)
      throw new CustomError(err.status, err.message)
    }
  }

  async function insertManualRequest(id, meter) {
    try {
      return await journalModel.create({
        status: "sent",
        request_type: "manual_request",
        manual_request: id,
        meter
      })
    } catch (err) {
      console.log(err)
      throw new CustomError(err.status, err.message)
    }
  }

  async function updateManualRequest(id, status, message) {
    try {
      return await journalModel.updateOne({ _id: new mongoose.Types.ObjectId(id) }, { status, message })
    } catch (err) {
      console.log(err)
      throw new CustomError(err.status, err.message)
    }
  }

  async function update(args) {
    try {
      const updateLastJoin = args.request_type == 'archive' ?
        { status: args.status, archive: args.status } :
        args.request_type == 'current' ?
          { status: args.status, current: args.status } :
          args.request_type == 'event' ?
            { status: args.status, event: args.status } :
            { status: args.status }

      if (args.request_type == "connect" && args.status == 'failed') {
        updateLastJoin = { status: args.status, archive: 'failed', current: "failed", event: "failed" }
        await repo.repositories().lastCurrentRepository().updateFailed({ meter_id: args.meter })
      }

      if (args.request_type == 'archive' && args.status == 'succeed') {
        updateLastJoin.archive_date = args.date
      } else if (args.request_type == 'current' && args.status == 'succeed') {
        updateLastJoin.current_date = new Date()
      }

      if (args.request_type != 'connect') sendEventMessage({ id: args.meter, status: args.status, where: args.request_type })
      await repo.repositories().lastJoinRepository().update(args.meter, updateLastJoin)
      const updatedDocument = await journalModel.updateOne({ _id: new mongoose.Types.ObjectId(args._id) }, { status: args.status, message: args.message })
      return updatedDocument
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function updateBody(args) {
    try {
      return await journalModel.updateOne({ _id: new mongoose.Types.ObjectId(args._id) }, { message: args.message, body: args.body })
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function findLastInserted(args) {
    try {
      const lastInsertedArchiveDocument = await journalModel.find({ meter: new mongoose.Types.ObjectId(args.meter_id), request_type: "archive" }).sort({ "createdAt": -1 }).limit(1)
      const lastInsertedCurrentDocument = await journalModel.find({ meter: new mongoose.Types.ObjectId(args.meter_id), request_type: "current" }).sort({ "createdAt": -1 }).limit(1)
      if (!lastInsertedArchiveDocument && !lastInsertedCurrentDocument) throw new CustomError(404, 'Meter Not Found')
      return { lastInsertedArchiveDocument, lastInsertedCurrentDocument }
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }

  async function findLastSuccesfullyInserted(args) {
    try {
      const journal = await lastJoinModel.findOne({ meter: args.meter_id })
      const lastInsertedArchiveDocument = [
        {
          request_type: "archive",
          meter: args.meter_id,
          status: "succeed",
          createdAt: journal ? journal.archive_date : undefined,
          updatedAt: undefined
        }
      ]

      const lastInsertedCurrentDocument = [
        {
          request_type: "archive",
          meter: args.meter_id,
          status: "succeed",
          createdAt: journal ? journal.current_date : undefined,
          updatedAt: undefined
        }
      ]

      return { lastInsertedArchiveDocument, lastInsertedCurrentDocument }
    } catch (err) {
      console.log(err)
      throw new CustomError(err.status, err.message)
    }
  }

  async function findAll(args) {
    try {

      const journalDocuments = await journalModel.find({ meter: new mongoose.Types.ObjectId(args.meter_id) }).sort({ "createdAt": -1 })
      return journalDocuments
    } catch (err) {
      throw new CustomError(err.status, err.message)
    }
  }
}