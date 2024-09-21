module.exports.validate = (schema) => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body)
            if (error) {
                return res.status(400).json({
                    status: 400,
                    message: error?.message
                });
            }
            req.result = value
            next()
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}