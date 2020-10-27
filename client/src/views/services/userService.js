import http from './httpService';
import { apiURL } from '../../config.json';

/**
 * Author: Muhammad Mansha
 * Purpose: This file contains an array of JSON objects which contains data of users.
 * This is to be used to populate tables 
 */

const apiEndPoint = apiURL + '/users';

function getUserUrl(id) {
	return apiEndPoint + '/' + id;
}

export function getUsers() {
	return http.get(apiEndPoint);
}

export function getUser(userId) {
	return http.get(getUserUrl(userId));
}

/**
 * function to delete user
 */
export function deleteUser(userId) {
	return http.delete(getUserUrl(userId));
}

/**
 * function to edit user
 */
export function editUser(user, userId) {
	// make clone, bcz don't want to directly modify original users
	var body = { ...user };
	// if we pass user instead of body, then there will be 2 ids. So remove the id from user object
	return http.put(getUserUrl(userId), body);
}

/**
 * function to add new user
 */
export function addUser(user) {
	return http.post(apiEndPoint, user);
}
