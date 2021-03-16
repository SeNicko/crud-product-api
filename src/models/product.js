const mongoose = require("mongoose");

// Model for product
const ProductSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	quantity: {
		type: Number
	},
	imageUrl: {
		type: String,
		default: "http://localhost:3000/static/default.jpg"
	}
});

// Export mongodb Product
module.exports = mongoose.model("product", ProductSchema);
