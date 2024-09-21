const { all_short_name } = require("../global/file-path")
const { energyarchive } = require("../global/variable")

module.exports.uniqueShortNames = (parameters, type, filterSelect) => {
    if (!filterSelect) {
        filterSelect = type && ["meter", "feeder"].includes(type) ? all_short_name().concat(energyarchive) : energyarchive
    }
    if (parameters && parameters.length) {
        const allShortNames = []
        parameters.map(e => allShortNames.push(...Object.keys(e.params_meter || {}).concat(Object.keys(e.params_feeder || {}))))
        return Array.from(new Set(allShortNames)).filter(e => filterSelect.includes(e))
    }
    return []
}

module.exports.uniqueShortName = (param) => {
    const allShortNames = []
    allShortNames.push(...Object.keys(param.params_meter || {}).concat(Object.keys(param.params_feeder || {})))
    return Array.from(new Set(allShortNames))
}

module.exports.obisFilter = (obis) => {
    if (obis == "4.8.1") {
        return "1.0"
    } else if (obis == "4.8.2") {
        return "1.1"
    } else if (obis == "4.8.3") {
        return "1.2"
    } else if (obis == "4.8.4") {
        return "1.3"
    }
}

module.exports.uniqueObject = (parameters, filterSelect = all_short_name()) => {
    if (parameters && ("params_meter" in parameters || "params_feeder" in parameters)) {
        const allShortNames = { ...parameters.params_meter, ...parameters.params_feeder }
        for (const key in allShortNames) {
            if (!filterSelect.includes(key)) delete allShortNames[key]
        }

        return allShortNames
    }
    return {}
}