import React from 'react';
import TableHeader from './tableHeader';
import TableBody from './tableBody';

/**
 * This is a Reusable component.
 * Purpose: This will return a Table component fill with header and body data as well as sorting details.
 * Author: Muhamamd Mansha
 */

const Table = ({ columns, sortColumn, onSort, data }) => {
	// const { columns, sortColumn, onSort, data } = props;
	return (
		<table className="table table-responsive-sm">
			<TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
			<TableBody data={data} columns={columns} />
		</table>
	);
};

export default Table;
