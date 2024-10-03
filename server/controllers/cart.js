const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const auth = require("../auth");
const { errorHandler } = require("../auth");

// Get User's Cart
module.exports.getCart = async (req, res) => {

	try {

		if (req.user.isAdmin) {
			res.status(403).json({message: "Admin is forbidden"});
		}

		const cart = await Cart.findOne({userId: req.user.id});
		if (cart) {
			res.status(200).json({cart: cart});
		} else {
			res.status(404).json({error: "No cart found"});
		}

	} catch(error) {errorHandler(error, req, res)}

}

// Add To Cart
module.exports.addToCart = async (req, res) => {

	try {

		if (req.user.isAdmin) {
			return res.status(403).json({message: "Admin is forbidden"});
		}

		const productToAdd = {
			productId: req.body.productId,
			quantity: req.body.quantity,
			subtotal: req.body.subtotal
		};

		const cart = await Cart.findOne({userId: req.user.id});
		if (cart) { // with Cart

			cart.cartItems.push(productToAdd);
			cart.totalPrice += productToAdd.subtotal;

			const savedCart = await cart.save();

			res.status(200).json({
				message: "Item added to cart successfully",
				cart: savedCart
			});

		} else { // without Cart

			const newCart = new Cart({
				userId: req.user.id,
				cartItems: [{
					productId: productToAdd.productId,
					quantity: productToAdd.quantity,
					subtotal: productToAdd.subtotal
				}],
				totalPrice: productToAdd.subtotal
			});

			const savedCart = await newCart.save();

			res.status(200).json({
				message: "Item added to cart successfully",
				cart: savedCart
			})

		}

	} catch(error) {errorHandler(error, req, res)}

}

// Change Product Quanities
module.exports.updateCartQuantity = async (req, res) => {

	try {

		// Check if User is Admin
		if (req.user.isAdmin) {
			res.status(403).json({message: "Admin is forbidden"});
		}

		// Get Cart and Check if Exists
		const cart = await Cart.findOne({userId: req.user.id});
		if (!cart) {
			res.status(404).json({error: "No cart found"});
		}

		const productId = req.body.productId;
		const newQuantity = req.body.newQuantity;
		
		// Find Product in Cart and Get Product Info
		const product = cart.cartItems.find(product => product.productId == productId);
		const productInfo = await Product.findById(productId);

		if (!product) {
			res.status(404).json({error: "Product is not in cart"});
		} else {

			product.quantity = newQuantity;
			product.subtotal = productInfo.price * newQuantity;

			const newTotal = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
			cart.totalPrice = newTotal;

		}

		const savedCart = await cart.save();
		res.status(200).json({
			message: "Item quantity updated successfully",
			updatedCart: savedCart
		})

	} catch(error) {errorHandler(error, req, res)}

}

// Remove From Cart
module.exports.removeFromCart = async (req, res) => {

	try {

		if (req.user.isAdmin) {
			return res.status(403).json({ message: "Admin is forbidden" });
		}

		const cart = await Cart.findOne({ userId: req.user.id });
		if (!cart) {
			return res.status(404).json({ error: "No cart found" });
		}

		const productId = req.params.productId;

		// Find index of product to remove
		const productIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);
		if (productIndex === -1) {
			return res.status(404).json({ error: "Item not found in cart" });
		}

		// Remove product from cart
		const removedItem = cart.cartItems.splice(productIndex, 1)[0];

		// Update total price
		cart.totalPrice -= removedItem.subtotal;

		const savedCart = await cart.save();
		res.status(200).json({
			message: "Item removed from cart successfully",
			updatedCart: savedCart
		});

	} catch(error) {errorHandler(error, req, res)}

}

// Clear Cart
module.exports.clearCart = async (req, res) => {

	try {

		if (req.user.isAdmin) {
			return res.status(403).json({ message: "Admin is forbidden" });
		}

		const cart = await Cart.findOne({ userId: req.user.id });
		if (!cart) {
			return res.status(404).json({ error: "No cart found" });
		}

		// Clear all items and reset total price
		cart.cartItems = [];
		cart.totalPrice = 0;

		const savedCart = await cart.save();

		res.status(200).json({
			message: "Cart cleared successfully",
			cart: savedCart
		});

	} catch(error) {errorHandler(error, req, res)}

}


