// import external modules
import React, { Fragment } from 'react';
import Joi from 'joi-browser';
import { Card } from 'reactstrap';
import { toast } from 'react-toastify';

import { getCustomer, editCustomer } from '../../services/customerService';
import { getAllStatus } from '../../services/statusService';

import ContentHeader from '../../../components/contentHead/contentHeader';
import ContentSubHeader from '../../../components/contentHead/contentSubHeader';
import Form from '../../components/common/form';

class EditCustomerForm extends Form {
	state = {
		data: {
			name: '',
			email: '',
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
		statusId: Joi.string().required().label('Status'),
		package: Joi.string().required().min(5).max(255).label('Package'),
		phoneNumber: Joi.number().integer().required().label('Phone Number')
	};

	async populateStatus() {
		const { data: allStatus } = await getAllStatus();
		this.setState({ allStatus });
	}

	async populateCustomer() {
		const customerId = this.props.match.params.id;
		try {
			//if editing a movie, then fill the form with selected movie data
			const { data: customer } = await getCustomer(customerId);
			this.setState({ data: this.mapToViewModel(customer) });
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				this.props.history.replace('/not-found');
			}
		}
	}

	componentDidMount() {
		this.populateStatus();
		this.populateCustomer();
	}

	mapToViewModel(customer) {
		return {
			name: customer.name,
			email: customer.email,
			statusId: customer.status._id,
			phoneNumber: customer.phoneNumber,
			package: customer.package
		};
	}

	doSubmit = async () => {
		try {
			const customerId = this.props.match.params.id;
			await editCustomer(this.state.data, customerId);
			this.props.history.push('/admin/accounts/new-requests');
			toast.success('Customer Record Edited Successfully');
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				const errors = { ...this.state.errors };
				console.log(ex.response);
				errors.email = ex.response.statusText + ': ' + ex.response.data;
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
				<ContentHeader>Edit Customer Data</ContentHeader>
				<ContentSubHeader>Modify the form below to update customer's record</ContentSubHeader>
				<Card>
					<div className={this.getFormClasses()}>
						<ContentHeader>Customer Registration Form</ContentHeader>
						<form onSubmit={this.handleSubmit}>
							{this.renderInput('name', 'Name', 'text')}
							{this.renderInput('email', 'Email', 'email')}
							{this.renderSelect('statusId', 'Status', this.state.allStatus)}
							{this.renderInput('package', 'Package', 'text')}
							{this.renderInput('phoneNumber', 'Phone Number', 'number')}
							{/* submit button */}
							{this.renderSubmitButton('Edit Customer')}
						</form>
					</div>
				</Card>
			</Fragment>
		);
	}
}

export default EditCustomerForm;
