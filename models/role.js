const mongoose = require('mongoose');
const Joi = require('joi');

/**
 * Role module has all the code for defining and validating the role object
 */

/** Define Schema */
const roleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50
	}
});

/** Create a Model */
const Role = mongoose.model('Role', roleSchema);

/** function to validate role */
function validateRole(role) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required()
	});
	return schema.validate(role);
}

exports.validateRole = validateRole;
exports.Role = Role;
exports.roleSchema = roleSchema;
