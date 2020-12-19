// import external modules
import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import { Fragment } from 'react';
import { Row, Col, Input, Form, FormGroup, Button, Card, CardBody, CardFooter } from 'reactstrap';
import { register } from '../services/customer/registerService';

/**
 * Register Class will render a form to Sign Up.
 * Author: Muhammad Mansha
 */

const hiddenErrorStyle = {
	color: 'red',
	border: 'none'
};

class Register extends Component {
	state = {
		errors: []
	};

	onFormSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		var object = {};
		formData.forEach((value, key) => {
			object[key] = value;
		});

		var customer = {
			name: object['inputName'],
			email: object['inputEmail'],
			password: object['inputPass'],
			phoneNumber: object['inputNumber']
		};
		try {
			const { data } = await register(customer);
			this.props.history.push('/customer/login');
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				const errors = { ...this.state.errors };
				errors.hiddenError = ex.response.data;
				this.setState({ errors });
			}
		}
	};

	render() {
		return (
			<Fragment>
				<MetaTags>
					<title>MarkoVoice | Register</title>
					<meta name="description" content="Register page of MarkoVoice." />
				</MetaTags>
				<div className="container-fluid login-bg">
					<Row className="full-height-vh">
						<Col xs="12" className="d-flex align-items-center justify-content-center">
						    <Card className="gradient-indigo-purple text-center width-400">
								<CardBody>
									<h2 className="white py-4">Register</h2>
									<Form onSubmit={this.onFormSubmit} className="pt-2">
										<FormGroup>
											<Col md="12">
												<Input
													type="text"
													className="form-control"
													name="inputName"
													id="inputName"
													placeholder="Name"
													required
												/>
											</Col>
										</FormGroup>
										<FormGroup>
											<Col md="12">
												<Input
													type="email"
													className="form-control"
													name="inputEmail"
													id="inputEmail"
													placeholder="Email"
													required
												/>
											</Col>
										</FormGroup>

										<FormGroup>
											<Col md="12">
												<Input
													type="password"
													className="form-control"
													name="inputPass"
													id="inputPass"
													placeholder="Password"
													required
												/>
											</Col>
										</FormGroup>

										<FormGroup>
											<Col md="12">
												<Input
													type="number"
													className="form-control"
													name="inputNumber"
													id="inputNumber"
													placeholder="Contact Number"
													required
												/>
											</Col>
										</FormGroup>

										<FormGroup>
											<Col md="12">
												<span style={hiddenErrorStyle}>
													{this.state.errors.hiddenError || null}
												</span>
											</Col>
										</FormGroup>

										<FormGroup>
											<Col md="12">
												<Button
													type="submit"
													color="primary"
													block
													className="gradient-crystal-clear btn-raised"
												>
													Submit
												</Button>
												<Button type="button" color="secondary" block className="gradient-nepal btn-raised">
													Cancel
												</Button>
											</Col>
										</FormGroup>
									</Form>
								</CardBody>
								<CardFooter>
									<div className="float-right">
										<a href="http://localhost:3002/customer/login" className="form-text-color">
											Login
										</a>
									</div>
								</CardFooter>
							</Card>
						</Col>
					</Row>
				</div>
			</Fragment>
		);
	}
}

export default Register;
