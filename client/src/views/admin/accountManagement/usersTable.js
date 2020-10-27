import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Delete } from 'react-feather';
import Table from '../../components/common/table';

/**
 * This file renders the table with columns details, table data, and sorting details.
 * Author: Muhamamd Mansha
 */
class UsersTable extends Component {
	//array containing column path and label
	columns = [
		{ path: 'name', label: 'Name' },
		{ path: 'email', label: 'Email' },
		{ path: 'role.name', label: 'Role' },
		{ path: 'phoneNumber', label: 'Number' },
		{ path: 'roleDesc', label: 'Role Description' },
		{
			key: 'action',
			label: 'Action',
			content: (user) => (
				<span>
					<span>
						<Link to={`/admin/accounts/edit-user/${user._id}`}>
							<Edit size={18} color="#000" className="mr-1" />
						</Link>
					</span>
					<span style={{ cursor: 'pointer' }} onClick={() => this.props.onDelete(user)}>
						<Delete size={18} color="#000" className="mr-1" />
					</span>
				</span>
			)
		}
	];

	// render the table
	render() {
		//as a convention, do object destructuring at the beginning of every functional
		//components to get the idea of what the interface of that component look like
		const { users, onSort, sortColumn } = this.props;

		//this will return the table with defined columns, data, and sorting details
		return (
			<Table
				columns={this.columns}
				data={users}
				onDelete={this.handleDelete}
				sortColumn={sortColumn}
				onSort={onSort}
			/>
		);
	}
}

export default UsersTable;
