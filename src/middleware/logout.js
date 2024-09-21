const jwt = require('jsonwebtoken');
const repo = require('../repository');
const CustomError = require('../utils/custom_error');

module.exports.logout = async (req, res, next) => {
    try {
        const access_token = req.cookies?.access_token;
        if (!access_token) return res.status(401).json({ status: 401, error: 'Unauthorized' });

        jwt.verify(access_token, process.env.SECRET_KEY, async (err, value) => {
            if (err) return res.status(406).json({ status: 406, error: 'Not Acceptable' });

            const find = await repo.repositories().adminRepository().findById(value.user)
            if (!find) return res.status(406).json({ status: 406, error: 'Not Acceptable' });

            if (find.role === 'admin' || find.role === 'super') {
                res.clearCookie('access_token')
                res.status(204).json({ status: 204 })
            } else {
                return res.status(400).json({ status: 400, error: 'Not Acceptable' });
            }
        });
    } catch (err) {
        const error = new CustomError(err.status, err.message)
        res.status(error.status).json({ status: error.status, error: error.message, data: null })
    }
};
