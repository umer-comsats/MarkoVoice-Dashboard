import React, { Component } from 'react';
import Joi from 'joi-browser';
import Input from './input';
import Select from './select';
import { CheckSquare } from 'react-feather';
/**
 * This is a Reusable Form class.
 * Form class containing reusable components.
 * This can be extended to any other form like login, registration etc
 * 
 * In child classes:
 * initialises the state, set the schema for that form
 * determine what should happen when form submits
 * what to return when the form is rendered.
 * Rest of the things is handled by user defined Form class(reusable with any other form)
 * 
 * Author: Muhammad Mansha
 */

class Form extends Component {
	state = {
		data: {},
		errors: {}
	};

	/* validate using Joi Library */
	validate = () => {
		const options = { abortEarly: false };
		const { error } = Joi.validate(this.state.data, this.schema, options);
		if (!error) return null;

		const errors = {};
		/*map array into object*/
		// error is an object return by Joi which contains a property details(an array), which further has path property.
		// First element of path is the name of our target property.
		//error object also contains mesaage property
		for (let item of error.details) errors[item.path[0]] = item.message;
		return errors;
	};

	/* validating each property using Joi  */
	// name: name of currentTarget input field
	// value: value of currentTarget input field
	validateProperty = ({ name, value }) => {
		//setting property of object (key/value)
		const obj = { [name]: value };
		const schema = { [name]: this.schema[name] };
		const { error } = Joi.validate(obj, schema);
		return error ? error.details[0].message : null;
	};

	//when form gets submit
	handleSubmit = (e) => {
		// to stop default behavior
		e.preventDefault();

		const errors = this.validate();
		this.setState({ errors: errors || {} });
		if (errors) return;

		this.doSubmit();
	};

	//to keep form sync with state
	// to sync input field state with form state
	handleChange = ({ currentTarget: input }) => {
		const errors = { ...this.state.errors };
		const errorMsg = this.validateProperty(input);
		//dynamically setting property of error object same as currentTarget input name
		if (errorMsg) errors[input.name] = errorMsg;
		else delete errors[input.name];
		// it will check if input named hiddenError is trucy, if yes, it will hide it by deleting the erro message
		errors.hiddenError && delete errors.hiddenError;
		const data = { ...this.state.data };
		data[input.name] = input.value;
		this.setState({ data, errors });
	};

	renderSubmitButton(label) {
		return (
			<button
				disabled={this.validate()} //If it returns null, it means false, if it returns error object, then it means tue
				className="btn btn-primary"
			>
				<CheckSquare size={16} color="#FFF" className="mr-1" />
				{label}
			</button>
		);
	}

	renderInput(name, label, type = 'text', placeholder) {
		const { data, errors } = this.state;
		return (
			<Input
				name={name}
				label={label || null}
				placeholder={placeholder || null}
				value={data[name]}
				type={type}
				onChange={this.handleChange}
				error={errors[name]}
			/>
		);
	}

	renderSelect(name, label, options) {
		const { data, errors } = this.state;
		return (
			<Select
				name={name}
				label={label}
				value={data[name]}
				options={options}
				onChange={this.handleChange}
				error={errors[name]}
			/>
		);
	}
}

export default Form;
