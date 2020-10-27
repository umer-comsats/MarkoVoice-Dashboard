import http from './httpService';
import { apiURL } from '../../config.json';

const apiEndPoint = apiURL + '/roles';

export function getRoles() {
	return http.get(apiEndPoint);
}
