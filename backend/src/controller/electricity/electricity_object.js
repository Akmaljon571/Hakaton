const CustomError = require("../../utils/custom_error")
const repo = require("../../repository")
const { formatParamsList } = require("../../global/file-path")
const { sortvalueObjectsForFirstReport, sortvalueObjectsForSecondReport } = require("../../utils/sortvalue_bydate")
const { energytotal, currentFindArchive, energyarchive } = require("../../global/variable")
const { uniqueShortNames, obisFilter } = require("../../utils/unique_short-names")
const { electModel, electType } = require("../../global/enum")

module.exports.getElectricityObjects = async (req, res) => {
   try {
      const { list } = req
      const objectDocuments = await repo.repositories().electObjectRepository().findAll({ type: "factory", list })

      res.status(200).json({ status: 200, error: null, data: objectDocuments })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.getSingleElectricityObject = async (req, res) => {
   try {
      const { id } = req.params

      const objectDocument = await repo.repositories().electObjectRepository().findOne(id, req.data)
      if (!objectDocument) return res.status(200).json({ status: 200, error: null, data: {} })
      const formatParams = formatParamsList()

      let obisList = {}
      formatParams.indicators.map(e => uniqueShortNames(objectDocument.parameters, objectDocument.type).includes(e.param_short_name) ? obisList[e.param_short_name] = obisFilter(e.channel_full_id) : "").filter(e => e)

      const block = formatParams.indicators_block.filter(e => Object.values(obisList).includes(e.channel_full_id))
      objectDocument.params = uniqueShortNames(objectDocument.parameters, objectDocument.type)
      objectDocument.block = block
      objectDocument.obis = obisList

      const location = await repo.repositories().electObjectRepository().findLocation(id)
      res.status(200).json({ status: 200, error: null, data: objectDocument, location })
   } catch (err) {
      console.log(err)
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.factories = async (req, res) => {
   try {
      const data = await repo.repositories().electObjectRepository().factory()

      res.status(200).json({ status: 200, error: null, data })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.getFirstTemplate = async (req, res) => {
   try {
      const { id } = req.params
      const { date1, date2, step } = req.data

      const find = await repo.repositories().electObjectRepository().findById(id)
      if (!find) throw new CustomError(404, "Elect not found")

      const pages = await repo.repositories().electObjectRepository().firstTemplateReport(id, date1, date2, step)
      let reportData = {}
      if (pages) reportData = await sortvalueObjectsForFirstReport(pages, find._id, step, date1, date2)

      const data = {
         data: reportData,
         location: await repo.repositories().electObjectRepository().findLocation(id)
      }

      res.status(200).json({ status: 200, error: null, data })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.getSecondTemplateReport = async (req, res) => {
   try {
      const { id } = req.params
      const { date1, date2 } = req.data

      const find = await repo.repositories().electObjectRepository().findById(id)
      if (!find) throw new CustomError(404, "Elect not found")

      const date1Format = new Date(date1)
      const dateFormat = new Date(date2)
      date1Format.setDate(date1Format.getDate() - 1)
      dateFormat.setDate(dateFormat.getDate() + 1)

      const pages = await repo.repositories().electObjectRepository().secondTemplateReport(id, date1Format, dateFormat)
      let reportData = {}
      if (pages) reportData = await sortvalueObjectsForSecondReport(pages.parameters, find._id, date1, date2)

      const data = {
         data: reportData,
         location: await repo.repositories().electObjectRepository().findLocation(id)
      }

      res.status(200).json({ status: 200, error: null, data })
   } catch (err) {
      console.log(err)
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.getThirdTemplateReport = async (req, res) => {
   try {
      const { id } = req.params
      const { date1, date2 } = req.data

      const find = await repo.repositories().electObjectRepository().findById(id)
      if (!find) throw new CustomError(404, "Elect not found")
      if (["meter", 'feeder'].includes(find.type)) throw new CustomError(400, "achot for feeder and meter does not work")

      const data = await repo.repositories().electObjectRepository().thirdTemplateReport(id, date1, date2)
      const location = await repo.repositories().electObjectRepository().findLocation(id)

      res.status(200).json({ status: 200, error: null, data, location })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.getFourthTemplateReport = async (req, res) => {
   try {
      const { id } = req.params
      const { date1, date2 } = req.data

      const find = await repo.repositories().electObjectRepository().findById(id)
      if (!find) throw new CustomError(404, "Elect not found")
      if (["meter", 'feeder'].includes(find.type)) throw new CustomError(400, "achot for feeder and meter does not work")

      const data = await repo.repositories().electObjectRepository().fourthTemplateReport(id, date1, date2)
      const location = await repo.repositories().electObjectRepository().findLocation(id)

      res.status(200).json({ status: 200, error: null, data, location })
   } catch (err) {
      console.log(err)
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.listUseMeterElectFn = async (req, res) => {
   try {
      const data = await repo.repositories().electObjectRepository().listUse()

      res.status(200).json({ status: 200, error: null, data })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.insertPapka = async (req, res) => {
   try {
      const args = req.result

      if (args.parent_object) {
         const parentObject = await repo.repositories().electObjectRepository().findById(args.parent_object)
         if (!parentObject) return new CustomError(404, 'Parent Not Found')

         const obj = {
            substation: [0, 1],
            tire_section: [0, 1, 2],
            feeder: [0, 1, 2],
         }

         const index = electType.findIndex((e) => e === parentObject.type)
         if (!obj[args.type] || !obj[args.type].includes(index)) throw new CustomError(400, 'Parent Bad Request')
      }

      const newObj = await repo.repositories().electObjectRepository().insert(args)
      await repo.repositories().logRepository().create(req, newObj._id, "Electricity create")
      res.status(201).json({ status: 201, error: null, data: "Successful Created" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.insertMeter = async (req, res) => {
   try {
      const args = req.result

      const parentObject = await repo.repositories().electObjectRepository().findById(args.parent_object)
      if (!parentObject || parentObject.type != "feeder")
         return new CustomError(404, 'Parent Not Found Or Parent type != feeder')
      if (await repo.repositories().electObjectRepository().findParentMeter(args.parent_object))
         return new CustomError(400, 'Parent Feeder already use meter')
      if (await repo.repositories().electObjectRepository().findMeter(args.meter_id))
         return new CustomError(400, 'Meter already use')

      const paramerts_list = await repo.repositories().parameterRepository().findMeter({ meter: args.meter_id })
      const parametersFeeder = {}
      const parametersMeter = {}

      paramerts_list.map(e => {
         if (e.status == 'active' || e.parameter_type === 'archive') {
            parametersFeeder[e.param_short_name] = true
            parametersMeter[e.param_short_name] = true
         }
      })

      const newFeederParams = {
         meter: args.meter_id,
         params_meter: {},
         params_feeder: parametersFeeder,
         multiply: args.multiply
      }
      await repo.repositories().electObjectRepository().insertParentParams(parentObject._id, newFeederParams)
      const newObj = {
         name: args.name,
         type: args.type,
         parent_object: args.parent_object,
         meter_id: args.meter_id,
         vt: args.vt,
         ct: args.ct,
         parameters: {
            meter: args.meter_id,
            params_meter: parametersMeter,
            params_feeder: {},
            multiply: [1]
         }
      }

      await repo.repositories().feederRepository().insert({ date: args.date, multiply: args.multiply, feeder: parentObject._id, vt: args.vt, ct: args.ct })
      const newElect = await repo.repositories().electObjectRepository().insert(newObj)
      await repo.repositories().logRepository().create(req, newElect._id, "Electricity create")
      res.status(201).json({ status: 201, error: null, data: "Successful Created" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.updateFolderFn = async (req, res) => {
   try {
      const { id } = req.params
      await repo.repositories().electObjectRepository().update(id, req.result)

      await repo.repositories().logRepository().create(req, id, "Electricity update")
      res.status(200).json({ status: 200, error: null, data: "Successful updated" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.updateMeterFn = async (req, res) => {
   try {
      const { id } = req.params
      const args = req.result

      const findOne = await repo.repositories().electObjectRepository().findById(id)
      if (!findOne || findOne.type != 'meter') return { status: 404, message: "Meter Not Found" }

      const obj = {
         name: args.name || findOne.name,
         vt: args.vt || findOne.vt,
         ct: args.ct || findOne.ct,
      }

      if (
         args.vt.dividend != findOne.vt.dividend ||
         args.vt.divisor != findOne.vt.divisor ||
         args.ct.dividend != findOne.ct.dividend ||
         args.ct.divisor != findOne.ct.divisor) {
         await repo.repositories().feederRepository().updateFeeder(findOne.parent_object, findOne, args, findOne._id)
      }

      await repo.repositories().electObjectRepository().insertParentParams(findOne.parent_object, findOne.parameters.map(e => ({ ...e._doc, multiply: args.multiply })))
      await repo.repositories().electObjectRepository().update(id, obj)
      await repo.repositories().logRepository().create(req, id, "Electricity update")
      res.status(200).json({ status: 200, error: null, data: "Successful updated" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.attachParamsElectFN = async (req, res) => {
   try {
      const { id } = req.params
      const { parameters } = req.result

      const find = await repo.repositories().electObjectRepository().findById(id)
      if (find && (find.type === 'meter' || find.type === 'feeder')) return res.status(400).json({ status: 400, error: null, data: "Meter no attach" })

      const param = []
      for (const value of parameters) {
         for (const archive of energytotal) {
            if (value.params_meter && value.params_meter[archive] != undefined) value.params_meter[currentFindArchive[archive]] = value.params_meter[archive]
            if (value.params_feeder && value.params_feeder[archive] != undefined) value.params_feeder[currentFindArchive[archive]] = value.params_feeder[archive]
         }

         async function listUpdate(fromId) {
            const fromList = await repo.repositories().electObjectRepository().findWithQuery({ "parameters.from": fromId })
            for (const elect of fromList) {
               for (const findParam of elect.parameters) {
                  if (!['meter', 'feeder'].includes(elect.type)) {
                     if (String(findParam.from) == String(fromId)) {
                        findParam.multiply = value.multiply
                        for (const shortName of energyarchive) {
                           if (findParam.params_feeder && findParam.params_feeder[shortName] && !value.params_feeder[shortName]) {
                              delete findParam.params_feeder[shortName]
                           }
                           if (findParam.params_meter && findParam.params_meter[shortName] && !value.params_meter[shortName]) {
                              delete findParam.params_meter[shortName]
                           }
                        }
                     }
                  }
               }
               if (electModel.includes(elect.type)) {
                  await repo.repositories().electObjectRepository().update(elect._id, { parameters: elect.parameters })
               } else {
                  await repo.repositories().calculationObjectRepository().update(elect._id, { parameters: elect.parameters })
               }
               await listUpdate(elect._id)
            }
         }
         await listUpdate(id)
         param.push(value)
      }

      await repo.repositories().electObjectRepository().update(id, { parameters: param })
      res.status(200).json({ status: 200, error: null, data: "Successful updated" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.deleteElect = async (req, res) => {
   try {
      const { id } = req.params
      await repo.repositories().electObjectRepository().remove(id)

      await repo.repositories().logRepository().create(req, id, "Electricity delete")
      res.status(204).json({ status: 204, error: null, data: "Successful deleted" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}
