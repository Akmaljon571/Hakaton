const CustomError = require("./custom_error")

module.exports.existListFN = (query, elseValue) => {
    const existList = query &&
        query.selectedParameters &&
        Array.isArray(JSON.parse(query.selectedParameters)) &&
        JSON.parse(query.selectedParameters).length ? JSON.parse(query.selectedParameters) : elseValue

    return existList
}

module.exports.formatDatabase = (meterParams, query) => {
    try {
        const limit = query && query.limit ? Number(query.limit) : 1500.
        const all = []

        for (const value of meterParams.parameter_values) all.push(value)
        const allData = all.sort((a, b) => b.date - a.date)

        const startIndex = query && query.date2 ? allData.findIndex(e => new Date(e.date) - new Date(query.date2) == 0) : 0
        const start = startIndex > 0 ? +startIndex : 0

        const parameter_values = allData.slice(start, start + limit)
        return { ...meterParams, parameter_values }
    } catch (err) {
        console.log(err)
        throw new CustomError(500, err.message)
    }
}

module.exports.time3Format = function (args) {
    const date = new Date(args)
    date.setHours(date.getHours() - 3)
    return date
}

module.exports.formatArchive = (meterParams, query) => {
    try {
        const limit = query && query.limit ? Number(query.limit) : 350
        const all = []

        for (const value of meterParams.parameter_values) all.push(value)
        const allData = all.sort((a, b) => b.date - a.date)

        const startIndex = query && query.date2 ? allData.findIndex(e => new Date(e.date) - new Date(query.date2) == 0) : 0
        const start = startIndex > 0 ? startIndex : 0

        const parameter_values = allData.slice(start, start + limit)
        return { ...meterParams, parameter_values }
    } catch (err) {
        console.log(err)
        throw new CustomError(500, err.message)
    }
}

module.exports.daysBetween = function (date1, date2) {
    var oneDay = 24 * 60 * 60 * 1000;
    var firstDate = new Date(date1);
    var secondDate = new Date(date2);

    var diffMilliseconds = firstDate - secondDate;

    return Math.abs(Math.round(diffMilliseconds / oneDay));
}