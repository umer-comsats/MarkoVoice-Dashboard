// import external modules
import React, { Fragment } from 'react';
import Joi from 'joi-browser';
import { Card } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

import { addUser } from '../../services/userService';
import { getRoles } from '../../services/roleService';

import ContentHeader from '../../../components/contentHead/contentHeader';
import ContentSubHeader from '../../../components/contentHead/contentSubHeader';
import Form from '../../components/common/form';

// import '../assets/style.css';

/**
 * initialises the state, set the schema for that form
 * determine what should happen when form submits
 * what to return when the form is rendered.
 * Rest of the things is handled by user defined Form class(reusable with any other form)
 */
class AddUserForm extends Form {
	state = {
		data: {
			name: '',
			email: '',
			password: '',
			roleId: '',
			phoneNumber: '',
			roleDesc: ''
		},
		roles: [],
		errors: {}
	};

	schema = {
		// username should be string + required
		// you can set any label. It is the name displayed in error msg
		name: Joi.string().min(3).max(50).required().label('Name'),
		email: Joi.string().min(5).max(255).required().label('Email').email(),
		password: Joi.string().min(5).max(1024).required().label('Password'),
		roleId: Joi.string().required().label('Role'),
		phoneNumber: Joi.number().integer().required().label('Phone Number'),
		roleDesc: Joi.string().required().min(5).max(255).label('Role Decription')
	};

	async populateRoles() {
		const userId = this.props.match.params.id;
		if (userId.toString().trim() === 'new') {
			const { data: roles } = await getRoles();
			this.setState({ roles });
		} else {
			this.props.history.replace('/not-found');
		}
	}

	componentDidMount() {
		this.populateRoles();
	}

	doSubmit = async () => {
		try {
			await addUser(this.state.data);
			this.props.history.push('/admin/accounts/users-record');
			toast.success('User Added Successfully');
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
				<ContentHeader>Add A New Administrative User</ContentHeader>
				<ContentSubHeader>Fill the form below to register new administrartive user</ContentSubHeader>
				<Card>
					<div className={this.getFormClasses()}>
						<ContentHeader>User Registration Form</ContentHeader>
						<form onSubmit={this.handleSubmit}>
							{this.renderInput('name', 'Name', 'text')}
							{this.renderInput('email', 'Email', 'email')}
							{this.renderInput('password', 'Password', 'password')}
							{this.renderSelect('roleId', 'Role', this.state.roles)}
							{this.renderInput('phoneNumber', 'Phone Number', 'number')}
							{this.renderInput('roleDesc', 'Role Description', 'text')}
							{/* submit button */}
							{this.renderSubmitButton('Add User')}
						</form>
					</div>
				</Card>
			</Fragment>
		);
	}
}

export default AddUserForm;
