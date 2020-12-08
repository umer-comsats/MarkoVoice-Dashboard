const mongoose = require('mongoose');
const Joi = require('joi');
const { accountStatusSchema } = require('../models/accountStatus');

/**
 * customer module has all the code for defining and validating the Customer object
 */

/** Create a Model and schema */
const Customer = mongoose.model(
	'Customers',
	new mongoose.Schema({
		name: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 50
		},
		email: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 255,
			lowercase: true,
			unique: true
		},
		password: {
			type: String,
			required: true,
			minlength: 5,
			maxlength: 1024
		},
		//no need for accountStatus, instead customization status will be used.
		status: {
			type: accountStatusSchema,
			required: true
		},
		phoneNumber: {
			type: Number,
			required: true,
			minlength: 10,
			maxlength: 15
		},
		//package must be in customization and not here!
		package: {
			type: String,
			required: true,
			minLength: 5,
			maxLength: 255
		}
	})
);

/** function to validate add customer form (what the client sents us)*/
function validateAddCustomer(customer) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required().label('Name'),
		email: Joi.string().required().label('Email').email(),
		password: Joi.string().min(5).max(1024).required().label('Password'),
		statusId: Joi.objectId().required().label('Status Id'),
		phoneNumber: Joi.number().integer().required().min(0).label('Phone Number'),
		package: Joi.string().required().min(0).max(255).label('Package Name')
	});
	return schema.validate(customer);
}

/** function to validate edit customer form (what the client sents us)*/
function validateEditCustomer(customer) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required().label('Name'),
		email: Joi.string().required().label('Email').email(),
		statusId: Joi.objectId().required().label('Status Id'),
		phoneNumber: Joi.number().integer().required().min(0).label('Phone Number'),
		package: Joi.string().required().min(0).max(255).label('Package Name')
	});
	return schema.validate(customer);
}

exports.validateAddCustomer = validateAddCustomer;
exports.validateEditCustomer = validateEditCustomer;
exports.Customer = Customer;
