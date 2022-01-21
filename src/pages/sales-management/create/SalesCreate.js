import {React, useState, useEffect} from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../../components/header/Header';
import PromptModal from '../../../components/PromptModal';
import TwoWayModal from '../../../components/modal/TwoWayModal';
import './salescreate.css';

const SalesCreate = (props) => {
    const navigate = useNavigate();
    const [submitButtonState, setSubmitButtonState] = useState("disabled");
    const [customerNames, setCustomerNames] = useState([]);
    const [salesDate, setSalesDate] = useState("initial");
    const [customerName, setCustomerName] = useState("initial");
    const [customerId, setCustomerId] = useState("");
    const [totalOrder, setTotalOrder] = useState("initial");
    const [pricePerUnit, setPricePerUnit] = useState("initial");
    const [level, setLevel] = useState("piece");
    const [salesDateState, setSalesDateState] = useState("");
    const [customerNameState, setCustomerNameState] = useState("");
    const [totalOrderState, setTotalOrderState] = useState("");
    const [pricePerUnitState, setPricePerUnitState] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [twoWayModalShow, setTwoWayModalShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getCustomerNames = () => {
        axios.get('https://wongso-farm-api.herokuapp.com/v1/customer/findCustomerNamesByUserId?', {params: {
            userid: 'c58665af-1318-4a31-b11a-0f2b810eb3ac' //TODO: Change user id to retrieve from local storage
        }})
        .then((result) => {
            setCustomerNames(result.data.message);
        })
    } 

    const getSalesDate = (e) => {
        setSalesDate(e.target.value);
    }

    const getCustomerName = (e) => {
        setCustomerName(e.target.value);
    }

    const getCustomerId = () => {
        const customer = customerNames.filter((cust) => {
           return cust.customer_name === customerName;
        })
        setCustomerId(customer[0].customer_id);
    }

    const getTotalOrder = (e) => {
        setTotalOrder(e.target.value);
    }

    const getPricePerUnit = (e) => {
        setPricePerUnit(e.target.value);
    }

    const getLevel = (e) => {
        setLevel(e.target.value);
    }

    const enableSalesBtn = () => {
        if (salesDate.trim().length > 0 && customerName.trim().length > 0 && totalOrder.length > 0 && pricePerUnit.length > 0) {
            if (salesDate === "initial" || customerName === "initial" || totalOrder === "initial" || pricePerUnit === "initial") {
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

    const create = (e) => {
        e.preventDefault();
        axios.post('https://wongso-farm-api.herokuapp.com/v1/sales/create', {
            customerid: customerId,
            userid: sessionStorage.getItem("userId"),
            salesdate: salesDate,
            level: level,
            qty: totalOrder,
            priceperitem: pricePerUnit,

        }).then((response) => {
            return response.status;
        }).then((status) => {
            
            if (status === 201) {
                navigate('/sales')
            }
        }).catch((error) => {
            setTwoWayModalShow(false);
            setModalShow(true);
            setErrorMessage(error.response.data.message);
        });
    }

    useEffect(() => {
        getCustomerNames();
    }, [])

    useEffect(() => {
        (salesDate === "") ? setSalesDateState("error-active") : setSalesDateState("error-inactive");
    }, [salesDate]);

    useEffect(() => {
        (customerName === "") ? setCustomerNameState("error-active") : setCustomerNameState("error-inactive");
    }, [customerName]);

    useEffect(() => {
        (totalOrder === "") ? setTotalOrderState("error-active") : setTotalOrderState("error-inactive");
    }, [totalOrder]);
    
    useEffect(() => {
        (pricePerUnit === "") ? setPricePerUnitState("error-active") : setPricePerUnitState("error-inactive");
    }, [pricePerUnit]);

    useEffect(() => {
        enableSalesBtn();
    })

    const toggleConfirmation = (e) => {
        e.preventDefault();
        getCustomerId();
        setTwoWayModalShow(true);
    }

    if (sessionStorage.getItem("userId") === null) {
        return <Navigate to="/login" />
    }

    return(
        <div className="details">
        <Header title={props.title}/>
        <div className="sales-form-container offset-sm-1 col-sm-10">
            <form className="sales-form">
                <h2 className="sales-title">Sales Information</h2>
                <div className="date-container">
                    <label htmlFor="sales-date" className="sales-input-label">SALES DATE</label> 
                    <input type="text" id="sales-date" name="sales-date" className="sales-input" placeholder="ex: 2021-11-13 14:47:28" onChange={getSalesDate}/>
                    <span className={salesDateState}>sales date cannot be empty</span>
                </div>
                <div className="customer-name-container">
                    <label htmlFor="customer-name" className="sales-input-label">CUSTOMER NAME</label>
                    <input autocomplete="off" type="text" id="customer-name" name="customer-name" className="sales-input" onChange={getCustomerName} list="suggestions"/>
                    <datalist id="suggestions">
                        {customerNames && customerNames.map((cust) => {
                            return(<option value={cust.customer_name}/>)
                        })}
                    </datalist>
                    <span className={customerNameState}>customer name cannot be empty</span>
                </div>
                <div className="level-container">
                    <label for="level-selection" className="sales-input-label">LEVEL</label>
                    <select name="level-selection" id="level-selection" className="sales-input" onChange={getLevel}>
                        <option value="piece">piece</option>
                        <option value="kg">kg</option>
                    </select>
                </div>
                <br/>
                <div className="total-order-container">
                    <label htmlFor="total-order" className="sales-input-label">TOTAL ORDER</label>
                    <input type="number" id="total-order" name="total-order" className="sales-input" onChange={getTotalOrder}/>
                    <span className={totalOrderState}>total order cannot be empty</span>
                </div>
                <div className="price-unit-container">
                    <label htmlFor="total-order" className="sales-input-label">PRICE PER UNIT</label>
                    <input type="number" id="total-order" name="total-order" className="sales-input" onChange={getPricePerUnit}/>
                    <span className={pricePerUnitState}>price per unit cannot be empty</span>
                </div>
                <button type="submit" style={{backgroundColor: '#BD7100'}} className={`create-btn-${submitButtonState} col-sm-3`} onClick={toggleConfirmation}>{props.btnLabel}</button>`
            </form>
        </div>
        <PromptModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            title={"Create Sales Data Error"}
            desc={errorMessage}/>
        <TwoWayModal
            show={twoWayModalShow}
            onHide = {() => setTwoWayModalShow(false)}
            title={"Create Sales Confirmation"}
            desc={"Are you sure you want to create a new sales information? (the action cannot be undone)"}
            actionlabel={"Create"}
            action={(e) => create(e)}
        />
    </div>
    )
}

export default SalesCreate;