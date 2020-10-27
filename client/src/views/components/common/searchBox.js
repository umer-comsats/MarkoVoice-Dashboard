import React from 'react';

/**
 * This is a Reusable component.
 * Purpose: This will return a search component.
 * Author: Muhamamd Mansha
 */
const SearchBox = ({ value, onChange }) => {
	return (
		<input
			type="text"
			name="query"
			className="form-control my-3"
			placeholder="Search..."
			value={value}
			// raise event with value of input field
			onChange={(e) => onChange(e.currentTarget.value)}
		/>
	);
};

export default SearchBox;
