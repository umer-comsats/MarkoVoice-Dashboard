import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Delete } from 'react-feather';
import Table from '../../components/common/table';

/**
 * This file renders the table with columns details, table data, and sorting details.
 * Author: Muhamamd Mansha
 */
class AccountRequestTable extends Component {
	//array containing column path and label
	columns = [
		{ path: 'name', label: 'Customer Name' },
		{ path: 'email', label: 'Email' },
		{ path: 'status.name', label: 'Account Status' },
		{ path: 'package', label: 'Package' },
		{ path: 'phoneNumber', label: 'Phone Number' },
		{
			key: 'action',
			label: 'Action',
			content: (customer) => (
				<span>
					<span>
						<Link to={`/admin/accounts/edit-customer/${customer._id}`}>
							<Edit size={16} color="#000" className="mr-1" />
						</Link>
					</span>
					<span style={{ cursor: 'pointer' }} onClick={() => this.props.onDelete(customer)}>
						<Delete size={16} color="#000" className="mr-1" />
					</span>
				</span>
			)
		}
	];

	// render the table
	render() {
		//as a convention, do object destructuring at the beginning of every functional
		//components to get the idea of what the interface of that component look like
		const { customers, onSort, sortColumn } = this.props;

		//this will return the table with defined columns, data, and sorting details
		return (
			<Table
				columns={this.columns}
				data={customers}
				onDelete={this.handleDelete}
				sortColumn={sortColumn}
				onSort={onSort}
			/>
		);
	}
}

export default AccountRequestTable;
