const express = require("express");
const orderController = require("../controllers/order");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

// Checkout - Create Order
router.post("/checkout", verify, orderController.checkout);

// Get User's Orders
router.get("/", verify, orderController.getOrders);

// Get All Orders
router.get("/all", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;
