import React, { Component } from 'react';

/**
 * This is a Reusable class.
 * Purpose: This will initialize the table header.
 * Author: Muhamamd Mansha
 */
//columns: array
//sortColumn: object
//onSort: function
class TableHeader extends Component {
	// method that contains the logic for determining the sort order
	raiseSort = (path) => {
		// this.setState({ sortColumn: { path: path, order: 'asc' } })
		const sortColumn = { ...this.props.sortColumn };
		// if existed sort column is same to new sort column, it means reverse the order
		if (sortColumn.path === path) sortColumn.order = sortColumn.order === 'asc' ? 'desc' : 'asc';
		else {
			sortColumn.path = path;
			sortColumn.order = 'asc';
		}
		this.props.onSort(sortColumn);
	};

	// this will render the sort icon on the current sorted column
	renderSortIcon = (column) => {
		const { sortColumn } = this.props;
		if (column.path !== sortColumn.path) return null;
		if (sortColumn.order === 'asc') return <i className="fa fa-sort-asc" />;
		return <i className="fa fa-sort-desc" />;
	};

	// this will render table head
	render() {
		return (
			<thead>
				<tr>
					{this.props.columns.map((column) => (
						<th
							className="clickable text-nowrap"
							key={column.path || column.key}
							onClick={() => this.raiseSort(column.path)}
						>
							{column.label} {this.renderSortIcon(column)}
						</th>
					))}
				</tr>
			</thead>
		);
	}
}

export default TableHeader;
