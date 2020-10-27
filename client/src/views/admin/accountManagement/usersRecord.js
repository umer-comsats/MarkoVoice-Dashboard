// import external modules
import React, { Component, Fragment } from 'react';
import { Card, CardBody, Row } from 'reactstrap';
import { getUsers, deleteUser } from '../../services/userService';
import { paginate } from '../../components/common/paginate';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import ContentHeader from '../../../components/contentHead/contentHeader';
import ContentSubHeader from '../../../components/contentHead/contentSubHeader';
import UsersTable from './usersTable';
import Pagination from '../../components/common/pagination';
import SearchBox from '../../components/common/searchBox';

import _ from 'lodash';

/**
 * Author: Muhammad Mansha
 * This file will handle new account registration requests.
 */
class UsersRecord extends Component {
	//defining the state of class
	state = {
		users: [], //compDidMount will have to fetch data from db, which will take some time, so if we don't declare here, it will throw an error.
		pageSize: 4,
		currentPage: 1,
		searchQuery: '',
		sortColumn: { path: 'name', order: 'asc' }
	};

	// initialize the users array with the users objects fetched from db
	async componentDidMount() {
		const { data: users } = await getUsers();
		this.setState({ users });
	}

	// set the state of current display page
	handlePageChange = (page) => {
		this.setState({ currentPage: page });
	};

	// set the state of current column on the basis of which table data is sorted
	handleSort = (sortColumn) => {
		this.setState({ sortColumn });
	};

	// set the state of search query
	handleSearch = (query) => {
		this.setState({
			searchQuery: query,
			currentPage: 1
		});
	};

	handleDelete = async (user) => {
		const originalUsers = this.state.users;
		const users = originalUsers.filter((u) => u._id !== user._id);
		this.setState({ users });
		try {
			await deleteUser(user._id);
			this.setState({ currentPage: 1 });
			toast('User Record Deleted Successfully.');
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				toast.error('This user has already been deleted.');
			}
			// undo if server fails
			this.setState({ users: originalUsers });
		}
	};

	// this will filtered out the data based on page size, current page, sort column and search query
	getPagedData = () => {
		const { pageSize, currentPage, sortColumn, searchQuery, users: allUsers } = this.state;
		let filtered = allUsers;
		// if users have specified search query, add search result to filtered users
		if (searchQuery) {
			filtered = allUsers.filter((m) => m.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
		}
		// specifies the sort order
		const sorted = _.orderBy(filtered, [ sortColumn.path ], [ sortColumn.order ]);
		// get the user to be display on page based on sorting details, current page and page size
		const users = paginate(sorted, currentPage, pageSize);
		return { totalCount: filtered.length, data: users };
	};

	render() {
		const { length: count } = this.state.users;
		const { pageSize, currentPage, searchQuery, sortColumn } = this.state;
		if (count === 0) return <p>There are no users in the database.</p>;

		const { totalCount, data: users } = this.getPagedData();
		return (
			<Fragment>
				<ToastContainer />
				<ContentHeader>Administrative Users</ContentHeader>
				<ContentSubHeader>This page is showing all the new administrative user details.</ContentSubHeader>
				<Card>
					<CardBody>
						<Row>
							<div className="col-xs-12 col-md-9">
								<h1>Administrative Users</h1>
								<p>Showing {totalCount} users in database</p>
							</div>
							<div className="col-xs-12 col-md-3 mt-auto">
								<Link to="/admin/accounts/add-new-user/new" className="btn btn-primary float-right">
									Add New User
								</Link>
							</div>
						</Row>
						<Row>
							<div className="col">
								{/* Search Box */}
								<SearchBox value={searchQuery} onChange={this.handleSearch} />

								{/* table populated with users data */}
								<UsersTable
									users={users}
									onDelete={this.handleDelete}
									sortColumn={sortColumn}
									onSort={this.handleSort}
								/>

								{/* Pagination details*/}
								<Pagination
									itemsCount={totalCount}
									pageSize={pageSize}
									currentPage={currentPage}
									onPageChange={this.handlePageChange}
								/>
							</div>
						</Row>
					</CardBody>
				</Card>
			</Fragment>
		);
	}
}

export default UsersRecord;
