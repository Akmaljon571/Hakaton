const { repositories } = require("../repository");
const { fakeMeterRun } = require("./fake_meter");

const familyObject = {}
module.exports.startMiddleware = async () => {
    try {
        const meters = await repositories().meterRepository().findAll({})
        meters.reduce((arr, e) => e.port ? Object.keys(familyObject).includes(key(e.ip_address, e.port)) ? (familyObject[key(e.ip_address, e.port)].push(e), arr) : (familyObject[key(e.ip_address, e.port)] = [e], arr.push(key(e.ip_address, e.port)), arr) : arr, []);

        Object.values(familyObject).forEach(async (value) => { mainFor(value) })
        fakeMeterRun(meters)
    } catch (error) {
        console.log(error)
        this.startMiddleware()
    }
}

async function mainFor(meters) {
    try {
        for (const meter of meters) {
            const journalParameter = { meter: meter._id, request_type: "date", status: "sent" }
            const newJournalDocument = await repositories().journalRepository().insert(journalParameter)

            await new Promise((resolve, reject) => {
                const timeout = setTimeout(async () => {
                    clearTimeout(timeout)
                    resolve('tugadi')
                }, 5000);
            })

            await repositories().journalRepository().update({ _id: newJournalDocument._id, meter: meter._id, request_type: "date", status: "succeed" })
        }

        if (meters.length) { mainFor(meters) }
    } catch (error) {
        console.log(error)
        if (meters.length) { mainFor(meters) }
    }
}

function key(a, b) {
    if (b) return `${a},${b}`
}
