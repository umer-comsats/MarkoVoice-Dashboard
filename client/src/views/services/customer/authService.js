import http from '../httpService';
import jwtDecode from 'jwt-decode';
import { custApiURL } from '../../../config.json';

/**
 * Author: Muhammad Mansha
 * Purpose: Login  Functionality 
 */

const apiEndPoint = custApiURL + '/customer/auth';

const cTokenKey = 'customerToken';

/**
 * function to call API to check if user is registered or not
 */
export async function login(email, password) {
	const { data: jwt } = await http.post(apiEndPoint, { email, password });
	localStorage.setItem(cTokenKey, jwt);
	return http.post(apiEndPoint, { email, password });
}

export function logout() {
	localStorage.removeItem(cTokenKey);
}

export function getCurrentCustomer() {
	try {
		const jwt = localStorage.getItem(cTokenKey);
		return jwtDecode(jwt);
	} catch (ex) {
		return null;
	}
}

export default {
	login,
	logout,
	getCurrentCustomer
};
