const CustomError = require("../../utils/custom_error");
const repo = require("..");
const { feederModel } = require("../../models");
const { electModel } = require("../../global/enum");

module.exports.feederRepository = () => {
    return Object.freeze({
        insert,
        findFeeder,
        updateFeeder
    });

    async function insert({ date, multiply, feeder, vt, ct }) {
        const newObj = {
            TN: multiply[1],
            TT: multiply[0],
            VT: vt,
            CT: ct,
            date,
            feeder
        }
        await feederModel.insertMany(newObj);
    }

    async function findFeeder(feeder) {
        try {
            return await feederModel.findOne({ feeder })
        } catch (error) {
            console.log(error)
            throw new CustomError(error.status, error.message);
        }
    }

    async function updateFeeder(id, old, { multiply, date, vt: VT, ct: CT }, meter_id) {
        try {
            let find = await feederModel.findOne({ feeder: id })
            if (find && find.date) {
                const newObj = {
                    TT: [],
                    TN: [],
                    VT: [],
                    CT: [],
                    date: [],
                }

                for (let i = 0; i < find.date.length; i++) {
                    if (new Date(find.date[i]) - new Date(date) < 0) {
                        newObj.TT.push(find.TT[i])
                        newObj.TN.push(find.TN[i])
                        newObj.VT.push(find.VT[i])
                        newObj.CT.push(find.CT[i])
                        newObj.date.push(find.date[i])
                    }
                }
                newObj.TT.push(multiply[0])
                newObj.TN.push(multiply[1])
                newObj.VT.push(VT)
                newObj.CT.push(CT)
                newObj.date.push(date)

                await feederModel.updateOne({ feeder: id }, newObj)
            } else {
                if (old.createdAt - date < 0) {
                    const newObj = {
                        TN: [old.parameters[0].multiply[1], multiply[1]],
                        TT: [old.parameters[0].multiply[0], multiply[0]],
                        VT: [old.vt, VT],
                        CT: [old.ct, CT],
                        date: [old.createdAt, date],
                        feeder: id
                    }
                    await feederModel.insertMany(newObj);
                } else {
                    const newObj = {
                        TN: [multiply[1]],
                        TT: [multiply[0]],
                        VT: [VT],
                        CT: [CT],
                        date: [date],
                        feeder: id
                    }
                    await feederModel.insertMany(newObj);
                }
            }
            const findList = await repo.repositories().electObjectRepository().findWithQuery({ "parameters.meter": meter_id })
            for (const elect of findList) {
                for (const findParam of elect.parameters) {
                    findParam.multiply = multiply
                }
                if (electModel.includes(elect.type)) {
                    await repo.repositories().electObjectRepository().update(elect._id, { parameters: elect.parameters })
                } else {
                    await repo.repositories().calculationObjectRepository().update(elect._id, { parameters: elect.parameters })
                }
            }
        } catch (error) {
            throw new CustomError(error.status, error.message);
        }
    }
}
