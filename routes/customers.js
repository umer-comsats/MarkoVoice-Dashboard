const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { AccountStatus } = require('../models/accountStatus');
const { Customer, validateAddCustomer, validateEditCustomer } = require('../models/customer');

/**
 * customers module handles all the routes of customers
 * 
 */

/** Read all customers */
router.get('/', async (req, res) => {
	try {
		const customers = await Customer.find().sort('name');
		res.send(customers);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** Create new Customers */
router.post('/', async (req, res) => {
	// validate customers
	const { error } = validateAddCustomer(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	// to check customer is not already registered
	let customer = await Customer.findOne({ email: req.body.email });
	if (customer) {
		return res.status(400).send('Customer Already Registered.');
	}
	try {
		//get roaccount status
		const accountStatus = await AccountStatus.findById(req.body.statusId);
		if (!accountStatus) {
			return res.status(400).send('Invalid Account Status');
		}

		//create new object of Customer to be added
		let customer = new Customer({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			// status object is copying values of id and name from accountStatus model.
			status: {
				_id: accountStatus._id,
				name: accountStatus.name
			},
			phoneNumber: req.body.phoneNumber,
			package: req.body.package
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

/** Update the Customer */
router.put('/:id', async (req, res) => {
	/** Update-First Approach */
	// validate
	const { error } = validateEditCustomer(req.body);
	//if invalid, return 400
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	try {
		//get account status
		const accountStatus = await AccountStatus.findById(req.body.statusId);
		if (!accountStatus) {
			return res.status(400).send('Invalid Account Status');
		}

		// Look up the role and update it
		let customer = await Customer.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name,
				email: req.body.email,
				status: {
					_id: accountStatus._id,
					name: accountStatus.name
				},
				phoneNumber: req.body.phoneNumber,
				package: req.body.package
			},
			{
				new: true
			}
		);

		//if not exists, return 404
		if (!customer) {
			return res.status(404).send(`Customer with Id = ${req.params.id} Not Found!`);
		}
		//returns the updated role
		res.send(customer);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** To delete the Customer */
router.delete('/:id', async (req, res) => {
	try {
		// Look up the user
		const customer = await Customer.findByIdAndRemove(req.params.id);

		// if not exists, return 404
		if (!customer) {
			return res.status(404).send(`Customer with Id = ${req.params.id} Not Found!`);
		}

		//return the same course
		res.send(customer);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** To get customer with given id */
router.get('/:id', async (req, res) => {
	try {
		const customer = await Customer.findById(req.params.id);
		if (!customer) {
			return res.status(404).send(`Customer with Id = ${req.params.id} Not Found!`);
		}
		res.send(customer);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

module.exports = router;
