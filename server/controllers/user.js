const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const { errorHandler } = require("../auth");


// User Registration
module.exports.registerUser = (req, res) => {

	// Checks if the email is in the right format
	if (!req.body.email.includes("@")){
			return res.status(400).send({
					error: "Email invalid"
			});
	}
	// Checks if the mobile number has the correct number of characters
	else if (req.body.mobileNo.length !== 11){
			return res.status(400).send({
					error: "Mobile number invalid"
			});
	}
	// Checks if the password has atleast 8 characters
	else if (req.body.password.length < 8) {
			return res.status(400).send({
					error: "Password must be atleast 8 characters" //try (at least) if there message error
			});
	// If all needed requirements are achieved
	} else {
			let newUser = new User({
					firstName : req.body.firstName,
					lastName : req.body.lastName,
					email : req.body.email,
					password : bcrypt.hashSync(req.body.password, 10),
					isAdmin : req.body.isAdmin,
					mobileNo : req.body.mobileNo
					
			})

			return newUser.save()
			.then((result) => res.status(201).send({
					message: "Registered Successfully"
			}))
			.catch(error => errorHandler(error, req, res));
	}
};

// User Authentication
module.exports.userAuthentication = (req, res) => {

	if (req.body.email == "") {
		return res.status(404).send({error: "No Email Found"});
	}

	if (req.body.email.includes("@")) {

		return User.findOne({email: req.body.email})
		.then(result => {
			if (result == null) {
				return res.status(404).send({error: "Email not found"});
			} else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if (isPasswordCorrect) {
					return res.status(200).send({
						access: auth.createAccessToken(result)
					});
				} else {
					return res.status(401).send({error: "Email and password do not match"});
				}
			}
		})
		.catch(error => errorHandler(error, req, res))
	} else {

		res.status(400).send({error: "Invalid email"});
	}
}

// Get User Details
module.exports.getUserDetails = (req, res) => {
	return User.findOne({_id: req.user.id}, {password: 0})
	.then(user => {
		if (user) {
			return res.status(200).send({user: user});
		} else {
			return res.status(404).send({error: "User not found"})
		}
	})
	.catch(error => errorHandler(error, req, res))
}

// Set User As Admin
module.exports.setAsAdmin = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);

		if (user == null) {
			res.status(404).send({error: "User not found"});
		}
		if (user.isAdmin == true) {
			res.status(200).send({message: "User is already an admin"});
		}

		const updatedUser = await User.findByIdAndUpdate(userId, {isAdmin: true}, {new: true});

		res.status(200).send({updatedUser: updatedUser});

	} catch (error) {
		res.status(500).json({
			error: "Failed in Find",
			details: error
		})
	}
}

// Update Password
module.exports.updatePassword = async (req, res) => {
	try {
		const newPassword = req.body.newPassword;
		if (newPassword.length < 8) {
			res.status(400).send({
				success: false,
				message: "Password must be atleast 8 characters long"
			})
		}

		const userId = req.user.id;

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		await User.findByIdAndUpdate(userId, {password: hashedPassword});

		res.status(201).json({message: "Password reset successfully"});

	} catch (error) {
		console.error(error);
		res.status(500).json({message: "Failed to reset password"});
	}
}