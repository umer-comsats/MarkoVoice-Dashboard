// import external modules
import React from 'react';
import { Row, Col, FormGroup, Button, Card, CardBody, CardFooter } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import Joi from 'joi-browser';
import Form from '../components/common/form';
import auth from '../services/authService';

class Login extends Form {
	state = {
		errors: [],
		data: {
			email: '',
			password: ''
		}
	};
	schema = {
		email: Joi.string().min(5).max(255).required().label('Email').email(),
		password: Joi.string().required().min(5).max(255).label('Password')
	};

	doSubmit = async () => {
		try {
			const { data } = this.state;
			await auth.login(data.email, data.password);
			this.navigateRoleDashboard();
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				const errors = { ...this.state.errors };
				errors.hiddenError = ex.response.data;
				this.setState({ errors });
			}
		}
	};

	/**
	 * navigateRoleDashboard() function will navigate to dashboard
	 * according to the role of the logged-in user
	 */
	navigateRoleDashboard() {
		const user = auth.getCurrentUser();
		if (user && user.role === 'Admin') {
			return this.props.history.push('/sales-dashboard');
		} else if (user && user.role === 'Sales Representative') {
			return this.props.history.push('/not-found');
		} else if (user && user.role === 'IT User') {
			return this.props.history.push('/not-found');
		} else if (user && user.role === 'Report Analyst') {
			return this.props.history.push('/analytics-dashboard');
		}
	}

	render() {
		if (auth.getCurrentUser()) {
			this.navigateRoleDashboard();
		}

		return (
			<div className="container">
				<Row className="full-height-vh">
					<Col xs="12" className="d-flex align-items-center justify-content-center">
						<Card className="gradient-indigo-purple text-center width-400">
							<CardBody>
								<h2 className="white py-4">Login</h2>
								<form onSubmit={this.handleSubmit}>
									{this.renderInput('email', '', 'email', 'Email')}
									{this.renderInput('password', '', 'password', 'Password')}
									{this.renderInput('hiddenError', '', 'hidden', '')}
									<FormGroup>
										<Button type="submit" color="primary" block className="gradient-crystal-clear btn-raised">
											Submit
										</Button>
										<Button type="button" color="success" block className="gradient-nepal btn-raised">
											Cancel
										</Button>
									</FormGroup>
								</form>
							</CardBody>
							<CardFooter />
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

export default Login;
