const { energyarchive } = require("../global/variable");
const { currentModel } = require("../models");
const { repositories } = require("../repository");
const { formula } = require("../utils/formula");

module.exports.fakeMeterRun = (meters) => {
    try {
        meters.forEach(meter => { fakeMeter(meter) });
    } catch (error) {
        console.log(error)
        this.fakeMeter(meters)
    }
}

async function fakeMeter(meter) {
    try {
        await new Promise(async (resolve, reject) => {
            try {
                const date = new Date()
                let {
                    _id, billing, archive, currentTime = date,
                    archiveTotalA = 0, archiveTotalR = 0,
                    plusA = 0, tarifA1 = 0, tarifA2 = 0, tarifA3 = 0, tarifA4 = 0,
                    plusR = 0, tarifR1 = 0, tarifR2 = 0, tarifR3 = 0, tarifR4 = 0
                } = await repositories().previousObjectRepository().findOne(meter._id)

                const diffInMilliseconds = date - currentTime;
                const diffInSeconds = diffInMilliseconds / 1000;
                const intervalsOfTenSeconds = Math.floor(diffInSeconds / 10);

                for (let index = 0; index < intervalsOfTenSeconds; index++) {
                    console.log(currentTime.getSeconds())
                    currentTime.setSeconds(currentTime.getSeconds() + 10)
                    const F = +(Math.random() * (50.3 - 49.8) + 49.8).toFixed(2)
                    const U1 = +(Math.random() * (220.00 - 190.00) + 190.00).toFixed(2)
                    const U2 = +(U1 + (+(Math.random() * (1.00 - 3.00) + 3.00).toFixed(2))).toFixed(2)
                    const U3 = +(U1 - (+(Math.random() * (1.00 - 3.00) + 3.00).toFixed(2))).toFixed(2)
                    const I1 = +(Math.random() * (5.00 - 1.00) + 1.00).toFixed(2)
                    const I2 = +(I1 - (+(Math.random() * (0.80 - 0.05) + 0.05).toFixed(2))).toFixed(2)
                    const I3 = +(I1 + (+(Math.random() * (0.80 - 0.05) + 0.05).toFixed(2))).toFixed(2)
                    const corUI1 = Math.floor(Math.random() * (45 - 10 + 1)) + 10;
                    const corUI2 = corUI1 - Math.floor(Math.random() * (9 - 1 + 1)) + 1;
                    const corUI3 = corUI1 - Math.floor(Math.random() * (9 - 1 + 1)) + 1;

                    const hasCurrent = {
                        "current_frequency": { value: F },
                        "current_voltage_A": { value: U1 },
                        "current_voltage_B": { value: U2 },
                        "current_voltage_C": { value: U3 },
                        "current_current_A": { value: I1 },
                        "current_current_B": { value: I2 },
                        "current_current_C": { value: I3 },
                        "current_angle_UI_A": { value: corUI1 },
                        "current_angle_UI_B": { value: corUI2 },
                        "current_angle_UI_C": { value: corUI3 },
                    }

                    const allCurrent = formula(hasCurrent)
                    const values = {}
                    const parameters = []

                    for (const shortName in allCurrent) {
                        values[shortName] = allCurrent[shortName].value
                    }

                    const P = values["current_active-power_total"]
                    const Q = values["current_reactive-power_total"]
                    const A = P / 720
                    const R = Q / 720

                    archiveTotalA += A
                    archiveTotalR += R
                    plusA += A
                    plusR += R
                    if (currentTime.getHours() >= 6 && currentTime.getHours() < 9) {
                        tarifA1 += A
                        tarifR1 += R
                    } else if (currentTime.getHours() >= 9 && currentTime.getHours() < 17) {
                        tarifA2 += A
                        tarifR2 += R
                    } else if (currentTime.getHours() >= 17 && currentTime.getHours() < 22) {
                        tarifA3 += A
                        tarifR3 += R
                    } else if (currentTime.getHours() >= 22 || currentTime.getHours() < 6) {
                        tarifA4 += A
                        tarifR4 += R
                    }

                    values["current_energytotal_A+"] = plusA
                    values["current_energytotal_A+_tarif1"] = tarifA1
                    values["current_energytotal_A+_tarif2"] = tarifA2
                    values["current_energytotal_A+_tarif3"] = tarifA3
                    values["current_energytotal_A+_tarif4"] = tarifA4
                    values["current_energytotal_A-"] = 0
                    values["current_energytotal_A-_tarif1"] = 0
                    values["current_energytotal_A-_tarif2"] = 0
                    values["current_energytotal_A-_tarif3"] = 0
                    values["current_energytotal_A-_tarif4"] = 0
                    values["current_energytotal_R+"] = plusR
                    values["current_energytotal_R+_tarif1"] = tarifR1
                    values["current_energytotal_R+_tarif2"] = tarifR2
                    values["current_energytotal_R+_tarif3"] = tarifR3
                    values["current_energytotal_R+_tarif4"] = tarifR4
                    values["current_energytotal_R-"] = 0
                    values["current_energytotal_R-_tarif1"] = 0
                    values["current_energytotal_R-_tarif2"] = 0
                    values["current_energytotal_R-_tarif3"] = 0
                    values["current_energytotal_R-_tarif4"] = 0

                    const findToday = await currentModel.aggregate([
                        { $match: { meter_id: meter._id } },
                        { $match: { day: currentTimeFormat(currentTime) } },
                        { $project: { data: 0 } }
                    ])

                    if (findToday[0]) {
                        await repositories().currentRepository().update(findToday[0]._id, { $push: { data: { date: currentTime, values } } })
                    } else {
                        const newData = { meter_id: meter._id, day: currentTimeFormat(currentTime), data: [{ date: currentTime, values }] }
                        await repositories().currentRepository().insert(newData)
                    }

                    for (const shortName in values) {
                        parameters.push({ param_short_name: shortName, value: values[shortName], currentTime })
                    }

                    if (timeFormat(currentTime) - archive > 0) {
                        const activePowerPlus = meter.parameters.find(e => e.param_short_name === energyarchive[0])
                        const activePowerMinus = meter.parameters.find(e => e.param_short_name === energyarchive[1])
                        const reactivePowerPlus = meter.parameters.find(e => e.param_short_name === energyarchive[2])
                        const reactivePowerMinus = meter.parameters.find(e => e.param_short_name === energyarchive[3])

                        await repositories().archiveRepository().insert([
                            {
                                value: archiveTotalA,
                                date: timeFormat(currentTime),
                                parameter: activePowerPlus._id
                            },
                            {
                                value: 0,
                                date: timeFormat(currentTime),
                                parameter: activePowerMinus._id
                            },
                            {
                                value: archiveTotalR,
                                date: timeFormat(currentTime),
                                parameter: reactivePowerPlus._id
                            },
                            {
                                value: 0,
                                date: timeFormat(currentTime),
                                parameter: reactivePowerMinus._id
                            }
                        ])

                        await repositories().lastJoinRepository().update(meter._id, {
                            request_type: "archive", status: "succeed",
                            archive: "succeed", archive_date: timeFormat(currentTime),
                        })
                        archiveTotalA = 0
                        archiveTotalR = 0
                        archive = timeFormat(currentTime)
                    }

                    if (todayFormat(currentTime) - billing > 0) {
                        const obj = {
                            meter_id: meter._id,
                            date: todayFormat(currentTime),
                            summa_A1: plusA,
                            tarif1_A1: tarifA1,
                            tarif2_A1: tarifA2,
                            tarif3_A1: tarifA3,
                            tarif4_A1: tarifA4,
                            summa_A0: 0,
                            tarif1_A0: 0,
                            tarif2_A0: 0,
                            tarif3_A0: 0,
                            tarif4_A0: 0,
                            summa_R1: plusR,
                            tarif1_R1: tarifR1,
                            tarif2_R1: tarifR2,
                            tarif3_R1: tarifR3,
                            tarif4_R1: tarifR4,
                            summa_R0: 0,
                            tarif1_R0: 0,
                            tarif2_R0: 0,
                            tarif3_R0: 0,
                            tarif4_R0: 0,
                        }
                        await repositories().billingRepository().insert(obj)
                        billing = todayFormat(currentTime)
                    }

                    await repositories().lastJoinRepository().update(meter._id, {
                        request_type: "current",
                        status: "succeed",
                        current: "succeed",
                        current_date: currentTime,
                    })
                    await repositories().lastCurrentRepository().updateSucceed({ meter_id: meter._id, parameters })
                    await repositories().previousObjectRepository().upd(_id, {
                        billing, archive, archiveTotalA, archiveTotalR,
                        currentTime,
                        plusA, tarifA1, tarifA2, tarifA3, tarifA4,
                        plusR, tarifR1, tarifR2, tarifR3, tarifR4
                    })
                }

                resolve('ok')
            } catch (error) {
                console.log(error)
            }
        })

        setTimeout(() => { fakeMeter(meter) }, 1000);
    } catch (error) {
        console.log(error)
        fakeMeter(meter)
    }
}

function timeFormat(date) {
    const roundedDate = new Date(date);
    roundedDate.setMinutes(roundedDate.getMinutes() - roundedDate.getMinutes() % 30);
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);
    return roundedDate;
}

function todayFormat(date1) {
    const date2 = new Date(date1)
    date2.setHours(0, 0, 0, 0)
    return date2
}

function currentTimeFormat(date1) {
    const date2 = new Date(date1)
    date2.setMinutes(0)
    date2.setSeconds(0)
    date2.setMilliseconds(0)
    date2.setHours(date2.getHours() - date2.getHours() % 3)
    return date2
}