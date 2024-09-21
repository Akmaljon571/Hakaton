const repo = require("../repository")
const CustomError = require("./custom_error")
const { allMultiply, vectorMultiplyTN, vectorMultiplyTT, energyarchive } = require("../global/variable")
const { existListFN, formatDatabase, daysBetween } = require("./utils_fn")
const { all_short_name } = require("../global/file-path")
const { uniqueObject } = require("./unique_short-names")

module.exports.sortvalueObjectsForVectorDiagram = async (metersParams, query, id, multiply) => {
    try {
        const existList = existListFN(query, all_short_name())
        const result = new Map()

        for (let meterParams of metersParams) {
            const allShorts = uniqueObject(meterParams, existList)
            meterParams = formatDatabase(meterParams, query)
            for (const data of meterParams.parameter_values) {
                for (const shortName in allShorts) {
                    const value = Number(data.values[shortName])
                    if (!isNaN(value)) {
                        let valueObject = { shortName, multiply, value, date: data.date, sign: allShorts[shortName] }
                        const meterDefaultValue = JSON.parse(JSON.stringify(valueObject))

                        // === Multiply ===
                        if (query.coefficient === true || query.coefficient === "true" || (meterParams.params_feeder && meterParams.params_feeder[shortName] != undefined))
                            valueObject = await multiplyTcAndTT(multiply, valueObject.shortName, valueObject, id)

                        // === Has ===
                        if (result.has(new Date(data.date).getTime())) {
                            let value = valueAndSignCurrent(meterParams, valueObject, meterDefaultValue, shortName)
                            let dateObject = result.get(new Date(valueObject.date).getTime())

                            if (dateObject[valueObject.shortName]) {
                                dateObject[valueObject.shortName].value = dateObject[valueObject.shortName].value + value
                            } else {
                                dateObject[valueObject.shortName] = {
                                    value: value,
                                    param_name: valueObject.shortName,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }
                            result.set(new Date(valueObject.date).getTime(), dateObject)
                        } else {
                            let value = valueAndSignCurrent(meterParams, valueObject, meterDefaultValue, shortName)

                            let paramObject = {
                                [valueObject.shortName]: {
                                    value: value,
                                    param_name: valueObject.shortName,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }

                            result.set(new Date(valueObject.date).getTime(), paramObject)
                        }
                    }
                }
            }
        }

        return result
    } catch (err) {
        console.log(err)
        throw new CustomError(err.status, err.message)
    }
}

module.exports.sortvalueObjectsForGraphObjectArchive = async (metersParams, id, query) => {
    try {
        const currentResult = new Map()
        const existList = existListFN(query, energyarchive)

        for (let meterParams of metersParams) {
            const allShorts = uniqueObject(meterParams, existList)
            meterParams = formatDatabase(meterParams, query)
            for (const data of meterParams.parameter_values) {
                for (const shortName in allShorts) {
                    const value = Number(data.value)
                    if (!isNaN(value) && meterParams.param_details.param_short_name == shortName) {
                        let valueObject = { shortName, multiply: meterParams.multiply, value, date: data.date, sign: allShorts[shortName] }
                        const meterDefaultValue = JSON.parse(JSON.stringify(valueObject))

                        // === Multiply ===
                        if (meterParams.params_feeder && meterParams.params_feeder[shortName] != undefined)
                            valueObject = await multiplyTcAndTT(meterParams.multiply, shortName, valueObject, id)

                        // === Has ===
                        if (currentResult.has(new Date(valueObject.date).getTime())) {
                            let value = valueAndSignCurrent(meterParams, valueObject, meterDefaultValue, shortName)
                            let dateObject = currentResult.get(new Date(valueObject.date).getTime())

                            if (dateObject[shortName]) {
                                dateObject[shortName].value = dateObject[shortName].value + value
                            } else {
                                dateObject[shortName] = {
                                    value: value,
                                    param_name: shortName,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }

                            currentResult.set(new Date(valueObject.date).getTime(), dateObject)
                        } else {
                            let value = valueAndSignCurrent(meterParams, valueObject, meterDefaultValue, shortName)
                            let paramObject = {
                                [shortName]: {
                                    value: value,
                                    param_name: shortName,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }

                            currentResult.set(new Date(valueObject.date).getTime(), paramObject)
                        }
                    }
                }
            }
        }

        return currentResult
    } catch (err) {
        console.log(err)
        throw new CustomError(err.status, err.message)
    }
}

module.exports.sortvalueObjectsForFirstReport = async (parameters, id, step, date1, date2) => {
    try {
        const A = step ? energyarchive[0] : energyarchive[1]
        const R = step ? energyarchive[2] : energyarchive[3]

        const result = new Map()
        const countLength = daysBetween(date1, date2)
        const countDate = new Date(date1)
        countDate.setDate(countDate.getDate() - 1)

        const fix = 10
        const multyply = 1000000000

        for (let i = 0; i < countLength; i++) {
            countDate.setDate(countDate.getDate() + 1)
            result.set(countDate.getTime(), { first_tariff: null, second_tariff: null, third_tariff: null, fourth_tariff: null, general_aplus: null, general_rplus: null })
        }

        for (const params of parameters) {
            const shortName = params.param_details.param_short_name

            for (let param of params.parameter_values) {
                const date = new Date(param.date)
                if (date.getHours() == 0 && date.getMinutes() == 0) {
                    date.setHours(date.getHours() - 1)
                }
                let key = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()

                // === Multiply ===

                let value = Number(param.value.toFixed(fix)) * multyply
                if (params.params_feeder && params.params_feeder[shortName] != undefined) {
                    value = (value * (params.multiply[0] || 1)) * (params.multiply[1] || 1)
                }
                if (result.has(key)) {
                    let lastObject = result.get(key)
                    if (shortName === A) {
                        if (date.getHours() > 6 && date.getHours() <= 9) {
                            if (lastObject.first_tariff) {
                                const total = Number(lastObject.first_tariff.toFixed(fix)) * multyply
                                lastObject.first_tariff = (total + value) / multyply
                            } else {
                                lastObject.first_tariff = value / multyply
                            }
                        } else if (date.getHours() > 9 && date.getHours() <= 17) {
                            if (lastObject.second_tariff) {
                                const total = Number(lastObject.second_tariff.toFixed(fix)) * multyply
                                lastObject.second_tariff = (total + value) / multyply
                            } else {
                                lastObject.second_tariff = value / multyply
                            }
                        } else if (date.getHours() > 17 && date.getHours() <= 22) {
                            if (lastObject.third_tariff) {
                                const total = Number(lastObject.third_tariff.toFixed(fix)) * multyply
                                lastObject.third_tariff = (total + value) / multyply
                            } else {
                                lastObject.third_tariff = value / multyply
                            }
                        } else {
                            if (date.getHours() == 0 && date.getMinutes() == 0) {
                                const stepDate = new Date(key)
                                stepDate.setDate(stepDate.getDate() + 1)

                                const find = params.parameter_values.find(e => e.date - stepDate == 0 && String(e.parameter) == String(params.param_details._id))
                                if (find) {
                                    const value = Number(find.value.toFixed(fix)) * multyply
                                    if (lastObject.fourth_tariff) {
                                        const total = Number(lastObject.fourth_tariff.toFixed(fix)) * multyply
                                        lastObject.fourth_tariff = (total + value) / multyply
                                    } else {
                                        lastObject.fourth_tariff = value / multyply
                                    }
                                }
                            } else {
                                if (lastObject.fourth_tariff) {
                                    const total = Number(lastObject.fourth_tariff.toFixed(fix)) * multyply
                                    lastObject.fourth_tariff = (total + value) / multyply
                                } else {
                                    lastObject.fourth_tariff = value / multyply
                                }
                            }
                        }
                    } else if (shortName === R) {
                        if (lastObject.general_rplus) {
                            const total = Number(lastObject.general_rplus.toFixed(fix)) * multyply
                            lastObject.general_rplus = (total + value) / multyply
                        } else {
                            lastObject.general_rplus = value / multyply
                        }
                    }
                    result.set(key, lastObject)
                }
            }
        }

        const data = Object.fromEntries(result)
        for (const key in data) {
            const find = data[key]

            if (find.first_tariff != null || find.second_tariff != null || find.third_tariff != null || find.fourth_tariff != null) {
                data[key].general_aplus = find.first_tariff + find.second_tariff + find.third_tariff + find.fourth_tariff
            }
        }

        return data
    } catch (err) {
        console.log(err)
        throw new CustomError(err.status, err.message)
    }
}

module.exports.sortvalueObjectsForSecondReport = async (parameters, id, date1, date2) => {
    try {
        const result = new Map()
        let time = {}
        for (let parameter of parameters) {
            for (let valueObject of parameter.parameter_values) {
                let currentElementDate = new Date(valueObject.date)
                let currentElementKey = new Date(currentElementDate.getFullYear(), currentElementDate.getMonth(), currentElementDate.getDate()).getTime()

                // === Multiply ===
                if (parameter.params_feeder && parameter.params_feeder[parameter.param_details.param_short_name] != undefined)
                    valueObject = await multiplyTcAndTT(parameter.multiply, parameter.param_details.param_short_name, valueObject, id)

                // === Has ===
                let hours = currentElementDate.getHours()
                const minute = currentElementDate.getMinutes()
                if (result.has(currentElementKey)) {
                    let lastObject = result.get(currentElementKey)

                    if (((hours == 5 && minute > 0) || hours > 5) && (hours < 9 || (hours == 9 && minute == 0))) {
                        if (minute == 0) hours -= 1

                        time[1 + hours] = time[1 + hours] + valueObject.value || valueObject.value
                        if ((hours == 8 && minute == 0)) {
                            for (const key in time) {
                                if (lastObject.first_tariff < time[key]) {
                                    lastObject.first_tariff = time[key]
                                }
                            }
                            time = {}
                        }
                    } else if (((hours == 9 && minute > 0) || hours > 9) && (hours < 17 || (hours == 17 && minute == 0))) {
                        if (minute == 0) hours -= 1

                        time[1 + hours] = time[1 + hours] + valueObject.value || valueObject.value
                        if ((hours == 16 && minute == 0)) {
                            for (const key in time) {
                                if (!Number(lastObject.second_tariff) || lastObject.second_tariff < time[key]) {
                                    lastObject.second_tariff = time[key]
                                }
                            }
                            time = {}
                        }
                    } else if (((hours == 17 && minute > 0) || hours > 17) && (hours < 22 || (hours == 22 && minute == 0))) {
                        if (minute == 0) hours -= 1

                        time[1 + hours] = time[1 + hours] + valueObject.value || valueObject.value
                        if ((hours == 21 && minute == 0)) {
                            for (const key in time) {
                                if (!Number(lastObject.third_tariff) || lastObject.third_tariff < time[key]) {
                                    lastObject.third_tariff = time[key]
                                }
                            }
                            time = {}
                        }
                    } else {
                        if (minute == 0) hours -= 1

                        time[1 + hours] = time[1 + hours] + valueObject.value || valueObject.value
                        if ((hours == 4 && minute == 0)) {
                            for (const key in time) {
                                if (!Number(lastObject.fourth_tariff) || lastObject.fourth_tariff < time[key]) {
                                    lastObject.fourth_tariff = time[key]
                                }
                            }
                            time = {}
                        }
                    }

                } else {
                    let lastObject = { first_tariff: null, second_tariff: null, third_tariff: null, fourth_tariff: null, max: null }

                    if (((hours == 5 && minute > 0) || hours > 5) && (hours < 9 || (hours == 9 && minute == 0))) {
                        if (minute == 0) hours -= 1

                        time[1 + hours] = time[1 + hours] + valueObject.value || valueObject.value
                        if ((hours == 8 && minute == 0)) {
                            for (const key in time) {
                                if (lastObject.first_tariff < time[key]) {
                                    lastObject.first_tariff = time[key]
                                }
                            }
                            time = {}
                        }
                    } else if (((hours == 9 && minute > 0) || hours > 9) && (hours < 17 || (hours == 17 && minute == 0))) {
                        if (minute == 0) hours -= 1

                        time[1 + hours] = time[1 + hours] + valueObject.value || valueObject.value
                        if ((hours == 16 && minute == 0)) {
                            for (const key in time) {
                                if (!Number(lastObject.second_tariff) || lastObject.second_tariff < time[key]) {
                                    lastObject.second_tariff = time[key]
                                }
                            }
                            time = {}
                        }
                    } else if (((hours == 17 && minute > 0) || hours > 17) && (hours < 22 || (hours == 22 && minute == 0))) {
                        if (minute == 0) hours -= 1

                        time[1 + hours] = time[1 + hours] + valueObject.value || valueObject.value
                        if ((hours == 21 && minute == 0)) {
                            for (const key in time) {
                                if (!Number(lastObject.third_tariff) || lastObject.third_tariff < time[key]) {
                                    lastObject.third_tariff = time[key]
                                }
                            }
                            time = {}
                        }
                    } else {
                        if (minute == 0) hours -= 1

                        time[1 + hours] = time[1 + hours] + valueObject.value || valueObject.value
                        if ((hours == 4 && minute == 0)) {
                            for (const key in time) {
                                if (!Number(lastObject.fourth_tariff) || lastObject.fourth_tariff < time[key]) {
                                    lastObject.fourth_tariff = time[key]
                                }
                            }
                            time = {}
                        }
                    }

                    result.set(currentElementKey, lastObject)
                }
            }
        }

        const data = Object.fromEntries(result)
        const keys = Object.keys(data);
        const firstKey = keys[0];
        const lastKey = keys[keys.length - 1];

        const resultObj = {}
        let maxMaxValue = -Infinity;
        for (const key in data) {
            if ((key == firstKey && new Date(+firstKey) - new Date(date1) <= 0) || (key == lastKey && new Date(+lastKey) - new Date(date2) >= 0)) {
                delete data[key]
                continue
            }
            let maxValue = -Infinity;

            for (const [tariffKey, tariffValue] of Object.entries(data[key])) {
                if (tariffKey !== 'max' && tariffValue > maxValue) {
                    maxValue = tariffValue;
                }

                if (tariffKey !== 'max' && (!resultObj[tariffKey] || (resultObj[tariffKey] && resultObj[tariffKey] < tariffValue))) {
                    resultObj[tariffKey] = tariffValue
                } else if (tariffKey == 'max' && maxMaxValue < maxValue) {
                    maxMaxValue = maxValue
                }

                data[key].max = maxValue
            }
        }
        resultObj["max"] = maxMaxValue
        resultObj.data = data
        return resultObj
    } catch (err) {
        console.log(err)
        throw new CustomError(err.status, err.message)
    }
}

module.exports.sortvalueObjectsForGraphObjectCurrent = async (parameters, id) => {
    try {
        const currentResult = new Map()

        for (const parameter of parameters) {
            for (let valueObject of parameter.parameter_values) {
                const shortName = parameter.param_details.param_short_name
                valueObject.value = Number(valueObject.values[shortName])
                const meterDefaultValue = JSON.parse(JSON.stringify(valueObject))

                // === Multiply ===
                if (parameter.params_feeder && parameter.params_feeder[shortName] != undefined) {
                    valueObject = await multiplyTcAndTT(parameter.multiply, shortName, valueObject, id)
                }

                // === Value ===
                let value = valueAndSignArchive(parameter, valueObject, meterDefaultValue)

                // === Has ===
                if (currentResult.has(new Date(valueObject.date).getTime())) {
                    let dateObject = currentResult.get(new Date(valueObject.date).getTime())

                    if (dateObject[shortName]) {
                        dateObject[shortName].value = dateObject[shortName].value + value
                    } else {
                        dateObject[shortName] = {
                            value: value,
                            param_name: parameter.param_details.param_name,
                            date: new Date(valueObject.date).getTime()
                        }
                    }

                    currentResult.set(new Date(valueObject.date).getTime(), dateObject)
                } else {
                    let paramObject = {
                        [shortName]: {
                            value: value,
                            param_name: parameter.param_details.param_name,
                            date: new Date(valueObject.date).getTime()
                        }
                    }

                    currentResult.set(new Date(valueObject.date).getTime(), paramObject)
                }
            }
        }

        return currentResult
    } catch (err) {
        throw new CustomError(err.status, err.message)
    }
}

module.exports.sortvalueObjectsForList = async (meterParams, id, query) => {
    try {
        const currentResult = new Map()
        const existList = existListFN(query, all_short_name())

        const allShorts = uniqueObject(meterParams, existList)
        meterParams = formatDatabase(meterParams, query)
        for (const data of meterParams.parameter_values) {
            for (const shortName in allShorts) {
                const value = Number(data.values[shortName])
                if (!isNaN(value)) {
                    let valueObject = { shortName, multiply: meterParams.multiply, value, date: data.date, sign: allShorts[shortName] }
                    const meterDefaultValue = JSON.parse(JSON.stringify(valueObject))

                    // === Multiply ===
                    if (meterParams.params_feeder && meterParams.params_feeder[shortName] != undefined)
                        valueObject = await multiplyTcAndTT(meterParams.multiply, shortName, valueObject, id)

                    // === Has ===
                    if (currentResult.has(new Date(valueObject.date).getTime())) {
                        let value = valueAndSignCurrent(meterParams, valueObject, meterDefaultValue, shortName)
                        let dateObject = currentResult.get(new Date(valueObject.date).getTime())

                        if (dateObject[shortName]) {
                            dateObject[shortName].total.value += value
                        } else {
                            dateObject[shortName] = {
                                total: {
                                    value,
                                    param_name: shortName,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }
                        }

                        currentResult.set(new Date(valueObject.date).getTime(), dateObject)
                    } else {
                        let value = valueAndSignCurrent(meterParams, valueObject, meterDefaultValue, shortName)
                        let paramObject = {
                            [shortName]: {
                                total: {
                                    value,
                                    param_name: shortName,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }
                        }

                        currentResult.set(new Date(valueObject.date).getTime(), paramObject)
                    }
                }
            }
        }
        return currentResult
    } catch (err) {
        console.log(err)
        throw new CustomError(err.status, err.message)
    }
}

module.exports.sortvalueObjectsForListArchive = async (parameters, id, query) => {
    try {
        let result = new Map()
        for (let parameter of parameters) {
            for (let valueObject of parameter.parameter_values) {
                const meterDefaultValue = JSON.parse(JSON.stringify(valueObject))

                // === Multiply ===
                if (parameter.params_feeder && parameter.params_feeder[parameter.param_details.param_short_name] != undefined)
                    valueObject = await multiplyTcAndTT(parameter.multiply, parameter.param_details.param_short_name, valueObject, id)

                // === Value ===
                let value = valueAndSignArchive(parameter, valueObject, meterDefaultValue)

                // === Has ===
                if (result.has(new Date(valueObject.date).getTime())) {
                    let dateObject = result.get(new Date(valueObject.date).getTime())

                    if (dateObject[parameter.param_details.param_short_name]) {
                        if (valueObject.tariff && valueObject.tariff !== 0) {
                            if (dateObject[parameter.param_details.param_short_name][valueObject.tariff]) {
                                dateObject[parameter.param_details.param_short_name][valueObject.tariff].value += value
                            } else {
                                dateObject[parameter.param_details.param_short_name][valueObject.tariff] = {
                                    value,
                                    param_name: parameter.param_details.param_name,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }
                        } else {
                            if (dateObject[parameter.param_details.param_short_name].total) {
                                dateObject[parameter.param_details.param_short_name].total.value += value
                            } else {
                                dateObject[parameter.param_details.param_short_name].total = {
                                    value,
                                    param_name: parameter.param_details.param_name,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }
                        }
                    } else {
                        if (valueObject.tariff && valueObject.tariff !== 0) {
                            dateObject[parameter.param_details.param_short_name] = {
                                [valueObject.tariff]: {
                                    value,
                                    param_name: parameter.param_details.param_name,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }
                        } else {
                            dateObject[parameter.param_details.param_short_name] = {
                                total: {
                                    value,
                                    param_name: parameter.param_details.param_name,
                                    date: new Date(valueObject.date).getTime()
                                }
                            }
                        }

                    }

                    result.set(new Date(valueObject.date).getTime(), dateObject)
                } else {
                    let paramObject = {
                        [parameter.param_details.param_short_name]: {
                            [valueObject.tariff && valueObject.tariff !== 0 ? valueObject.tariff : "total"]: {
                                value,
                                param_name: parameter.param_details.param_name,
                                date: new Date(valueObject.date).getTime()
                            }
                        }
                    }
                    result.set(new Date(valueObject.date).getTime(), paramObject)
                }
            }
        }

        return result
    } catch (err) {
        throw new CustomError(err.status, err.message)
    }
}

// === Func shu file uchun ===
let oldId
let obj = {}
async function multiplyTcAndTT(multiply, name, valueObject, id) {
    if (oldId != id) {
        obj = await repo.repositories().feederRepository().findFeeder(id)
        oldId = id
    }

    if (obj && obj.date) {
        for (let i = 0; i < obj.date.length; i++) {
            if (valueObject.date > obj.date[i]) {
                multiply = [obj.TT[i], obj.TN[i]]
            }
        }
    }

    if (energyarchive.concat(allMultiply).includes(name)) {
        multiply.map(element => valueObject.value = Math.round(valueObject.value * element * 1000) / 1000)
    } else if (vectorMultiplyTN.includes(name)) {
        if (multiply && multiply[1]) {
            valueObject.value = Math.round(valueObject.value * multiply[1] * 1000) / 1000
        }
    } else if (vectorMultiplyTT.includes(name)) {
        if (multiply && multiply[0]) {
            valueObject.value = Math.round(valueObject.value * multiply[0] * 1000) / 1000
        }
    }

    return valueObject
}

function valueAndSignArchive(params, valueObject, meterDefaultValue) {
    let sign
    if (params.params_feeder && params.params_feeder[params.param_details.param_short_name] != undefined) {
        sign = params.params_feeder[params.param_details.param_short_name]
    } else if (params.params_meter && params.params_meter[params.param_details.param_short_name] != undefined) {
        sign = params.params_meter[params.param_details.param_short_name]
    }

    let value = sign ? valueObject.value : -valueObject.value
    if ((params.params_meter && params.params_meter[params.param_details.param_short_name] != undefined) &&
        (params.params_feeder && params.params_feeder[params.param_details.param_short_name] != undefined)) value += meterDefaultValue.value

    return value
}

function valueAndSignCurrent(params, valueObject, meterDefaultValue, shortName) {
    let sign
    if (params.params_feeder && params.params_feeder[shortName] != undefined) {
        sign = params.params_feeder[shortName]
    } else if (params.params_meter && params.params_meter[shortName] != undefined) {
        sign = params.params_meter[shortName]
    }

    let value = sign ? valueObject.value : -valueObject.value
    if ((params.params_meter && params.params_meter[shortName] != undefined) &&
        (params.params_feeder && params.params_feeder[shortName] != undefined)) value += meterDefaultValue.value

    return value
}

// === Func Tashqari uchun ===
module.exports.valueAndSignCurrent = function (params, valueObject, meterDefaultValue, shortName) {
    const sign = params[shortName] != undefined ? params[shortName] : true

    let value = sign ? valueObject.value : -valueObject.value
    if ((params.params_meter && params.params_meter[shortName] != undefined) &&
        (params.params_feeder && params.params_feeder[shortName] != undefined)) value += meterDefaultValue.value

    return value
}

module.exports.multiplyTcAndTT = (multiply, valueObject, name) => {
    if (energyarchive.concat(allMultiply).includes(name)) {
        multiply.map(element => valueObject.value = Math.round(valueObject.value * element * 1000) / 1000)
    } else if (vectorMultiplyTN.includes(name)) {
        if (multiply && multiply[1]) {
            valueObject.value = Math.round(valueObject.value * multiply[1] * 1000) / 1000
        }
    } else if (vectorMultiplyTT.includes(name)) {
        if (multiply && multiply[0]) {
            valueObject.value = Math.round(valueObject.value * multiply[0] * 1000) / 1000
        }
    }
    return valueObject
}