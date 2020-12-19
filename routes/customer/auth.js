const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Customer } = require('../../models/customer');

/** Create new customer */
router.post('/', async (req, res) => {
	// validate customer
	const { error } = validateCustomer(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	// to check customer is not already registered
	let customer = await Customer.findOne({ email: req.body.email });
	if (!customer) {
		return res.status(400).send('Invalid Email or Password.');
	}

	const validPassword = await bcrypt.compare(req.body.password, customer.password);

	if (!validPassword) {
		return res.status(400).send('Invalid Password.');
	}
	/**
     * Creating a json web token
     * 1st arg: payload (can add any property)
     * 2nd arg: private key (it will generate digital signature)
     */
	const token = jwt.sign({ _id: customer._id, name: customer.name, email: customer.email }, 'jwtCustPrivateKey');
	res.send(token);
});

/** function to validate customer login request (what the client sents us)*/
function validateCustomer(customer) {
	const schema = Joi.object({
		email: Joi.string().min(5).max(255).required().label('Email').email(),
		password: Joi.string().min(5).max(1024).required().label('Password')
	});
	return schema.validate(customer);
}

module.exports = router;
