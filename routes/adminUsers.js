const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Role } = require('../models/role');
const { User, validateUser, validateEditUser } = require('../models/adminUser');

/**
 * adminUsers module handles all the routes of adminUsers
 */

/** Read all users */
router.get('/', async (req, res) => {
	try {
		const users = await User.find().sort('name');
		res.send(users);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** Create new User */
router.post('/', async (req, res) => {
	// validate user
	const { error } = validateUser(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	// to check user is not already registered
	let user = await User.findOne({ email: req.body.email });
	if (user) {
		return res.status(400).send('User Already Registered.');
	}

	try {
		//get role
		const role = await Role.findById(req.body.roleId);
		if (!role) {
			return res.status(400).send('Invalid Role');
		}

		//create new object of user to be added
		user = new User({
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			// This is hybrid approach, will add just few properties.
			role: {
				_id: role._id,
				name: role.name
			},
			phoneNumber: req.body.phoneNumber,
			roleDesc: req.body.roleDesc
		});
		// adding salt to hash
		const salt = await bcrypt.genSalt(10);
		// encrypting the password
		user.password = await bcrypt.hash(user.password, salt);
		// saving the user in the database
		user = await user.save();
		res.send({
			name: user.name,
			email: user.email,
			role: user.role.name,
			phoneNumber: user.phoneNumber,
			roleDesc: user.roleDesc
		});
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** Update the user */
router.put('/:id', async (req, res) => {
	/** Update-First Approach */
	// validate
	const { error } = validateEditUser(req.body);
	//if invalid, return 400
	if (error) {
		return res.status(400).send(error.details[0].message);
	}
	try {
		//get role
		const role = await Role.findById(req.body.roleId);
		if (!role) {
			return res.status(400).send('Invalid Role');
		}

		let user = await User.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name,
				email: req.body.email,
				role: {
					_id: role._id,
					name: role.name
				},
				phoneNumber: req.body.phoneNumber,
				roleDesc: req.body.roleDesc
			},
			{
				new: true
			}
		);

		//if not exists, return 404
		if (!user) {
			return res.status(404).send(`User with Id = ${req.params.id} Not Found!`);
		}
		//returns the updated role
		res.send(user);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** To delete the user*/
router.delete('/:id', async (req, res) => {
	try {
		// Look up the user
		const user = await User.findByIdAndRemove(req.params.id);

		// if not exists, return 404
		if (!user) {
			return res.status(404).send(`User with Id = ${req.params.id} Not Found!`);
		}

		//return the same course
		res.send(user);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** To get data with given id */
router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user) {
			return res.status(404).send(`User with Id = ${req.params.id} Not Found!`);
		}
		res.send(user);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

module.exports = router;
