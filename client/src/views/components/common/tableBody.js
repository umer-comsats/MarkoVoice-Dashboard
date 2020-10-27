import React, { Component } from 'react';
import _ from 'lodash';

/**
 * This is a Reusable class.
 * Purpose: This will initialize the table body with the data.
 * Author: Muhamamd Mansha
 */

class TableBody extends Component {
	// this will render each cell of table
	renderCell = (item, column) => {
		// console.log(column);
		if (column.content) {
			return column.content(item);
		}
		return _.get(item, column.path);
	};

	// this will create a unique key
	createKey = (item, column) => {
		return item._id + (column.path || column.key);
	};

	// this will render table body initialised with data
	render() {
		const { data, columns } = this.props;
		return (
			<tbody>
				{data.map((item) => (
					<tr key={item._id}>
						{columns.map((column) => (
							<td key={this.createKey(item, column)}>{this.renderCell(item, column)}</td>
						))}
					</tr>
				))}
			</tbody>
		);
	}
}

export default TableBody;
