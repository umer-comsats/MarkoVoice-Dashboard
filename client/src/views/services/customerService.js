import http from './httpService';
import { apiURL } from '../../config.json';

/**
 * Author: Muhammad Mansha
 * Purpose: This file contains an array of JSON objects which contains data of customers.
 * This is to be used to populate tables 
 */

const apiEndPoint = apiURL + '/customers';

function getCustomerUrl(id) {
	return apiEndPoint + '/' + id;
}

export function getCustomers() {
	return http.get(apiEndPoint);
}

export function getCustomer(customerId) {
	return http.get(getCustomerUrl(customerId));
}

/**
 * function to delete customer
 */
export function deleteCustomer(customerId) {
	return http.delete(getCustomerUrl(customerId));
}

/**
 * function to edit customer
 */
export function editCustomer(customer, customerId) {
	// make clone, bcz don't want to directly modify original users
	var body = { ...customer };
	// if we pass customer instead of body, then there will be 2 ids. So remove the id from customer object
	return http.put(getCustomerUrl(customerId), body);
}

/**
 * function to add new customer
 */
export function addCustomer(customer) {
	return http.post(apiEndPoint, customer);
}
