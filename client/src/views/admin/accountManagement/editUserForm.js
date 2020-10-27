// import external modules
import React, { Fragment } from 'react';
import Joi from 'joi-browser';
import { Card } from 'reactstrap';
import { toast } from 'react-toastify';

import { getUser, editUser } from '../../services/userService';
import { getRoles } from '../../services/roleService';

import ContentHeader from '../../../components/contentHead/contentHeader';
import ContentSubHeader from '../../../components/contentHead/contentSubHeader';
import Form from '../../components/common/form';

class EditUserForm extends Form {
	state = {
		data: {
			name: '',
			email: '',
			roleId: '',
			phoneNumber: '',
			roleDesc: ''
		},
		roles: [],
		errors: {}
	};

	schema = {
		name: Joi.string().min(3).max(50).required().label('Name'),
		email: Joi.string().min(5).max(255).required().label('Email').email(),
		roleId: Joi.string().required().label('Role'),
		phoneNumber: Joi.number().integer().required().label('Phone Number'),
		roleDesc: Joi.string().required().min(5).max(255).label('Role Decription')
	};

	async populateRoles() {
		const { data: roles } = await getRoles();
		this.setState({ roles });
	}

	async populateUser() {
		const userId = this.props.match.params.id;
		try {
			//if editing a movie, then fill the form with selected movie data
			const { data: user } = await getUser(userId);
			this.setState({ data: this.mapToViewModel(user) });
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				this.props.history.replace('/not-found');
			}
		}
	}

	componentDidMount() {
		this.populateRoles();
		this.populateUser();
	}

	mapToViewModel(user) {
		return {
			name: user.name,
			email: user.email,
			roleId: user.role._id,
			phoneNumber: user.phoneNumber,
			roleDesc: user.roleDesc
		};
	}

	doSubmit = async () => {
		try {
			const userId = this.props.match.params.id;
			await editUser(this.state.data, userId);
			this.props.history.push('/admin/accounts/users-record');
			toast.success('User Record Edited Successfully');
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
				<ContentHeader>Edit Administrative User</ContentHeader>
				<ContentSubHeader>Modify the form below to update administrartive user</ContentSubHeader>
				<Card>
					<div className={this.getFormClasses()}>
						<ContentHeader>User Registration Form</ContentHeader>
						<form onSubmit={this.handleSubmit}>
							{this.renderInput('name', 'Name', 'text')}
							{this.renderInput('email', 'Email', 'email')}
							{this.renderSelect('roleId', 'Role', this.state.roles)}
							{this.renderInput('phoneNumber', 'Phone Number', 'number')}
							{this.renderInput('roleDesc', 'Role Description', 'text')}
							{/* submit button */}
							{this.renderSubmitButton('Edit User')}
						</form>
					</div>
				</Card>
			</Fragment>
		);
	}
}

export default EditUserForm;
