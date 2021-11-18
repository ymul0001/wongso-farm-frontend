import {React, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header/Header';
import axios from "axios";
import moment from "moment";
import MaterialTable from 'material-table';
import Button from '@mui/material/Button';
import TwoWayModal from '../../components/modal/TwoWayModal';
import PromptModal from '../../components/PromptModal';
import './expenditure.css';

const Expenditure = () => {
    const navigate = useNavigate();
    const tableRef = useRef();
    const [sortOrder, setSortOrder] = useState('ASC');
    const [modalShow, setModalShow] = useState(false);
    const [twoWayModalShow, setTwoWayModalShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [expenseId, setExpenseId] = useState("");

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
        tableRef.current.onQueryChange()
        console.log(sortOrder);
    };

    const expenditureColumns = [
        {title: 'No', field: 'row_number', cellStyle: { width: "1%" }},
        {title: 'Date', field: 'expense_date', cellStyle: { width: "15%" }},
        {title: 'Total Expense (IDR)', field: 'total_expense', cellStyle: { width: "20%" }},
        {title: 'Productive Expense (IDR)', field: 'productive_expense', cellStyle: { width: "20%" }},
        {title: 'Note', field: 'expense_note', cellStyle: { width: "20%" }}
    ]

    const deleteExpenditure = (e) => {
        e.preventDefault();
        axios.delete('https://wongso-farm-api.herokuapp.com/v1/expenditure/deleteById', {params: {
            expenseid: expenseId
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
        <div className="expenditure">
            <Header title="Expenditure"/>
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
                    variant="contained" 
                    onClick={() => navigate('create')}>Create New</Button>
                <select name="date-sort" id="date-sort" onChange={handleSortOrderChange}>
                    <option value="" disabled selected>sort by</option>
                    <option value="ASC">date ascending</option>
                    <option value="DESC">date descending</option>
                </select>
            </div>
            <div className="expenditure-table">
                <MaterialTable
                    tableRef={tableRef}
                    title="Expenditure tabular data"
                    columns={expenditureColumns}
                    data={query =>
                            new Promise((resolve, reject) => {
                                axios.get('https://wongso-farm-api.herokuapp.com/v1/expenditure/findByUserIdPaginated',{params: {
                                    userid: localStorage.getItem("userId"), //todo: change userId to dynamically retrieved from the web page
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
                                    const selectedResults = result.results.map((row, index) => ({
                                        row_number: result.startIndex + (index + 1),
                                        expense_id: row.expense_id,
                                        expense_date_unformatted: row.expense_date,
                                        expense_date: moment(row.expense_date).subtract(7, 'h').format("Do MMM YY, h:mm a"),
                                        total_expense: row.total_expense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                                        productive_expense: row.productive_expense.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                                        expense_note: (row.expense_note != null) ? row.expense_note : "-"
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
                            tooltip: 'Update Expenditure',
                            iconProps: { style: { fontSize: "30px", color: "#A49F2E" } },
                            onClick: (event, rowData) => {
                                        navigate(`update/${rowData.expense_id}`, {state: rowData})
                                    }    
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Delete Expenditure',
                            iconProps: { style: { fontSize: "30px", color: "#AD0909" } },
                            onClick: (event, rowData) => {
                                    setExpenseId(rowData.expense_id);
                                    setTwoWayModalShow(true);
                                }
                        }
                    ]}
                /> 
                 <PromptModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    title={"Delete Expenditure Error"}
                    desc={errorMessage}/>
                <TwoWayModal
                    show={twoWayModalShow}
                    onHide = {() => setTwoWayModalShow(false)}
                    title={"Delete Expenditure Confirmation"}
                    desc={"Are you sure you want to delete this record from the expenditure list? (the action cannot be undone)"}
                    actionlabel={"Delete"}
                    action = {(e) => deleteExpenditure(e)}/>
            </div>
        </div>
    )
}

export default Expenditure;
