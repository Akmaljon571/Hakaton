const { realTimeVariable, energytotalShortName } = require("../global/variable")


module.exports.totalCalculation = (result) => {
    try {
        const key = Object.keys(result)[0]

        if (key && !Object.keys(result[key]).some(e => energytotalShortName.includes(e))) {
            for (const key in result) {
                const resultItem = result[key]
                for (const key2 in resultItem) {
                    if (resultItem[key2] && resultItem[key2].total) {
                        if (realTimeVariable[0].includes(key2)) {
                            const date = resultItem[key2].total.date
                            const value = resultItem[key2].total.value

                            if (!result[date][energytotalShortName[0]]) result[date][energytotalShortName[0]] = { total: { value: 0, date, param_name: energytotalShortName[0] } }

                            result[date][energytotalShortName[0]].total.value += value
                        } else if (realTimeVariable[1].includes(key2)) {
                            const date = resultItem[key2].total.date
                            const value = resultItem[key2].total.value

                            if (!result[date][energytotalShortName[1]]) result[date][energytotalShortName[1]] = { total: { value: 0, date, param_name: energytotalShortName[0] } }

                            result[date][energytotalShortName[1]].total.value += value
                        } else if (realTimeVariable[2].includes(key2)) {
                            const date = resultItem[key2].total.date
                            const value = resultItem[key2].total.value

                            if (!result[date][energytotalShortName[2]]) result[date][energytotalShortName[2]] = { total: { value: 0, date, param_name: energytotalShortName[0] } }

                            result[date][energytotalShortName[2]].total.value += value
                        } else if (realTimeVariable[3].includes(key2)) {
                            const date = resultItem[key2].total.date
                            const value = resultItem[key2].total.value

                            if (!result[date][energytotalShortName[3]]) result[date][energytotalShortName[3]] = { total: { value: 0, date, param_name: energytotalShortName[0] } }

                            result[date][energytotalShortName[3]].total.value += value
                        }
                    } else {
                        if (realTimeVariable[0].includes(key2)) {
                            const date = resultItem[key2].date
                            const value = resultItem[key2].value

                            if (!result[date][energytotalShortName[0]]) result[date][energytotalShortName[0]] = { value: 0, date, param_name: energytotalShortName[0] }

                            result[date][energytotalShortName[0]].value += value
                        } else if (realTimeVariable[1].includes(key2)) {
                            const date = resultItem[key2].date
                            const value = resultItem[key2].value

                            if (!result[date][energytotalShortName[1]]) result[date][energytotalShortName[1]] = { value: 0, date, param_name: energytotalShortName[0] }

                            result[date][energytotalShortName[1]].value += value
                        } else if (realTimeVariable[2].includes(key2)) {
                            const date = resultItem[key2].date
                            const value = resultItem[key2].value

                            if (!result[date][energytotalShortName[2]]) result[date][energytotalShortName[2]] = { value: 0, date, param_name: energytotalShortName[0] }

                            result[date][energytotalShortName[2]].value += value
                        } else if (realTimeVariable[3].includes(key2)) {
                            const date = resultItem[key2].date
                            const value = resultItem[key2].value

                            if (!result[date][energytotalShortName[3]]) result[date][energytotalShortName[3]] = { value: 0, date, param_name: energytotalShortName[0] }

                            result[date][energytotalShortName[3]].value += value
                        }
                    }
                }
            }
        }
        return result
    } catch (error) {
        console.log(error)
    }
}
