import {React, useState, useEffect} from 'react';
import {useNavigate, Navigate} from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/header/Header';
import './invoice.css';

const Invoice = (props) => {
    const navigate = useNavigate();
    const [submitButtonState, setSubmitButtonState] = useState("disabled");
    const [customerNames, setCustomerNames] = useState([]);
    const [salesDates, setSalesDates] = useState([]);
    const [customerName, setCustomerName] = useState("initial");
    const [invoiceDate, setInvoiceDate] = useState("initial");
    const [customerNameState, setCustomerNameState] = useState("");
    const [invoiceDateState, setInvoiceDateState] = useState("");

    const generateInvoice = (e) => {
        e.preventDefault();
        getInvoiceItems();
    }

    const getInvoiceDate = (e) => {
        setInvoiceDate(e.target.value);
    }

    const getCustomerName = (e) => {
        setCustomerName(e.target.value);
    }

    const getAllCustomerNames = (e) => {
        axios.get('https://wongso-farm-api.herokuapp.com/v1/invoice/findDistinctCustomerNames', {params: {
            userid: 'c58665af-1318-4a31-b11a-0f2b810eb3ac' //TODO: Change user id to retrieve from local storage
        }})
        .then((result) => {
            setCustomerNames(result.data.message);
        })
    }

    const getAllSalesDates = (e) => {
        axios.get('https://wongso-farm-api.herokuapp.com/v1/invoice/findSalesDateForEachCustomerName', {params: {
            userid: 'c58665af-1318-4a31-b11a-0f2b810eb3ac', //TODO: Change user id to retrieve from local storage
            customername: customerName
        }})
        .then((result) => {
            setSalesDates(result.data.message);
        })
    } 

    const getInvoiceItems = () => {
        axios.get('https://wongso-farm-api.herokuapp.com/v1/invoice/findInvoiceItems', {params: {
            userid: 'c58665af-1318-4a31-b11a-0f2b810eb3ac', //TODO: Change user id to retrieve from local storage
            customername: customerName,
            salesdate: invoiceDate
        }})
        .then((result) => {
            navigate(`details`, {state: {
                invoiceItems: result.data.message
            }})
        })
    }

    const enableInvoiceBtn = () => {
        if (invoiceDate.trim().length > 0 && customerName.trim().length > 0) {
            if (invoiceDate === "initial" || customerName === "initial") {
                setSubmitButtonState("disabled");
            }
            else {
                setSubmitButtonState("enabled");
            }
        }
        else {
            setSubmitButtonState("disabled");
        }
    }

    useEffect(() => {
        getAllCustomerNames();
    }, [])

    useEffect(() => {
        getAllSalesDates();
    })

    useEffect(() => {
        (invoiceDate === "") ? setInvoiceDateState("error-active") : setInvoiceDateState("error-inactive");
    }, [invoiceDate]);

    useEffect(() => {
        (customerName === "") ? setCustomerNameState("error-active") : setCustomerNameState("error-inactive");
    }, [customerName]);

    useEffect(() => {
        enableInvoiceBtn();
    })

    if (sessionStorage.getItem("userId") === null) {
        return <Navigate to="/login" />
    }

    return(
        <div className="invoice">
            <Header title="Invoice"/>
            <div className="invoice-form-container offset-sm-1 col-sm-10">
                <form className="invoice-form">
                    <h2 className="invoice-title">Invoice Information</h2>
                    <div className="customer-name-container">
                        <label htmlFor="customer-name" className="invoice-input-label">CUSTOMER NAME</label>
                        <input autocomplete="off" type="text" id="customer-name" name="customer-name" className="invoice-input" onChange={getCustomerName} list="suggestions"/>
                        <datalist id="suggestions">
                            {customerNames && customerNames.map((cust) => {
                                return(<option value={cust.customer_name}/>)
                            })}
                        </datalist>
                        <span className={customerNameState}>customer name cannot be empty</span>
                    </div>
                    <div className="invoice-date-container">
                        <label htmlFor="invoice-date" className="invoice-input-label">INVOICE DATE</label>
                        <input autocomplete="off" type="text" id="invoice-date" name="invoice-date" className="invoice-input" placeholder="ex: 2021-11-13" list="sales-suggestions" onChange={getInvoiceDate}/>
                        <datalist id="sales-suggestions">
                            {salesDates && salesDates.map((date) => {
                                return(<option value={date.sales_date}/>)
                            })}
                        </datalist>
                        <span className={invoiceDateState}>invoice cannot be empty</span>
                    </div>
                    <button type="submit" style={{backgroundColor: '#BD7100'}} className={`create-btn-${submitButtonState} col-sm-3`} onClick={generateInvoice}>{props.btnLabel}</button>
                </form>
            </div>
        </div>
    )
}

export default Invoice;