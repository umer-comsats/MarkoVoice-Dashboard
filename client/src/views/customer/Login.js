// import external modules
import React, { Component } from 'react';
import MetaTags from 'react-meta-tags';
import { Fragment } from 'react';
import { Row, Col, Input, Form, FormGroup, Button, Card, CardBody, CardFooter } from 'reactstrap';
import { login } from '../services/customer/authService';

/**
 * Login Class will render a form to Login.
 * Author: Muhammad Mansha
 */

const hiddenErrorStyle = {
	color: 'red',
	border: 'none'
};

class Login extends Component {
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
		try {
			const { data: jwt } = await login(object['inputEmail'], object['inputPass']);
			localStorage.setItem('customerToken', jwt);
			this.props.history.push('/customer-dashboard');
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
					<title>Customer | Login</title>
					<meta name="description" content="Login page of MarkoVoice." />
				</MetaTags>
				<div className="container-fluid login-bg">
					<Row className="full-height-vh">
						<Col xs="12" className="d-flex align-items-center justify-content-center">
						    <Card className="gradient-indigo-purple text-center width-400">
								<CardBody>
								<h2 className="white py-4">Login</h2>
									<Form onSubmit={this.onFormSubmit} className="pt-2">
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
										<a href="http://localhost:3002/customer/register" className="form-text-color">
											Register Now
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
export default Login;

