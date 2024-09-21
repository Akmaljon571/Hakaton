const CustomError = require("../../utils/custom_error");

module.exports.getDesktopData = async (req, res) => {
    try {
        return res.json("")
    } catch (err) {
        const error = new CustomError(err.status || 500, err.message || "Internal Server Error");
        res.status(error.status).json({ status: error.status, error: error.message, data: null });
    }
};

module.exports.newLicense = async (req, res) => {
    try {
        res.status(200).json({ status: 200, error: null, data: "Succesfull updated" });
    } catch (err) {
        const error = new CustomError(err.status || 500, err.message || "Internal Server Error");
        res.status(error.status).json({ status: error.status, error: error.message, data: null });
    }
}

module.exports.getLicenseData = async (req, res) => {
    try {
        res.status(200).json({
            status: 200, error: null, data: {
                activation_date: "2024-07-15T18:28:06.890Z",
                deactivation_date: "2026-10-15T18:28:06.890Z",
                expiration_date: "2124-07-15T18:28:06.890Z",
                meter_limit: "500",
            }
        });
    } catch (err) {
        const error = new CustomError(err.status || 500, err.message || "Internal Server Error");
        res.status(error.status).json({ status: error.status, error: error.message, data: null });
    }
}