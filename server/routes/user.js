const express = require("express");
const userController = require("../controllers/user");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

// Route for User Registration
router.post("/register", userController.registerUser);

// Route for User Authentication
router.post("/login", userController.userAuthentication);

// Route for Get User Details
router.get("/details", verify, userController.getUserDetails);

// Route to Set User As Admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

// Route to Update Password
router.patch("/update-password", verify, userController.updatePassword);

module.exports = router;