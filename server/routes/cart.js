const express = require("express");
const cartController = require("../controllers/cart");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

// Retrieve user's cart
router.get("/get-cart", verify, cartController.getCart);

// Add to cart
router.post("/add-to-cart", verify, cartController.addToCart);

// Change Product Quanitites in cart
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);

// Remove from cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);

// Clear cart
router.put("/clear-cart", verify, cartController.clearCart);

module.exports = router;