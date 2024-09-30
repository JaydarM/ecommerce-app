const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Checkout - Create Order
module.exports.checkout = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).json({ message: "Admin is forbidden" });
        }

        // Find user's cart
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart || cart.cartItems.length === 0) {
            return res.status(404).json({ error: "No Items to Checkout" });
        }

        // Prepare the order details
        const productsOrdered = cart.cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            subtotal: item.subtotal
        }));

        // Create a new order
        const newOrder = new Order({
            userId: req.user.id,
            productsOrdered: productsOrdered,
            totalPrice: cart.totalPrice
        });

        // Save the new order
        const savedOrder = await newOrder.save();

        // Clear the user's cart after checkout
        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            message: "Ordered Successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get User's Orders
module.exports.getOrders = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).json({ message: "Admin is forbidden" });
        }

        // Find orders for the user
        const orders = await Order.find({ userId: req.user.id });

        if (orders.length > 0) {
            res.status(200).json({ orders: orders });
        } else {
            res.status(404).json({ message: "No orders found for this user" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Orders (Admin)
module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        if (orders.length > 0) {
            res.status(200).json({orders: orders});
        } else {
            res.status(404).json({error: "No orders found"});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

