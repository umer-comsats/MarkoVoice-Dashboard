import http from './httpService';
import jwtDecode from 'jwt-decode';
import { apiURL } from '../../config.json';

/**
 * Author: Muhammad Mansha
 * Purpose: Login, logout Functionality + Get user from JWT
 */

const apiEndPoint = apiURL + '/auth';
const tokenKey = 'token';

export async function login(email, password) {
	const { data: jwt } = await http.post(apiEndPoint, { email, password });
	localStorage.setItem(tokenKey, jwt);
}

export function logout() {
	localStorage.removeItem(tokenKey);
}

export function getCurrentUser() {
	try {
		const jwt = localStorage.getItem(tokenKey);
		return jwtDecode(jwt);
	} catch (ex) {
		return null;
	}
}

export default {
	login,
	logout,
	getCurrentUser
};
