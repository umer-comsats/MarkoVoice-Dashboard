import React, { Component } from 'react';
import auth from '../services/customer/authService';
class Logout extends Component {
	componentDidMount() {
		auth.logout();
		window.location.href = '/customer/login';
	}

	render() {
		return null;
	}
}

export default Logout;
