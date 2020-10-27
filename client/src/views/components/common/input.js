import React from 'react';

/**
 * This file returns the input component.
 * Author: Muhamamd Mansha
 */
const Input = ({ name, label, placeholder, value, type, error, onChange }) => {
	return (
		<div className="form-group">
			{label && <label htmlFor={name}>{label}</label>}
			<input
				placeholder={placeholder || null}
				value={value}
				onChange={onChange}
				id={name}
				name={name}
				type={type}
				className="form-control"
			/>
			{/* if error is trucy, then div is returned */}
			{error && <div className="alert alert-danger">{error}</div>}
		</div>
	);
};

export default Input;
