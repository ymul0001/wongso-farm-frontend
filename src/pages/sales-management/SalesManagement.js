import {React, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import Button from '@mui/material/Button';
import SearchBar from 'material-ui-search-bar';
import './salesmanagement.css';

const SalesManagement = () => {
    const navigate = useNavigate();
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
                        fontSize: "18px"
                    }} 
                    variant="contained" onClick={() => {navigate('create')}}>Create New</Button>
                <SearchBar
                    style={{
                        width: "35%",
                        height: "4.9vh",
                        border: "none"
                    }}
                    placeholder="search for sales by customers"
                    // value={searchClause}
                    // onChange={(newValue) => {
                    //     setSearchClause(newValue);
                    //     tableRef.current.onQueryChange();
                    // }}
                    // onRequestSearch={() => doSomethingWith(this.state.value)}
                />
                <select name="sales-sort" id="sales-sort">
                    <option value="" disabled selected>sort by</option>
                    <option value="sales_date ASC">date ascending</option>
                    <option value="sales_date DESC">date descending</option>
                </select>
            </div>
        </div>
    )
}

export default SalesManagement;