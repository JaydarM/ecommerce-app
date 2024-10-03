const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const { errorHandler } = require("../auth");


// User Registration
module.exports.registerUser = async (req, res) => {

	try {

		let newUser = new User({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			email : req.body.email,
			password : bcrypt.hashSync(req.body.password, 10),
			isAdmin : req.body.isAdmin,
			mobileNo : req.body.mobileNo
		});

		// Checks if the email is in the right format
		if (!newUser.email.includes("@")){
			res.status(400).json({error: "Email invalid"});
		}
		// Checks if the mobile number has the correct number of characters
		if (newUser.mobileNo.length !== 11){
			res.status(400).json({error: "Mobile number invalid"});
		}
		// Checks if the password has atleast 8 characters
		if (newUser.password.length < 8) {
			res.status(400).json({error: "Password must be atleast 8 characters"});
		}
		// Check if Email is already used
		const usedEmail = await User.findOne({email: newUser.email});
		if (usedEmail) {
			res.status(400).json({error: "Email already used"});
		}
		
		await newUser.save();
		res.status(201).json({
			success: true,
			message: "Registered Successfully"
		});
		
	} catch(error) {errorHandler(error, req, res)}

};

// User Authentication
module.exports.userAuthentication = async (req, res) => {

	try {

		if (req.body.email == "") {
			res.status(404).json({error: "Email Empty"});
		}
		if (!req.body.email.includes("@")) {
			res.status(400).json({error: "Invalid email"});
		}
		if (req.body.password == "") {
			res.status(404).json({error: "Password Empty"});
		}

		const user = await User.findOne({email: req.body.email});
		if (user === null) {
			res.status(404).json({error: "Email not found"});
		}

		const isPasswordCorrect = await bcrypt.compareSync(req.body.password, user.password);
		if (isPasswordCorrect === false) {
			res.status(401).json({error: "Email and password do not match"});
		} else {
			res.status(200).json({access: auth.createAccessToken(user)});
		}

	} catch(error) {errorHandler(error, req, res)}
	
}

// Get User Details (User)
module.exports.getUserDetails = async (req, res) => {

	try {

		const user = await User.findOne({_id: req.user.id}, {password: 0});
		if (user) {
			res.status(200).json({user: user});
		} else {
			res.status(404).json({error: "User not found"});
		}

	} catch(error) {errorHandler(error, req, res)}
}


// Set User As Admin (Admin)
module.exports.setAsAdmin = async (req, res) => {

	try {

		const userId = req.params.id;
		const user = await User.findById(userId);
		if (user == null) {
			res.status(404).json({error: "User not found"});
		}
		if (user.isAdmin == true) {
			res.status(200).json({message: "User is already an admin"});
		}

		const updatedUser = await User.findByIdAndUpdate(userId, {isAdmin: true}, {new: true});
		res.status(200).json({updatedUser: updatedUser});

	} catch(error) {errorHandler(error, req, res)}

}

// Update Password (User)
module.exports.updatePassword = async (req, res) => {

	try {

		const newPassword = req.body.newPassword;
		if (newPassword.length < 8) {
			res.status(400).json({
				success: false,
				message: "Password must be atleast 8 characters long"
			})
		}

		const userId = req.user.id;
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUser = await User.findByIdAndUpdate(userId, {password: hashedPassword}, {new: true});
		res.status(201).json({
			success: true,
			message: "Password reset successfully"
		});

	} catch(error) {errorHandler(error, req, res)}

}

// Get List of Users (Admin)
module.exports.getAllUsers = async (req, res) => {

	try {

		/*if (!req.user.isAdmin) {
			res.status(403).json({
                auth: "Failed",
                message: "Action Forbidden"
            });
		}*/

		const userList = await User.find({});
		res.status(200).json(userList);

	} catch(error) {errorHandler(error, req, res)}

}