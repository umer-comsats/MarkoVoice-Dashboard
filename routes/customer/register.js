const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Customer, validateSignupCustomer } = require('../../models/customer');

/** Create new Customers */
router.post('/', async (req, res) => {
	// validate customers
	const { error } = validateSignupCustomer(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	// to check customer is not already registered
	let customer = await Customer.findOne({ email: req.body.email });
	if (customer) {
		return res.status(400).send('Customer Already Registered.');
	}
	try {
		//create new object of Customer to be added (with some default values to make data consist with dashboard)
		let customer = new Customer({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			phoneNumber: req.body.phoneNumber,
			package: 'Basic',
			status: {
				_id: '5fdd56b70721c66c996d4778',
				name: 'Pending'
			}
		});
		// adding salt to hash
		const salt = await bcrypt.genSalt(10);
		// encrypting the password
		customer.password = await bcrypt.hash(customer.password, salt);
		customer = await customer.save();
		res.send(customer);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

module.exports = router;
