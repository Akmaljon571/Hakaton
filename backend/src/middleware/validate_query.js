module.exports.validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.query)
            if (error) {
                return res.status(400).json({
                    status: 400,
                    message: error?.message
                });
            }
            req.data = value
            next()
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}