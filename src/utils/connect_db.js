const mongoose = require('mongoose');
const repo = require('../repository');

module.exports.connectDB = async (app, PORT, DB) => {
    try {
        await mongoose.connect(DB)
        app.listen(PORT, async () => {
            // (await electObjectModel.find()).map(async(elect) => {
            //     const params = elect.parameters.map(param => {
            //         if(!param.from) {
            //             param.from = param.meter
            //         }
            //         return param
            //     })
            //     await electObjectModel.updateOne({ _id: elect._id }, {parameters: params })
            // })
            console.log(`Server run: ${PORT}`)
        });

        await repo.repositories().lastJoinRepository().updateLastFailed()
    } catch (error) {
        console.log('Serverda xatolik yuz berdi', error.message);
        process.exit(1);
    }
};
