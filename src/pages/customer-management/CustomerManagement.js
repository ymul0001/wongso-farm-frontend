import {React, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from '../../components/header/Header';
import Button from '@mui/material/Button';
import SearchBar from 'material-ui-search-bar';
import MaterialTable from 'material-table';
import TwoWayModal from '../../components/modal/TwoWayModal';
import PromptModal from '../../components/PromptModal';
import './customermanagement.css';

const CustomerManagement = () => {
    const navigate = useNavigate();
    const tableRef = useRef();
    const [modalShow, setModalShow] = useState(false);
    const [twoWayModalShow, setTwoWayModalShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [searchClause, setSearchClause] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [sortKey, setSortKey] = useState('total_money');
    const [sortOrder, setSortOrder] = useState('DESC');

    const handleSortOrderChange = (e) => {
        const sortAttributes = e.target.value.split(' ');
        setSortKey(sortAttributes[0]);
        setSortOrder(sortAttributes[1]);
        tableRef.current.onQueryChange();
    };

    const customerColumns = [
        {title: 'No', field: 'row_number', cellStyle: { width: "1%" }},
        {title: 'Initial', field: 'customer_initial', cellStyle: { width: "15%" }},
        {title: 'Name', field: 'customer_name', cellStyle: { width: "20%" }},
        {title: 'Address', field: 'customer_address', cellStyle: { width: "20%" }},
        {title: 'Monthly total order (pieces)', field: 'total_order', cellStyle: { width: "20%" }},
        {title: 'Monthly total money', field: 'total_money', cellStyle: { width: "20%" }}
    ]

    const deleteCustomer = (e) => {
        e.preventDefault();
        axios.delete('https://wongso-farm-api.herokuapp.com/v1/customer/deleteById', {params: {
            customerid: customerId
        }})
        .then((response) => {
            return response.status;
        }).then((status) => {
            if (status === 204) {
                window.location.reload();
            }
        }).catch((error) => {
            setModalShow(true);
            setErrorMessage(error.response.data.message);
        });
    }

    return(
        <div className="customer-management">
            <Header title="Customer Management"/>
            <div className="options">
                <Button 
                    style={{
                        border: "none",
                        width: "15%",
                        backgroundColor: "#A0865E",
                        color: "#ffffff",
                        height: "5vh",
                        fontSize: "18px"
                    }} 
                    variant="contained" onClick={() => {navigate('create')}}>Create New</Button>
                <SearchBar
                    style={{
                        width: "35%",
                        height: "4.9vh",
                        border: "none"
                    }}
                    placeholder="search for customers"
                    value={searchClause}
                    onChange={(newValue) => {
                        setSearchClause(newValue);
                        tableRef.current.onQueryChange();
                    }}
                    // onRequestSearch={() => doSomethingWith(this.state.value)}
                />
                <select name="customer-sort" id="customer-sort" onChange={handleSortOrderChange}>
                    <option value="" disabled selected>sort by</option>
                    <option value="total_order ASC">total order ascending</option>
                    <option value="total_order DESC">total order descending</option>
                    <option value="total_money ASC">total money ascending</option>
                    <option value="total_money DESC">total money descending</option>
                </select>
            </div>
            <div className="customer-table">
                    <MaterialTable
                        tableRef={tableRef}
                        title="Customer tabular data"
                        columns={customerColumns}
                        data={query =>
                                new Promise((resolve, reject) => {
                                    axios.get('https://wongso-farm-api.herokuapp.com/v1/customer/findByUserIdPaginated',{params: {
                                        userid: localStorage.getItem("userId"),
                                        sortkey: sortKey,
                                        sortorder: sortOrder,
                                        page: query.page + 1,
                                        limit: query.pageSize
                                    }})
                                    .then(result => {
                                        const selectedResponse = {
                                            startIndex: result.data.startIndex,
                                            currentPage: result.data.currentPage,
                                            totalAvailableData: result.data.totalAvailableData,
                                            results: result.data.message
                                        }
                                        return selectedResponse;
                                    })
                                    .then((result) => {
                                        const filteredResults = result.results.filter(row => row.customer_name.toLowerCase().indexOf(searchClause) != -1);
                                        const selectedResults = filteredResults.map((row, index) => ({
                                            row_number: result.startIndex + (index + 1),
                                            customer_id: row.customer_id,
                                            customer_initial: row.customer_initial,
                                            customer_name: row.customer_name,
                                            customer_address: (row.customer_address != null) ? row.customer_address : "-",
                                            total_order: row.total_order,
                                            total_money: row.total_money
                                        }));
                                        resolve({
                                            data: selectedResults,
                                            page: result.currentPage - 1,
                                            totalCount: result.totalAvailableData,
                                        })
                                    })
                                })
                            }
                        options={{
                            actionsCellStyle: {width: "3%"},
                            toolbar: false,
                            pageSize: 50,
                            pageSizeOptions: [50,100],
                            emptyRowsWhenPaging: false,
                            search: false,
                            headerStyle: {
                                backgroundColor: '#E7E7E7',
                                fontWeight: 700,
                                fontSize: '1.2rem',
                                color: '#80715c'
                            },
                            rowStyle: {
                                backgroundColor: '#F9F9FC',
                                fontSize: '1.2rem'
                            },
                            actionsColumnIndex: -1
                        }}
                        actions={[
                            {
                                icon: 'update',
                                tooltip: 'Update Customer',
                                iconProps: { style: { fontSize: "30px", color: "#A49F2E" } },
                                onClick: (event, rowData) => {
                                            navigate(`update/${rowData.customer_id}`, {state: rowData})
                                        }    
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete Customer',
                                iconProps: { style: { fontSize: "30px", color: "#AD0909" } },
                                onClick: (event, rowData) => {
                                        setCustomerName(rowData.customer_name);
                                        setCustomerId(rowData.customer_id);
                                        setTwoWayModalShow(true);
                                    }
                            }
                        ]}
                    /> 
                    <PromptModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        title={"Delete Customer Error"}
                        desc={errorMessage}/>
                    <TwoWayModal
                        show={twoWayModalShow}
                        onHide = {() => setTwoWayModalShow(false)}
                        title={"Delete Customer Confirmation"}
                        desc={`Are you sure you want to delete ${customerName} from the customer list? (the action cannot be undone)`}
                        actionlabel={"Delete"}
                        action = {(e) => deleteCustomer(e)}/>
                </div>
        </div>
    )
}
//moment(row.expense_date).subtract(7, 'h').format("Do MMM YY, h:mm a")
export default CustomerManagement;