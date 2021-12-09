import {React, useState, useEffect} from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/Header';
import PromptModal from '../../../components/PromptModal';
import TwoWayModal from '../../../components/modal/TwoWayModal';
import './customerupdate.css';

const CustomerUpdate = (props) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [customerInitial, setCustomerInitial] = useState(state.customer_initial);
    const [customerName, setCustomerName] = useState(state.customer_name);
    const [customerAddress, setCustomerAddress] = useState(state.customer_address);
    const [customerInitialState, setCustomerInitialState] = useState("");
    const [customerNameState, setCustomerNameState] = useState("");
    const [submitButtonState, setSubmitButtonState] = useState("disabled");
    const [modalShow, setModalShow] = useState(false);
    const [twoWayModalShow, setTwoWayModalShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getCustomerInitial = (e) => {
        setCustomerInitial(e.target.value);
    }

    const getCustomerName = (e) => {
        setCustomerName(e.target.value);
    }

    const getCustomerAddress = (e) => {
        setCustomerAddress(e.target.value);
    }

    const update = (e) => {
        e.preventDefault();
        axios.put(`https://wongso-farm-api.herokuapp.com/v1/customer/updateById?customerid=${state.customer_id}`, {
            customerinitial: customerInitial,
            customername: customerName,
            customeraddress: customerAddress
        }).then((response) => {
            return response.status;
        }).then((status) => {
            if (status === 204) {
                navigate('/customer')
            }
        }).catch((error) => {
            setTwoWayModalShow(false);
            setModalShow(true);
            setErrorMessage(error.response.data.message);
        });
    }


    const enableCustomerUpdateBtn = () => {
        if (customerInitial.trim().length > 0 && customerName.trim().length > 0) {
            setSubmitButtonState("enabled");
        }
        else {
            setSubmitButtonState("disabled");
        }
    }

    const toggleConfirmation = (e) => {
        e.preventDefault();
        setTwoWayModalShow(true);
    }

    useEffect(() => {
        (customerInitial === "") ? setCustomerInitialState("error-active") : setCustomerInitialState("error-inactive");
    }, [customerInitial]);

    useEffect(() => {
        (customerName === "") ? setCustomerNameState("error-active") : setCustomerNameState("error-inactive");
    }, [customerName]);

    useEffect(() => {
        enableCustomerUpdateBtn();
    })

    if (sessionStorage.getItem("userId") === null) {
        return <Navigate to="/login" />
    }

    return(
        <div className="details">
        <Header title={props.title}/>
        <div className="customer-form-container offset-sm-1 col-sm-10">
            <form className="customer-form">
                <h2 className="customer-title">Customer Information</h2>
                <div className="customer-initial-container">
                    <label htmlFor="customer-initial" className="customer-input-label">CUSTOMER INITIAL</label> 
                    <input type="text" id="customer-initial" name="customer-initial" className="customer-input" value={customerInitial} onChange={getCustomerInitial}/>
                    <span className={customerInitialState}>customer initial cannot be empty</span>
                </div>
                <div className="customer-name-container">
                    <label htmlFor="customer-name" className="customer-input-label">CUSTOMER NAME</label>
                    <input type="text" id="customer-name" name="customer-name" className="customer-input" value={customerName} onChange={getCustomerName}/>
                    <span className={customerNameState}>customer name cannot be empty</span>
                </div>
                <div className="customer-address-container">
                    <label htmlFor="customer-address" className="customer-input-label">CUSTOMER ADDRESS</label>
                    <input type="text" id="customer-address" name="customer-address" className="customer-input" value={customerAddress} onChange={getCustomerAddress}/>
                </div>
                <br/>
                <button type="submit" style={{backgroundColor: '#A49F2E'}} className={`create-btn-${submitButtonState} col-sm-3`} onClick={toggleConfirmation}>{props.btnLabel}</button>`
            </form>
        </div>
        <PromptModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            title={"Update Customer Error"}
            desc={errorMessage}/>
        <TwoWayModal
            show={twoWayModalShow}
            onHide = {() => setTwoWayModalShow(false)}
            title={"Update Customer Confirmation"}
            desc={"Are you sure you want to update this customer information with specific information? (the action cannot be undone)"}
            actionlabel={"Update"}
            action = {(e) => update(e)}
        />
    </div>
    )
}

export default CustomerUpdate;