const Product = require("../models/Product");
const { errorHandler } = require("../auth");

// Create Product (Admin only)
module.exports.createProduct = async (req, res) => {

    try {

        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(200).json({
            product: savedProduct
        });

    } catch(error) {errorHandler(error, req, res)}

}

// Retrieve all products
module.exports.getAllProducts = async (req, res) => {

    try {

        if (!req.user.isAdmin) {
            res.status(403).json({
                auth: "Failed",
                message: "Action Forbidden"
            });
        }

        const products = await Product.find();
        res.status(200).json(products);

    } catch(error) {errorHandler(error, req, res)}

}

// Retrieve all active products
module.exports.getActiveProducts = async (req, res) => {

    try {

        const products = await Product.find({ isActive: true });
        res.status(200).json(products);

    } catch(error) {errorHandler(error, req, res)}

}

// Retrieve single product
module.exports.getProductById = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);
        if (!product || product.isActive === false) {
            res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);

    } catch(error) {errorHandler(error, req, res)}

}

// Search Product by Name
module.exports.searchProductName = async (req, res) => {

    try {

        const productName = req.body.name;
        const products = await Product.find({
            name: {$regex: new RegExp(productName, "i")},
            isActive: true
        });

        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({error: "No products found"});
        }

    } catch(error) {errorHandler(error, req, res)}

}

// Search Products in Price Range
module.exports.searchProductInPriceRange = async (req, res) => {

    try {

        const minPrice = req.body.minPrice;
        const maxPrice = req.body.maxPrice;

        if (typeof minPrice !== "number" || typeof maxPrice !== "number") {
            res.status(400).json({error: "Please enter a number"});
        }
        if (minPrice > maxPrice) {
            res.status(400).json({error: "Min Price must be less than Max Price"});
        }

        const products = await Product.find({
            price: {$gte: minPrice, $lte: maxPrice}, 
            isActive: true
        });

        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({error: "No products found"});
        }

    } catch(error) {errorHandler(error, req, res)}

}

// Update Product information (Admin only)
module.exports.updateProduct = async (req, res) => {

    try {

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully"
        });

    } catch(error) {errorHandler(error, req, res)}

}

// Archive Product (Admin only)
module.exports.archiveProduct = async (req, res) => {

    try {

        const findProduct = await Product.findById(req.params.id);
        if (!findProduct) {
            return res.status(404).json({error: "Product not found"});
        }

        if (findProduct.isActive == false) {
            return res.status(200).json({
                message: "Product already archived",
                archivedProduct: findProduct
            });
        }

        const archivedProduct = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        res.status(200).json({
            success: true,
            message: "Product archived successfully"
        });

    } catch(error) {errorHandler(error, req, res)}

}

// Activate Product (Admin only)
module.exports.activateProduct = async (req, res) => {

    try {

        const findProduct = await Product.findById(req.params.id);
        if (!findProduct) {
            return res.status(404).json({error: "Product not found"});
        }

        if (findProduct.isActive == true) {
            return res.status(200).json({
                message: "Product already active",
                activatedProduct: findProduct
            });
        }

        const activatedProduct = await Product.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
        res.status(200).json({
            success: true,
            message: "Product activated successfully"
        });

    } catch(error) {errorHandler(error, req, res)}

}


