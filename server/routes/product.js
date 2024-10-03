const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

// Create Product (Admin only)
router.post('/', verify, verifyAdmin, productController.createProduct);

// Retrieve all products (Admin only)
router.get('/', verify, verifyAdmin, productController.getAllProducts);

// Retrieve single product
router.get('/:id', productController.getProductById);

// Retrieve all active products
router.get('/active', productController.getActiveProducts);

// Update Product information (Admin only)
router.patch('/:id', verify, verifyAdmin, productController.updateProduct);

// Archive Product (Admin only)
router.patch('/:id/archive', verify, verifyAdmin, productController.archiveProduct);

// Activate Product (Admin only)
router.patch('/:id/activate', verify, verifyAdmin, productController.activateProduct);

// Search product by name
router.post("/search-by-name", productController.searchProductName);

// Search product in price range
router.post("/search-by-price", productController.searchProductInPriceRange);

module.exports = router;
