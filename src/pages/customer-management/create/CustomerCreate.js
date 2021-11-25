import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/Header';
import PromptModal from '../../../components/PromptModal';
import TwoWayModal from '../../../components/modal/TwoWayModal';
import './customercreate.css';


const CustomerCreate = (props) => {
    const navigate = useNavigate();
    const [customerInitial, setCustomerInitial] = useState("initial");
    const [customerName, setCustomerName] = useState("initial");
    const [customerAddress, setCustomerAddress] = useState("initial");
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

    const toggleConfirmation = (e) => {
        e.preventDefault();
        setTwoWayModalShow(true);
    }

    const create = (e) => {
        e.preventDefault();
        axios.post('https://wongso-farm-api.herokuapp.com/v1/customer/create', {
            userid: localStorage.getItem("userId"),
            customerinitial: customerInitial,
            customername: customerName,
            customeraddress: customerAddress,
        }).then((response) => {
            return response.status;
        }).then((status) => {
            if (status === 201) {
                navigate('/customer')
            }
        }).catch((error) => {
            setModalShow(true);
            setErrorMessage(error.response.data.message);
        });
    }

    const enableCustomerCreateBtn = () => {
        if (customerInitial.trim().length > 0 && customerName.trim().length > 0) {
            if (customerInitial === "initial" || customerName === "initial") {
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
        (customerInitial === "") ? setCustomerInitialState("error-active") : setCustomerInitialState("error-inactive");
    }, [customerInitial]);

    useEffect(() => {
        (customerName === "") ? setCustomerNameState("error-active") : setCustomerNameState("error-inactive");
    }, [customerName]);

    useEffect(() => {
        enableCustomerCreateBtn();
    })
    
    return(
        <div className="details">
            <Header title={props.title}/>
            <div className="customer-form-container offset-sm-1 col-sm-10">
                <form className="customer-form">
                    <h2 className="customer-title">Customer Information</h2>
                    <div className="customer-initial-container">
                        <label htmlFor="customer-initial" className="customer-input-label">CUSTOMER INITIAL</label> 
                        <input type="text" id="customer-initial" name="customer-initial" className="customer-input" onChange={getCustomerInitial}/>
                        <span className={customerInitialState}>customer initial cannot be empty</span>
                    </div>
                    <br/>
                    <div className="customer-name-container">
                        <label htmlFor="customer-name" className="customer-input-label">CUSTOMER NAME</label>
                        <input type="text" id="customer-name" name="customer-name" className="customer-input" onChange={getCustomerName}/>
                        <span className={customerNameState}>customer name cannot be empty</span>
                    </div>
                    <br/>
                    <div className="customer-address-container">
                        <label htmlFor="customer-address" className="customer-input-label">CUSTOMER ADDRESS</label>
                        <input type="text" id="customer-address" name="customer-address" className="customer-input" onChange={getCustomerAddress}/>
                    </div>
                    <br/>
                    <button type="submit" style={{backgroundColor: '#BD7100'}} className={`create-btn-${submitButtonState} col-sm-3`} onClick={toggleConfirmation}>{props.btnLabel}</button>`
                </form>
            </div>
            <PromptModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                title={"Create Customer Error"}
                desc={errorMessage}/>
            <TwoWayModal
                show={twoWayModalShow}
                onHide = {() => setTwoWayModalShow(false)}
                title={"Create Customer Confirmation"}
                desc={"Are you sure you want to create a new customer with specific information? (the action cannot be undone)"}
                actionlabel={"Create"}
                action = {(e) => create(e)}
            />
        </div>
    )
}

export default CustomerCreate;