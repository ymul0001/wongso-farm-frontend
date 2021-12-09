import {React, useState, useRef} from 'react';
import moment from 'moment';
import MaterialTable from 'material-table';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Button from '@mui/material/Button';
import SearchBar from 'material-ui-search-bar';
import PromptModal from '../../components/PromptModal';
import TwoWayModal from '../../components/modal/TwoWayModal';

import './salesmanagement.css';

const SalesManagement = () => {
    const navigate = useNavigate();
    const tableRef = useRef();
    const [sortKey, setSortKey] = useState('sales_date');
    const [sortOrder, setSortOrder] = useState('DESC');
    const [modalShow, setModalShow] = useState(false);
    const [searchClause, setSearchClause] = useState("");
    const [twoWayModalShow, setTwoWayModalShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [salesId, setSalesId] = useState("");

    const handleSortOrderChange = (e) => {
        const sortAttributes = e.target.value.split(' ');
        setSortKey(sortAttributes[0]);
        setSortOrder(sortAttributes[1]);
        tableRef.current.onQueryChange();
    };

    const deleteSales = (e) => {
        e.preventDefault();
        axios.delete('https://wongso-farm-api.herokuapp.com/v1/sales/deleteById', {params: {
            salesid: salesId
        }})
        .then((response) => {
            return response.status;
        }).then((status) => {
            if (status === 204) {
                window.location.reload();
            }
        }).catch((error) => {
            setTwoWayModalShow(false);
            setModalShow(true);
            setErrorMessage(error.response.data.message);
        });
    }

    const salesColumns = [
        {title: 'No', field: 'row_number', cellStyle: { width: "1%" }},
        {title: 'Date', field: 'sales_date', cellStyle: { width: "15%" }},
        {title: 'Name', field: 'customer_name', cellStyle: { width: "20%" }},
        {title: 'Level', field: 'level', cellStyle: { width: "20%" }},
        {title: 'Total order', field: 'qty', cellStyle: { width: "20%" }},
        {title: 'Price per unit', field: 'price_per_item', cellStyle: { width: "20%" }},
        {title: 'Total sales', field: 'total_price', cellStyle: { width: "20%" }}
    ]

    if (sessionStorage.getItem("userId") === null) {
        return <Navigate to="/login" />
    }

    return(
        <div className="sales-management">
            <Header title="Sales Management"/>
            <div className="options">
                <Button 
                    style={{
                        border: "none",
                        width: "15%",
                        backgroundColor: "#A0865E",
                        color: "#ffffff",
                        height: "5vh",
                        fontSize: "14px"
                    }} 
                    variant="contained" onClick={() => {navigate('create')}}>Create New</Button>
                <SearchBar
                    style={{
                        width: "45%",
                        height: "5vh",
                        border: "none"
                    }}
                    placeholder="search for sales by customers"
                    value={searchClause}
                    onChange={(newValue) => {
                        setSearchClause(newValue);
                        tableRef.current.onQueryChange();
                    }}
                    // onRequestSearch={() => doSomethingWith(this.state.value)}
                />
                <select name="sales-sort" id="sales-sort" onChange={handleSortOrderChange}>
                    <option value="" disabled selected>sort by</option>
                    <option value="sales_date ASC">date ascending</option>
                    <option value="sales_date DESC">date descending</option>
                </select>
            </div>
            <div className="sales-table">
                    <MaterialTable
                        tableRef={tableRef}
                        title="Sales tabular data"
                        columns={salesColumns}
                        data={query =>
                                new Promise((resolve, reject) => {
                                    axios.get('https://wongso-farm-api.herokuapp.com/v1/sales/findByUserIdPaginated',{params: {
                                        userid: sessionStorage.getItem("userId"),
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
                                            sales_id: row.sales_id,
                                            sales_date_unformatted: row.sales_date,
                                            sales_date: moment(row.sales_date).subtract(7, 'h').format("Do MMM YY, h:mm a"),
                                            customer_name: row.customer_name,
                                            level: row.level,
                                            qty: row.qty.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                                            price_per_item: row.price_per_item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                                            total_price: row.total_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                                fontSize: '1rem',
                                color: '#80715c'
                            },
                            rowStyle: {
                                backgroundColor: '#F9F9FC',
                                fontSize: '.9rem'
                            },
                            actionsColumnIndex: -1
                        }}
                        actions={[
                            {
                                icon: 'update',
                                tooltip: 'Update Sales',
                                iconProps: { style: { fontSize: "30px", color: "#A49F2E" } },
                                onClick: (event, rowData) => {
                                            navigate(`update/${rowData.sales_id}`, {state: rowData})
                                        }    
                            },
                            {
                                icon: 'delete',
                                tooltip: 'Delete Sales',
                                iconProps: { style: { fontSize: "30px", color: "#AD0909" } },
                                onClick: (event, rowData) => {
                                        setSalesId(rowData.sales_id);
                                        setTwoWayModalShow(true);
                                    }
                            }
                        ]}
                    /> 
                    <PromptModal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        title={"Delete Sales Error"}
                        desc={errorMessage}/>
                    <TwoWayModal
                        show={twoWayModalShow}
                        onHide = {() => setTwoWayModalShow(false)}
                        title={"Delete Sales Confirmation"}
                        desc={`Are you sure you want to delete this sales data from the list? (the action cannot be undone)`}
                        actionlabel={"Delete"}
                        action = {(e) => deleteSales(e)}/>
                </div>
        </div>
    )
}

export default SalesManagement;