const jwt = require('jsonwebtoken');
const repo = require('../repository');
const CustomError = require('../utils/custom_error');
const { sessionParse, sessionCreate } = require('../utils/session');

module.exports.refresh_token = async (req, res, next) => {
    try {
        const refresh_token = req.headers['refresh'];
        if (!refresh_token) return res.status(401).json({ status: 401, error: 'Unauthorized' });

        const { session } = req.headers
        if (!session) return res.status(405).json({ status: 405, error: 'Unauthorized' });

        const id = sessionParse(session, process.env.SECRET_KEY)
        const sessionData = await repo.repositories().authRepository().findOne({ _id: id })
        if (!sessionData) return await removeSession(id, res)

        jwt.verify(refresh_token, process.env.SECRET_KEY, async (err, value) => {
            if (err) return await removeSession(id, res)

            const find = await repo.repositories().adminRepository().findById(value.user)
            if (!find) return await removeSession(id, res)

            if (find.role === 'admin' || find.role === 'super') {
                const access = jwt.sign({ user: find._id }, process.env.SECRET_KEY, { expiresIn: '1m' });
                const newSession = sessionCreate(id, process.env.SECRET_KEY)

                res.cookie('access_token', access);
                res.status(200).json({ status: 200, session: newSession });
            } else {
                return await removeSession(id, res)
            }
        });
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
};


const removeSession = async (id, res) => {
    await repo.repositories().authRepository().remove({ _id: id })
    return res.status(403).json({ status: 403, error: 'Forbidden' });
}
