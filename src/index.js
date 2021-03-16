const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const ProductController = require("./routes/product");
const errorHandler = require("./middlewares/error");
const path = require("path");

// Connect to mongodb
mongoose.connect("mongodb://localhost:27017/shop", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

const app = express();

// Set up middlewares
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.resolve(__dirname, "../uploads")));
app.use("/products", ProductController);

// Use error handler
app.use(errorHandler);

// Listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
