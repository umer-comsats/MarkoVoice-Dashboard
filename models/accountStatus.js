const mongoose = require('mongoose');
const Joi = require('joi');

/**
 * AccountStatus module has all the code for defining and validating the AccountStatus object
 */

/** Define Schema */
const accountStatusSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 50
	}
});

/** Create a Model */
const AccountStatus = mongoose.model('AccountStatus', accountStatusSchema);

/** function to validate role */
function validateAccountStatus(accountStatus) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required()
	});
	return schema.validate(accountStatus);
}

exports.validateAccountStatus = validateAccountStatus;
exports.AccountStatus = AccountStatus;
exports.accountStatusSchema = accountStatusSchema;
