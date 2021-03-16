const HttpError = require("../utils/httpError");

/** Main app error handler */
const errorHandler = (err, _req, res, _next) => {
	console.error(err);

	// If error is not instance of HttpError create it with 500 status code
	if (!(err instanceof HttpError)) {
		err = new HttpError(500);
	}

	// Send 500 status response to the user
	res.status(err.status).json({
		err: err.message
	});
};

module.exports = errorHandler;
