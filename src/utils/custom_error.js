module.exports = class CustomError {
	constructor(status, message) {
		this.status = status || 500;
		this.message = message || "Internal server Error";
	}
}
