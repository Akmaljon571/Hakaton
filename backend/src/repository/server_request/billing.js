const mongoose = require("mongoose");
const CustomError = require("../../utils/custom_error");
const repo = require("..");
const { electObjectModel, meterModel, billingModel } = require("../../models");
const { feederRepository } = require("./feeder");

module.exports.billingRepository = () => {
  return Object.freeze({
    insert,
    findYesterday,
    findList,
    findLast,
    list,
    find
  })

  async function insert(args) {
    try {
      const newJournalDocument = await billingModel.insertMany(args)
      return newJournalDocument[0]
    } catch (err) {
      throw new CustomError(500, err.message)
    }
  }

  async function findYesterday(id) {
    try {
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0)
      yesterday.setDate(new Date().getDate() - 1)

      const document = await billingModel.findOne({ meter_id: new mongoose.Types.ObjectId(id), date: yesterday })
      return document
    } catch (err) {
      throw new CustomError(500, err.message)
    }
  }

  async function findLast(id) {
    try {
      const document = await billingModel.find({ meter_id: new mongoose.Types.ObjectId(id), date: { $lte: new Date() } })
      return document[0]
    } catch (err) {
      throw new CustomError(500, err.message)
    }
  }

  async function find(id) {
    try {
      const document = await billingModel.find({ meter_id: new mongoose.Types.ObjectId(id) })

      return document[0]
    } catch (err) {
      throw new CustomError(500, err.message)
    }
  }

  async function findList(id, oneDate, twoDate) {
    try {
      const element = await electObjectModel.findById(id)
      if (!element || !element.type) throw new CustomError(404, "Bunday ElectObjectModel yo`q")

      const feeders = {}
      const result = {}
      element.type === 'meter' || element.type === 'feeder' ? await callbackFeeder() : await callback(id)

      const sDate = new Date(oneDate);
      const fDate = new Date(twoDate);
      sDate.setHours(0, 0, 0, 0)
      fDate.setHours(0, 0, 0, 0)

      for (const key in feeders) {
        if (feeders[key].meter_id) {
          const feederDB = await feederRepository().findFeeder(key)
          if (feederDB && Array.isArray(feederDB.date) && feederDB.date.length > 1) {
            let variableDate = sDate
            let TN, TT
            for (const i in feederDB.date) {
              const date = feederDB.date[i]
              if (variableDate - date <= 0 && fDate - date > 0 && i != 0) {
                const dateOneDayAgo = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
                await createMeter(
                  feeders[key].meter_id,
                  feeders[key].feederName,
                  feeders[key].parent,
                  TT ? TT : { dividend: feederDB.VT[i].dividend, divisor: feederDB.VT[i].divisor },
                  TN ? TN : { dividend: feederDB.CT[i].dividend, divisor: feederDB.CT[i].divisor },
                  variableDate,
                  dateOneDayAgo
                )
                variableDate = date
                TT = { dividend: feederDB.VT[i].dividend, divisor: feederDB.VT[i].divisor }
                TN = { dividend: feederDB.CT[i].dividend, divisor: feederDB.CT[i].divisor }
              } else if (i == 0) {
                TT = { dividend: feederDB.VT[i].dividend, divisor: feederDB.VT[i].divisor }
                TN = { dividend: feederDB.CT[i].dividend, divisor: feederDB.CT[i].divisor }
              }
            }
            const value = feeders[key]
            await createMeter(value.meter_id, value.feederName, value.parent, value.TT, value.TN, variableDate, fDate)
          } else {
            const value = feeders[key]
            await createMeter(value.meter_id, value.feederName, value.parent, value.TT, value.TN, sDate, fDate)
          }
        }
      }

      async function callback(id) {
        const find = await electObjectModel.find({ parent_object: id });
        for (let i = 0; i < find.length; i++) {
          const currentItem = find[i];
          if (currentItem.type === 'feeder') {
            feeders[currentItem._id] = { feederName: currentItem.name, parent: String(currentItem.parent_object) }
          }

          if (currentItem.type === 'meter') {
            feeders[currentItem.parent_object] = {
              ...feeders[currentItem.parent_object],
              TT: currentItem.vt,
              TN: currentItem.ct,
              meter_id: String(currentItem.meter_id)
            }
          } else {
            await callback(currentItem._id);
          }
        }
      }

      async function callbackFeeder() {
        if (element.type == 'feeder') {
          const childMeter = await electObjectModel.findOne({ parent_object: element._id }) || {};
          feeders[element._id] = {
            feederName: element.name,
            parent: String(element.parent_object),
            meter_id: String(childMeter.meter_id),
            TT: childMeter.vt,
            TN: childMeter.ct
          }
        } else {
          const parentFeeder = await electObjectModel.findById({ _id: element.parent_object });
          feeders[parentFeeder._id] = {
            feederName: parentFeeder.name,
            parent: String(parentFeeder.parent_object),
            meter_id: String(element.meter_id),
            TT: element.vt,
            TN: element.ct
          }
        }
      }

      async function createMeter(meter_id, feederName, parent, TT, TN, date1 = 0, date2 = 0) {
        const meter = await meterModel.findById(meter_id)
        const billing = await billingModel.find({ meter_id })
        const oneData = billing.find(e => new Date(e.date) - date1 == 0) || {}
        const twoData = billing.find(e => new Date(e.date) - date2 == 0) || {}

        if (!Array.isArray(result[parent])) {
          result[parent] = []
        }

        result[parent].push({
          nomer: meter ? meter.number_meter : "",
          feeder: feederName,
          TT,
          TN,
          location: await repo.repositories().electObjectRepository().findLocation(parent),
          day1_A1: oneData.summa_A1 == undefined ? null : oneData.summa_A1,
          day1_A0: oneData.summa_A0 == undefined ? null : oneData.summa_A0,
          day1_R0: oneData.summa_R0 == undefined ? null : oneData.summa_R0,
          day1_R1: oneData.summa_R1 == undefined ? null : oneData.summa_R1,
          day2_A1: twoData.summa_A1 == undefined ? null : twoData.summa_A1,
          day2_A0: twoData.summa_A0 == undefined ? null : twoData.summa_A0,
          day2_R0: twoData.summa_R0 == undefined ? null : twoData.summa_R0,
          day2_R1: twoData.summa_R1 == undefined ? null : twoData.summa_R1,
          tarif1_A1: oneData.tarif1_A1 != undefined && twoData.tarif1_A1 != undefined ? twoData.tarif1_A1 - oneData.tarif1_A1 : null,
          tarif2_A1: oneData.tarif2_A1 != undefined && twoData.tarif2_A1 != undefined ? twoData.tarif2_A1 - oneData.tarif2_A1 : null,
          tarif3_A1: oneData.tarif3_A1 != undefined && twoData.tarif3_A1 != undefined ? twoData.tarif3_A1 - oneData.tarif3_A1 : null,
          tarif4_A1: oneData.tarif4_A1 != undefined && twoData.tarif4_A1 != undefined ? twoData.tarif4_A1 - oneData.tarif4_A1 : null,
          tarif1_A0: oneData.tarif1_A0 != undefined && twoData.tarif1_A0 != undefined ? twoData.tarif1_A0 - oneData.tarif1_A0 : null,
          tarif2_A0: oneData.tarif2_A0 != undefined && twoData.tarif2_A0 != undefined ? twoData.tarif2_A0 - oneData.tarif2_A0 : null,
          tarif3_A0: oneData.tarif3_A0 != undefined && twoData.tarif3_A0 != undefined ? twoData.tarif3_A0 - oneData.tarif3_A0 : null,
          tarif4_A0: oneData.tarif4_A0 != undefined && twoData.tarif4_A0 != undefined ? twoData.tarif4_A0 - oneData.tarif4_A0 : null,
          tarif1_R1: oneData.tarif1_R1 != undefined && twoData.tarif1_R1 != undefined ? twoData.tarif1_R1 - oneData.tarif1_R1 : null,
          tarif2_R1: oneData.tarif2_R1 != undefined && twoData.tarif2_R1 != undefined ? twoData.tarif2_R1 - oneData.tarif2_R1 : null,
          tarif3_R1: oneData.tarif3_R1 != undefined && twoData.tarif3_R1 != undefined ? twoData.tarif3_R1 - oneData.tarif3_R1 : null,
          tarif4_R1: oneData.tarif4_R1 != undefined && twoData.tarif4_R1 != undefined ? twoData.tarif4_R1 - oneData.tarif4_R1 : null,
          tarif1_R0: oneData.tarif1_R0 != undefined && twoData.tarif1_R0 != undefined ? twoData.tarif1_R0 - oneData.tarif1_R0 : null,
          tarif2_R0: oneData.tarif2_R0 != undefined && twoData.tarif2_R0 != undefined ? twoData.tarif2_R0 - oneData.tarif2_R0 : null,
          tarif3_R0: oneData.tarif3_R0 != undefined && twoData.tarif3_R0 != undefined ? twoData.tarif3_R0 - oneData.tarif3_R0 : null,
          tarif4_R0: oneData.tarif4_R0 != undefined && twoData.tarif4_R0 != undefined ? twoData.tarif4_R0 - oneData.tarif4_R0 : null,
        })
      }

      return result;
    } catch (error) {
      console.log(error, 'mana')
      throw new CustomError(error.status, error.message);
    }
  }

  async function list(id, oneDate, twoDate) {
    try {
      const sDate = new Date(oneDate);
      const fDate = new Date(twoDate);
      sDate.setHours(0, 0, 0, 0)
      fDate.setHours(0, 0, 0, 0)

      return await billingModel.aggregate([
        { $match: { date: { $lte: fDate, $gte: sDate }, meter_id: new mongoose.Types.ObjectId(id) } },
        { $sort: { date: -1 } },
        { $limit: 150 }
      ])
    } catch (error) {
      throw new CustomError(error.status, error.message);
    }
  }
}
