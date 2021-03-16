const fs = require("fs");
const path = require("path");
const { body, validationResult } = require("express-validator");
const Product = require("../models/product");
const HttpError = require("../utils/httpError");

class ProductController {
	/** Delete product image */
	deleteImage(product) {
		// Get product image filename
		const filename = product.imageUrl.split("/").pop();
		// Get it's server loction
		const filePath = path.resolve(__dirname, "../../uploads", filename);
		// Check if image is not default image and it exists
		if (filename !== "default.jpg" && fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
	}

	/** Get all products */
	async get(_req, res, next) {
		try {
			// Get all products
			const products = await Product.find();
			// Return products to the client
			res.status(200).json(products);
		} catch (err) {
			next(err);
		}
	}

	/** Get single product by it's id */
	async getOne(req, res, next) {
		const { id } = req.params;

		try {
			// Find product
			const product = await Product.findOne({ _id: id });
			// If product doesn't exist return 404 response
			if (!product) throw new HttpError(404);
			// Return product to the client
			res.status(200).json(product);
		} catch (err) {
			next(err);
		}
	}

	/** Product create validator */
	createValidator() {
		return [
			body("name", "Invalid product name").isString().exists(),
			body("price", "Invalid product price")
				.customSanitizer(parseFloat)
				.isFloat({
					min: 1
				})
				.exists(),
			body("quantity", "Invalid product quantity")
				.customSanitizer(parseInt)
				.isInt({
					min: 1
				})
				.optional()
		];
	}

	/** Create product handler */
	async create(req, res, next) {
		const image = req.file;

		try {
			// Check if body is correct
			if (!validationResult(req).isEmpty()) throw new HttpError(400);

			// Get product image file name
			let imagePath;
			if (!image) imagePath = "default.jpg";
			else imagePath = image.filename;

			// Create new product and save it
			const product = new Product({
				...req.body,
				imageUrl: `http://localhost:3000/static/${imagePath}`
			});
			await product.save();
			// Return product to the client
			res.status(201).json(product);
		} catch (err) {
			next(err);
		}
	}

	/** Product update validator */
	updateValidator() {
		return [
			body("name", "Invalid product name").isString().optional(),
			body("price", "Invalid product price")
				.customSanitizer(parseFloat)
				.isFloat({
					min: 1
				})
				.optional(),
			body("quantity", "Invalid product quantity")
				.customSanitizer(parseInt)
				.isInt({
					min: 1
				})
				.optional()
		];
	}

	/** Product update handler */
	async update(req, res, next) {
		const image = req.file;
		const { id } = req.params;

		try {
			// Validate and parse body
			if (!validationResult(req).isEmpty()) throw new HttpError(400);

			// Find product
			const product = await Product.findOne({ _id: id });
			if (!product) throw new HttpError(404);

			// Update image
			if (image) {
				// Delete image product from the file server
				this.deleteImage(product);
				// Set new image path
				await product.updateOne({
					imageUrl: `http://localhost:3000/static/${image.filename}`
				});
			}

			// Update product and return
			await product.updateOne(req.body, { new: true });
			const updatedProduct = await Product.findOne({ _id: id });
			// Return product to the user
			res.status(200).json(updatedProduct);
		} catch (err) {
			next(err);
		}
	}

	/** Delete product handler */
	async delete(req, res, next) {
		const { id } = req.params;

		try {
			// Find product
			const product = await Product.findOne({ _id: id });
			// If product doesn't exist return 404 response
			if (!product) throw new HttpError(404);
			// Delete it's image
			this.deleteImage(product);
			// Delete product
			await product.delete();
			// Return message about succesful deletion of product
			res.status(200).json({
				message: "Product succesfully deleted"
			});
		} catch (err) {
			next(err);
		}
	}
}

module.exports = new ProductController();
