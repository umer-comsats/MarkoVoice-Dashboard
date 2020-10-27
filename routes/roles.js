const express = require('express');
const router = express.Router();

const { Role, validateRole } = require('../models/role');

/**
 * Roles module handles all the routes of roles
 */

/** Read all Roles from DB */
router.get('/', async (req, res) => {
	// read roles from database
	try {
		const roles = await Role.find().sort('name');
		if (roles.length > 0) {
			res.send(roles);
		} else {
			res.status(400).send('No Role Found');
		}
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** Create new Role */
router.post('/', async (req, res) => {
	// validate role
	const { error } = validateRole(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	// create new object of role to be added
	let role = new Role({
		name: req.body.name
	});
	try {
		role = await role.save();
		res.send(role);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** Update the Role */
router.put('/:id', async (req, res) => {
	/** Update-First Approach */
	// validate
	const { error } = validateRole(req.body);
	//if invalid, return 400
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	try {
		// Look up the role and update it
		const role = await Role.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name
			},
			{
				new: true
			}
		);
		// if not exists, return 404
		if (!role) {
			return res.status(404).send(`Role with Id = ${req.params.id} Not Found!`);
		}
		// returns the updated role
		res.send(role);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** To delete the role */
router.delete('/:id', async (req, res) => {
	try {
		// Look up the role
		const role = await Role.findByIdAndRemove(req.params.id);

		// if not exists, return 404
		if (!role) {
			return res.status(404).send(`Role with Id = ${req.params.id} Not Found!`);
		}

		//return the same course
		res.send(role);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** To get data with given id */
router.get('/:id', async (req, res) => {
	try {
		const role = await Role.findById(req.params.id);
		if (!role) {
			return res.status(404).send(`Role with Id = ${req.params.id} Not Found!`);
		}
		res.send(role);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

module.exports = router;
