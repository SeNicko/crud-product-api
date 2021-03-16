const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, "uploads");
	},
	filename: (_req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	}
});

// Configure multer
const upload = multer({
	storage,
	fileFilter: (_req, file, cb) => {
		if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
			cb(null, true);
		} else {
			cb(null, false);
		}
	}
});

module.exports = upload;
