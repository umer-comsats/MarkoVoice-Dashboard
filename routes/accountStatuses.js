const express = require('express');
const router = express.Router();

const { AccountStatus, validateAccountStatus } = require('../models/accountStatus');

/**
 * Roles module handles all the routes of roles
 */

/** Read all Account Status from DB */
router.get('/', async (req, res) => {
	// read account status from database
	try {
		const accountStatuses = await AccountStatus.find().sort('name');
		if (accountStatuses.length > 0) {
			res.send(accountStatuses);
		} else {
			res.status(400).send('No Account Status Found');
		}
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** Create new Account Statuses */
router.post('/', async (req, res) => {
	// validate Account Status
	const { error } = validateAccountStatus(req.body);
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	// create new object of account status to be added
	let accountStatus = new AccountStatus({
		name: req.body.name
	});
	try {
		accountStatus = await accountStatus.save();
		res.send(accountStatus);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** Update the Account Status */
router.put('/:id', async (req, res) => {
	/** Update-First Approach */
	// validate
	const { error } = validateAccountStatus(req.body);
	//if invalid, return 400
	if (error) {
		return res.status(400).send(error.details[0].message);
	}

	try {
		// Look up the Account Status and update it
		const accountStatus = await AccountStatus.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name
			},
			{
				new: true
			}
		);
		// if not exists, return 404
		if (!accountStatus) {
			return res.status(404).send(`Account Status with Id = ${req.params.id} Not Found!`);
		}
		// returns the updated role
		res.send(accountStatus);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** To delete the Account Status */
router.delete('/:id', async (req, res) => {
	try {
		// Look up the account status
		const accountStatus = await AccountStatus.findByIdAndRemove(req.params.id);

		// if not exists, return 404
		if (!accountStatus) {
			return res.status(404).send(`Account Status with Id = ${req.params.id} Not Found!`);
		}

		//return the same course
		res.send(accountStatus);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

/** To get data with given id */
router.get('/:id', async (req, res) => {
	try {
		const accountStatus = await AccountStatus.findById(req.params.id);
		if (!accountStatus) {
			return res.status(404).send(`Account Status with Id = ${req.params.id} Not Found!`);
		}
		res.send(accountStatus);
	} catch (ex) {
		res.status(400).send(ex.message);
	}
});

module.exports = router;
