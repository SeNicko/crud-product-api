const { Router } = require("express");
const ProductController = require("../controllers/product");
const upload = require("../config/multer");

// Create new router
const router = Router();

// Set handlers for product route
router.get("/", ProductController.get);
router.get("/:id", ProductController.getOne);
router.post(
	"/",
	upload.single("image"),
	ProductController.createValidator(),
	ProductController.create
);
router.put(
	"/:id",
	upload.single("image"),
	ProductController.updateValidator(),
	ProductController.update.bind(ProductController)
);
router.delete("/:id", ProductController.delete.bind(ProductController));

module.exports = router;
