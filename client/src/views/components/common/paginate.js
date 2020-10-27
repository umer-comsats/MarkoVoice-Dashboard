import _ from 'lodash';

/**
 * This is a Reusable function.
 * Purpose: This file returns a function pginate which just split the array, based on page size and page number
 * to be used for pagination.
 * Author: Muhammad Mansha
 */

export function paginate(items, pageNumber, pageSize) {
	const startIndex = (pageNumber - 1) * pageSize;
	return _(items) //converting items array into lodash
		.slice(startIndex)
		.take(pageSize) //create a slice of array with n elements
		.value();
}
