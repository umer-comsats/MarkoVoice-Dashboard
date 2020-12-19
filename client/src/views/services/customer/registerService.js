import http from '../httpService';
import { custApiURL } from '../../../config.json';
/**
 * Author: Muhammad Mansha
 * Purpose: Register Functionality 
 */

const apiEndPoint = custApiURL + '/customer/register';

/**
 * function to add a new customer in the database
 */
export function register(customer) {
	return http.post(apiEndPoint, {
		name: customer.name,
		email: customer.email,
		password: customer.password,
		phoneNumber: customer.phoneNumber
	});
}
