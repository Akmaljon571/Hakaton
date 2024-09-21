const { logModel } = require("../../models");

module.exports.logRepository = () => {
    return Object.freeze({ create })

    async function create(req, process_id, process) {
        const status = process.split(' ')[1]
        if(status == 'create') {
            await logModel.create({admin_id: req.admin, process_id, process, date: new Date(), status: 'Create'});
        } else if (status == 'update') {
            await logModel.create({admin_id: req.admin, process_id, process, date: new Date(), status: 'Update'});
        } else if(status == 'delete') {
            await logModel.create({admin_id: req.admin, process_id, process, date: new Date(), status: 'Delete'});
        } else if(status == 'activate') {
            await logModel.create({admin_id: req.admin, process_id, process, date: new Date(), status: 'Activate'});
        }
    }
}
