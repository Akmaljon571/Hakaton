const CustomError = require("../../utils/custom_error")
const repo = require("../../repository")
const { formatParamsList } = require("../../global/file-path")
const { sortvalueObjectsForFirstReport, sortvalueObjectsForSecondReport } = require("../../utils/sortvalue_bydate")
const { energytotal, currentFindArchive, energyarchive } = require("../../global/variable")
const { uniqueShortNames, obisFilter } = require("../../utils/unique_short-names")
const { electModel } = require("../../global/enum")

module.exports.getElectricityObjectsCalculation = async (req, res) => {
   try {
      const { list } = req
      const objectDocuments = await repo.repositories().calculationObjectRepository().findAll({ type: ["main", "child"], list })

      res.status(200).json({ status: 200, error: null, data: objectDocuments })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.getSingleElectricityObjectCalculation = async (req, res) => {
   try {
      const { id } = req.params

      const objectDocument = await repo.repositories().calculationObjectRepository().findOne(id)
      if (!objectDocument) return res.status(200).json({ status: 200, error: null, data: {} })

      const formatParams = formatParamsList()
      let obisList = {}
      formatParams.indicators.map(e => uniqueShortNames(objectDocument.parameters).includes(e.param_short_name) ? obisList[e.param_short_name] = obisFilter(e.channel_full_id) : "").filter(e => e)

      const block = formatParams.indicators_block.filter(e => Object.values(obisList).includes(e.channel_full_id))
      objectDocument.block = block
      objectDocument.obis = obisList

      const location = await repo.repositories().calculationObjectRepository().findLocation(id)
      res.status(200).json({ status: 200, error: null, data: objectDocument, location })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.getFirstTemplateReport = async (req, res) => {
   try {
      const { id } = req.params
      const { date1, date2, step } = req.data

      const find = await repo.repositories().calculationObjectRepository().findById(id)
      if (!find) throw new CustomError(404, "Calculation not found")

      const pages = await repo.repositories().calculationObjectRepository().firstTemplateReport(id, date1, date2, step)
      let reportData
      if (pages) reportData = await sortvalueObjectsForFirstReport(pages, find._id, step, date1, date2)

      const data = {
         data: pages ? reportData : {},
         location: await repo.repositories().calculationObjectRepository().findLocation(id)
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

      const find = await repo.repositories().calculationObjectRepository().findById(id)
      if (!find) throw new CustomError(404, "Calculation not found")

      const date1Format = new Date(date1)
      const dateFormat = new Date(date2)
      date1Format.setDate(date1Format.getDate() - 1)
      dateFormat.setDate(dateFormat.getDate() + 1)

      const pages = await repo.repositories().calculationObjectRepository().secondTemplateReport(id, date1Format, dateFormat)
      let reportData = {}
      if (pages) reportData = await sortvalueObjectsForSecondReport(pages.parameters, find._id, date1, date2)

      const data = {
         data: reportData,
         location: await repo.repositories().calculationObjectRepository().findLocation(id)
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

      const find = await repo.repositories().calculationObjectRepository().findById(id)
      if (!find) throw new CustomError(404, "Calculation not found")

      const data = await repo.repositories().calculationObjectRepository().thirdTemplateReport(id, date1, date2)
      const location = await repo.repositories().calculationObjectRepository().findLocation(id)

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

      const find = await repo.repositories().calculationObjectRepository().findById(id)
      if (!find) throw new CustomError(404, "Calculation not found")

      const data = await repo.repositories().calculationObjectRepository().fourthTemplateReport(id, date1, date2)
      const location = await repo.repositories().calculationObjectRepository().findLocation(id)

      res.status(200).json({ status: 200, error: null, data, location })
   } catch (err) {
      console.log(err)
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.insertPapkaCalculation = async (req, res) => {
   try {
      const args = req.result

      if (args.parent_object) {
         const parentObject = await repo.repositories().calculationObjectRepository().findById(args.parent_object)
         if (!parentObject) return new CustomError(404, 'Parent Not Found')
         else if (args.type === 'main') return new CustomError(400, 'Main failed')
         else if (parentObject.type == 'meter') return new CustomError(400, 'Parent Bad Request')
      }

      const newObj = await repo.repositories().calculationObjectRepository().insert(args)
      await repo.repositories().logRepository().create(req, newObj._id, "Calculation create")
      res.status(201).json({ status: 201, error: null, data: "Successful Created" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.calculationMain = async (req, res) => {
   try {
      const data = await repo.repositories().calculationObjectRepository().onlyMain()
      res.status(200).json({ status: 200, error: null, data })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.updateFolderCalculationFn = async (req, res) => {
   try {
      const { id } = req.params

      await repo.repositories().calculationObjectRepository().update(id, req.result)
      await repo.repositories().logRepository().create(req, id, "Calculation update")
      res.status(200).json({ status: 200, error: null, data: "Successful Updated" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.attachParamsCalculationFN = async (req, res) => {
   try {
      const { id } = req.params
      const { parameters } = req.result

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

      await repo.repositories().calculationObjectRepository().update(id, { parameters: param })
      res.status(200).json({ status: 200, error: null, data: "Successful Updated" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}

module.exports.deleteCalculation = async (req, res) => {
   try {
      const { id } = req.params
      await repo.repositories().calculationObjectRepository().remove(id)

      await repo.repositories().logRepository().create(req, id, "Calculation delete")
      res.status(204).json({ status: 204, error: null, data: "deleted" })
   } catch (err) {
      const error = new CustomError(err.status, err.message)
      res.status(error.status).json({ status: error.status, error: error.message, data: null })
   }
}
