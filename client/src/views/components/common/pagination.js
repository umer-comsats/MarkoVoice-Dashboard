import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

/**
 * This is a Reusable component.
 * Purpose: This component will make Page Numbers based on the number of items. It also maps data to each page
 * Input: page size and total movies count.
 * Author: Muhammad Mansha
 */

const Pagination = (props) => {
	const { itemsCount, pageSize, currentPage, onPageChange } = props;
	const pagesCount = Math.ceil(itemsCount / pageSize);
	if (pagesCount === 1) return null;
	// to generate an array of numbers
	const pages = _.range(1, pagesCount + 1);
	return (
		<nav>
			<ul className="pagination text-dark">
				{pages.map((page) => (
					<li key={page} className={page === currentPage ? 'page-item active' : 'page-item'}>
						<a className="page-link" onClick={() => onPageChange(page)}>
							{page}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

//if we type wrong type of values of props.
//type checking for Pagination component
//used to catch bugs related to type checking.
Pagination.propTypes = {
	itemsCount: PropTypes.number.isRequired,
	pageSize: PropTypes.number.isRequired,
	currentPage: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired
};

export default Pagination;
