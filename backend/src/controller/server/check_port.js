const net = require('net');
const CustomError = require('../../utils/custom_error');
const repo = require('../../repository');

module.exports.checkPortFn = async (req, res) => {
    try {
        const { port } = req.params
        const server = net.createServer();

        if ((await repo.repositories().meterRepository().findListAlreadyPorts()).includes(port)) {
            return res.status(404).json({ status: 404, message: "Port In Database" })
        }

        const timeOut = setTimeout(() => {
            return res.status(200).json({ status: 200, message: "Port Already busy" })
        }, 5000);

        server.listen(port, () => {
            server.close();
            clearTimeout(timeOut)
            return res.status(404).json({ status: 404, message: "Port Not Working" })
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                clearTimeout(timeOut)
                return res.status(200).json({ status: 200, message: "Port Already busy" })
            }
        })
    } catch (err) {
        const error = new CustomError(err.message)
        return res.status(err.status).json({ status: error.status, message: error.message })
    }
}
