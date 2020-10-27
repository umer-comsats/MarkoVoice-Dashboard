import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * to deal with the unexpected errors like server down, nw down or bugs in code
 */
axios.interceptors.response.use(null, (error) => {
	const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

	// 400 range for expected errors
	if (!expectedError) {
		console.log('Logging the Error: ' + error.status);
		// alert("An Unexpected error occured");
		toast.error('An Unexpected error occured');
	}

	// control passed to catch block, in case of error
	return Promise.reject(error);
});

export default {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete
};
