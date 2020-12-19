// import external modules
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import auth from '../../views/services/authService';
import customerAuth from '../../views/services/customer/authService';
// import internal(own) modules
import MainLayout from '../mainLayout';

/**
 * This is Protected Route. Check if user is login, if yes then redirect to respective route,
 * otherwise it Redirects to Login Page
 * 
 * Author: Muhammad Mansha
 */
const MainLayoutRoute = ({ render, ...rest }) => {
	if (auth.getCurrentUser() || customerAuth.getCurrentCustomer()) {
		return <Route {...rest} render={(matchProps) => <MainLayout>{render(matchProps)}</MainLayout>} />;
	}
	if(customerAuth.getCurrentCustomer == null){
		return <Redirect to="/customer/login" />;
	}
	return <Redirect to="/pages/login" />;
};

export default MainLayoutRoute;
