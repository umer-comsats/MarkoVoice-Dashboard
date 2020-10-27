// import external modules
import React, { Fragment } from 'react';
import Joi from 'joi-browser';
import { Card } from 'reactstrap';
import { toast } from 'react-toastify';

import { addCustomer } from '../../services/customerService';
import { getAllStatus } from '../../services/statusService';

import ContentHeader from '../../../components/contentHead/contentHeader';
import ContentSubHeader from '../../../components/contentHead/contentSubHeader';
import Form from '../../components/common/form';

/**
 * 
 * This file will render form to Add new customer.
 * Author: Muhammad Mansha
 *
 * initialises the state, set the schema for that form
 * determine what should happen when form submits
 * what to return when the form is rendered.
 * Rest of the things is handled by user defined Form class(reusable with any other form)
 */
class AddCustomerForm extends Form {
	state = {
		data: {
			name: '',
			email: '',
			password: '',
			statusId: '',
			package: '',
			phoneNumber: ''
		},
		allStatus: [],
		errors: {}
	};

	schema = {
		name: Joi.string().min(3).max(50).required().label('Name'),
		email: Joi.string().min(5).max(255).required().label('Email').email(),
		password: Joi.string().min(5).max(1024).required().label('Password'),
		statusId: Joi.string().required().label('Status'),
		package: Joi.string().required().min(5).max(255).label('Package'),
		phoneNumber: Joi.number().integer().required().label('Phone Number')
	};

	async populateStatus() {
		const customerId = this.props.match.params.id;
		if (customerId.toString().trim() === 'new') {
			const { data: allStatus } = await getAllStatus();
			this.setState({ allStatus });
		} else {
			this.props.history.replace('/not-found');
		}
	}

	componentDidMount() {
		this.populateStatus();
	}

	doSubmit = async () => {
		try {
			await addCustomer(this.state.data);
			this.props.history.push('/admin/accounts/new-requests');
			toast.success('Customer Record Added Successfully.');
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				const errors = { ...this.state.errors };
				errors.email = ex.response.data;
				this.setState({ errors });
			}
		}
	};

	// dynamically assign classes
	getFormClasses() {
		let classes = 'col-lg-8 col-md-8 col-sm-12 offset-md-2 offset-lg-2';
		return classes;
	}

	render() {
		return (
			<Fragment>
				<ContentHeader>Add A New Customer Account</ContentHeader>
				<ContentSubHeader>Fill the form below to register new customer</ContentSubHeader>
				<Card>
					<div className={this.getFormClasses()}>
						<ContentHeader>Customer Registration Form</ContentHeader>
						<form onSubmit={this.handleSubmit}>
							{this.renderInput('name', 'Name', 'text')}
							{this.renderInput('email', 'Email', 'email')}
							{this.renderInput('password', 'Password', 'password')}
							{this.renderSelect('statusId', 'Status', this.state.allStatus)}
							{this.renderInput('package', 'Package', 'text')}
							{this.renderInput('phoneNumber', 'Phone Number', 'number')}
							{/* submit button */}
							{this.renderSubmitButton('Register Customer')}
						</form>
					</div>
				</Card>
			</Fragment>
		);
	}
}

export default AddCustomerForm;
