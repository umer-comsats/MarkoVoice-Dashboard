import http from './httpService';
import { apiURL } from '../../config.json';

const apiEndPoint = apiURL + '/status';

export function getAllStatus() {
	return http.get(apiEndPoint);
}
