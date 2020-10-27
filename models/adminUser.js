const mongoose = require('mongoose');
const Joi = require('joi');
const { roleSchema } = require('../models/role');

/**
 * adminUser module has all the code for defining and validating the adminUser object
 */

/** Create a Model and schema */
const User = mongoose.model(
	'Users',
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
		role: {
			type: roleSchema,
			required: true
		},
		phoneNumber: {
			type: Number,
			required: true,
			minlength: 1,
			maxlength: 15
		},
		roleDesc: {
			type: String,
			required: true,
			minLength: 5,
			maxLength: 255
		}
	})
);

/** function to validate add user (what the client sents us)*/
function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required().label('Name'),
		email: Joi.string().min(5).max(255).required().label('Email').email(),
		password: Joi.string().min(5).max(1024).label('Password'),
		roleId: Joi.objectId().required().label('Role'),
		phoneNumber: Joi.number().integer().required().label('Phone Number'),
		roleDesc: Joi.string().required().min(5).max(255).label('Role Decription')
	});
	return schema.validate(user);
}

/** function to validate edit user (what the client sents us)*/
function validateEditUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required().label('Name'),
		email: Joi.string().min(5).max(255).required().label('Email').email(),
		roleId: Joi.objectId().required().label('Role'),
		phoneNumber: Joi.number().integer().required().label('Phone Number'),
		roleDesc: Joi.string().required().min(5).max(255).label('Role Decription')
	});
	return schema.validate(user);
}

exports.validateUser = validateUser;
exports.validateEditUser = validateEditUser;
exports.User = User;
