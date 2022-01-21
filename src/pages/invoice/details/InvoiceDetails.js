import {React, useState, useEffect, useRef} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Header from '../../../components/header/Header';
import { useReactToPrint } from "react-to-print";
import { InvoiceTemplate } from '../../../components/invoice/InvoiceTemplate';
import './invoicedetails.css';

const InvoiceDetails = (props) => {
    const { state } = useLocation();
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    if (sessionStorage.getItem("userId") === null) {
        return <Navigate to="/login" />
    }

    return(
        <div className="invoice-details">
            <Header title={props.title}/>
            <button className="print-btn" onClick={handlePrint}>Print Invoice</button>
            <div className="invoice-template-container">
                <InvoiceTemplate ref={componentRef} state={state}/>
            </div>
        </div>
    )
}

export default InvoiceDetails;