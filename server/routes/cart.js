const express = require("express");
const cartController = require("../controllers/cart");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

// Retrieve user's cart
router.get("/", verify, cartController.getCart);

// Add to cart
router.post("/", verify, cartController.addToCart);

// Change Product Quanitites in cart
router.patch("/update-quantity", verify, cartController.updateCartQuantity);

// Remove from cart
router.patch("/remove", verify, cartController.removeFromCart);

// Clear cart
router.put("/clear", verify, cartController.clearCart);

module.exports = router;