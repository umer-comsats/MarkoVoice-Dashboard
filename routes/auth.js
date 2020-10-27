const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/adminUser');

/** Create new User */
router.post('/', async (req, res) => {
	// validate user
	const { error } = validateUser(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	// to check user is not already registered
	let user = await User.findOne({ email: req.body.email });
	if (!user) {
		return res.status(400).send('Invalid Email or Password.');
	}

	const validPassword = await bcrypt.compare(req.body.password, user.password);

	if (!validPassword) {
		return res.status(400).send('Invalid Password.');
	}
	//means user is authenticate (valid email + pass)
	// res.send(true);
	//
	/**
     * Creating a json web token
     * 1st arg: payload (can add any property)
     * 2nd arg: private key (it will generate digital signature)
     */
	const token = jwt.sign(
		{ _id: user._id, name: user.name, role: user.role.name, email: user.email },
		'jwtPrivateKey'
	);
	res.send(token);
});

/** function to validate user login request (what the client sents us)*/
function validateUser(user) {
	const schema = Joi.object({
		email: Joi.string().min(5).max(255).required().label('Email').email(),
		password: Joi.string().min(5).max(1024).required().label('Password')
	});
	return schema.validate(user);
}

module.exports = router;
