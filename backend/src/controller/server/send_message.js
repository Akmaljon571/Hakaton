let writeToClient = null

module.exports.sendEventMessage = ({ id, status, where }) => {
    writeToClient && writeToClient(`data: ${JSON.stringify({ id, status, where })}\n\n`)
}

module.exports.sendMessage = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    writeToClient = res.write.bind(res)
    req.on('close', () => res.end());
}
