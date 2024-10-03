const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order"); 

require("dotenv").config();

const app = express();

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () => console.log("Now connected to MongoDB Atlas"));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
    origin: ['http://localhost:3000', 'http://zuitt-bootcamp-prod-460-7861-madrazo.s3-website.us-east-1.amazonaws.com'], 
    credentials: true, 
    optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

// Use users routes
app.use("/users", userRoutes);

// Use product routes
app.use("/products", productRoutes);

// Use cart routes
app.use("/cart", cartRoutes);

// Use orders routes
app.use("/orders", orderRoutes); 



if (require.main === module) {
	app.listen(process.env.PORT || 3000, () => {
		console.log(`API is now online on port ${process.env.PORT || 3000}`)
	});
}

module.exports = {app, mongoose};