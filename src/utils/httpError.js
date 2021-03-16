const { STATUS_CODES } = require("http");

/** Http error class */
class HttpError extends Error {
	constructor(status) {
		super(STATUS_CODES[status]);
		this.status = status;
	}
}

module.exports = HttpError;
