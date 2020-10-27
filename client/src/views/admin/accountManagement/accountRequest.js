// import external modules
import React, { Component, Fragment } from 'react';
import { Card, CardBody, Row } from 'reactstrap';
import { getCustomers, deleteCustomer } from '../../services/customerService';
import { paginate } from '../../components/common/paginate';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import ContentHeader from '../../../components/contentHead/contentHeader';
import ContentSubHeader from '../../../components/contentHead/contentSubHeader';
import AccountRequestTable from './accountRequestsTable';
import Pagination from '../../components/common/pagination';
import SearchBox from '../../components/common/searchBox';

import _ from 'lodash';

/**
 * This file will handle new account registration requests.
 * Author: Muhammad Mansha
 */
class NewAccountRequests extends Component {
	//defining the state of class
	state = {
		customers: [], //compDidMount will have to fetch data from db, which will take some time, so if we don't declare here, it will throw an error.
		pageSize: 4,
		currentPage: 1,
		searchQuery: '',
		sortColumn: { path: 'name', order: 'asc' }
	};

	// initialize the customers array with the customers objects fetched from db(currently using fake service)
	async componentDidMount() {
		const { data: customers } = await getCustomers();
		this.setState({ customers });
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

	handleDelete = async (customer) => {
		const originalCustomers = this.state.customers;
		const customers = originalCustomers.filter((c) => c._id !== customer._id);
		this.setState({ customers });
		try {
			await deleteCustomer(customer._id);
			this.setState({ currentPage: 1 });
			toast('Customer Record Deleted Successfully.');
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				toast.error('This customer has already been deleted.');
			}
			// undo if server fails
			this.setState({ customers: originalCustomers });
		}
	};

	// this will filtered out the data based on page size, current page, sort column and search query
	getPagedData = () => {
		const { pageSize, currentPage, sortColumn, searchQuery, customers: allcustomers } = this.state;
		let filtered = allcustomers;
		// if customers have specified search query, add search result to filtered customers
		if (searchQuery) {
			filtered = allcustomers.filter((m) => m.name.toLowerCase().startsWith(searchQuery.toLowerCase()));
		}
		// specifies the sort order
		const sorted = _.orderBy(filtered, [ sortColumn.path ], [ sortColumn.order ]);
		// get the customer to be display on page based on sorting details, current page and page size
		const customers = paginate(sorted, currentPage, pageSize);
		return { totalCount: filtered.length, data: customers };
	};

	render() {
		const { length: count } = this.state.customers;
		const { pageSize, currentPage, searchQuery, sortColumn } = this.state;
		if (count === 0) return <p>There are no account registration requests in the database.</p>;

		const { totalCount, data: customers } = this.getPagedData();
		return (
			<Fragment>
				<ToastContainer />
				<ContentHeader>New Account Requests</ContentHeader>
				<ContentSubHeader>This page is showing all the new account requests by customers</ContentSubHeader>
				<Card>
					<CardBody>
						<Row>
							<div className="col-xs-12 col-md-9">
								<h1>Client Account Registration Requests</h1>
								<p>Showing {totalCount} client's account registration requests.</p>
							</div>
							<div className="col-xs-12 col-md-3 mt-auto">
								<Link to="/admin/accounts/add-new-customer/new" className="btn btn-primary float-right">
									Add New Customer
								</Link>
							</div>
						</Row>
						<Row>
							<div className="col">
								<ToastContainer />
								{/* Search Box */}
								<SearchBox value={searchQuery} onChange={this.handleSearch} />

								{/* table populated with customers data */}
								<AccountRequestTable
									customers={customers}
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

export default NewAccountRequests;
