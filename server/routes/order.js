const express = require("express");
const orderController = require("../controllers/order");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

// Checkout - Create Order
router.post("/checkout", verify, orderController.checkout);

// Get User's Orders
router.get("/my-orders", verify, orderController.getOrders);

// Get All Orders
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;
