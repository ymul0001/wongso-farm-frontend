import {React, useState, useEffect} from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Header from '../../../components/header/Header';
import PromptModal from '../../../components/PromptModal';
import TwoWayModal from '../../../components/modal/TwoWayModal';
import './salesupdate.css';

const SalesUpdate = (props) => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [submitButtonState, setSubmitButtonState] = useState("disabled");
    const [salesDate, setSalesDate] = useState(new Date(state.sales_date_unformatted));
    const [salesTime, setSalesTime] = useState(state.sales_date_unformatted.replace('T',' ').slice(11,19))
    const [customerName, setCustomerName] = useState(state.customer_name);
    const [customerId, setCustomerId] = useState("");
    const [customerNames, setCustomerNames] = useState([]);
    const [totalOrder, setTotalOrder] = useState(state.qty.replace(/,/g, ''));
    const [pricePerUnit, setPricePerUnit] = useState(state.price_per_item.replace(/,/g, ''));
    const [level, setLevel] = useState(state.level);
    const [salesDateState, setSalesDateState] = useState("");
    const [salesTimeState, setSalesTimeState] = useState("");
    const [customerNameState, setCustomerNameState] = useState("");
    const [totalOrderState, setTotalOrderState] = useState("");
    const [pricePerUnitState, setPricePerUnitState] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [twoWayModalShow, setTwoWayModalShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const getSalesTime = (e) => {
        setSalesTime(e.target.value);
    }

    const getCustomerName = (e) => {
        setCustomerName(e.target.value);
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

    const getCustomerNames = () => {
        axios.get('https://wongso-farm-api.herokuapp.com/v1/customer/findCustomerNamesByUserId?', {params: {
            userid: sessionStorage.getItem("userId")
        }})
        .then((result) => {
            setCustomerNames(result.data.message);
        })
    } 

    const enableSalesBtn = () => {
        if (salesDate != null && salesTime.trim().length > 0 && customerName.trim().length > 0 && totalOrder.length > 0 && pricePerUnit.length > 0) {
                setSubmitButtonState("enabled");
        }
        else {
            setSubmitButtonState("disabled");
        }
    }

    const getCustomerId = () => {
        const customer = customerNames.filter((cust) => {
           return cust.customer_name === customerName;
        })
        setCustomerId(customer[0].customer_id);
    }

    const update = (e) => {
        
        e.preventDefault();
        axios.put(`https://wongso-farm-api.herokuapp.com/v1/sales/updateById?salesid=${state.sales_id}`, {
            salesdate: salesDate.toISOString().substring(0,10) + ' ' + salesTime,
            customerid: customerId,
            level: level,
            qty: totalOrder,
            priceperitem: pricePerUnit
        }).then((response) => {
            return response.status;
        }).then((status) => {
            if (status === 204) {
                navigate('/sales')
            }
        }).catch((error) => {
            setTwoWayModalShow(false);
            setModalShow(true);
            setErrorMessage(error.response.data.message);
        });
    }

    useEffect(() => {
        (salesDate == null) ? setSalesDateState("error-active") : setSalesDateState("error-inactive");
    }, [salesDate]);

    useEffect(() => {
        (salesTime === "") ? setSalesTimeState("error-active") : setSalesTimeState("error-inactive");
    })

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

    useEffect(() => {
        getCustomerNames();
    }, [])

    const toggleConfirmation = (e) => {
        console.log(salesDate);
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
                    <DatePicker selected={salesDate} onChange={(date) => setSalesDate(date)} />
                    <span className={salesDateState}>sales date cannot be empty</span>
                </div>
                <div className="time-container">
                    <label htmlFor="sales-time" className="sales-input-label">SALES TIME</label> 
                    <input type="text" id="sales-time" name="sales-time" className="sales-input" placeholder="ex: 14:47:28" value={salesTime} onChange={getSalesTime}/>
                    <span className={salesTimeState}>sales time cannot be empty</span>
                </div>
                <div className="customer-name-container">
                    <label htmlFor="customer-name" className="sales-input-label">CUSTOMER NAME</label>
                    <input autocomplete="off" type="text" id="customer-name" name="customer-name" className="sales-input" value= {customerName} onChange={getCustomerName} list="suggestions"/>
                    <datalist id="suggestions">
                        {customerNames && customerNames.map((cust) => {
                            return(<option value={cust.customer_name}/>)
                        })}
                    </datalist>
                    <span className={customerNameState}>customer name cannot be empty</span>
                </div>
                <div className="level-container">
                    <label for="level-selection" className="sales-input-label">LEVEL</label>
                    <select name="level-selection" id="level-selection" className="sales-input" value={level} onChange={getLevel}>
                        <option value="piece">piece</option>
                        <option value="kg">kg</option>
                    </select>
                </div> 
                <br/>
                <div className="total-order-container">
                    <label htmlFor="total-order" className="sales-input-label">TOTAL ORDER</label>
                    <input type="number" id="total-order" name="total-order" className="sales-input" value={totalOrder} onChange={getTotalOrder}/>
                    <span className={totalOrderState}>total order cannot be empty</span>
                </div>
                <div className="price-unit-container">
                    <label htmlFor="total-order" className="sales-input-label">PRICE PER UNIT</label>
                    <input type="number" id="total-order" name="total-order" className="sales-input" value={pricePerUnit} onChange={getPricePerUnit}/>
                    <span className={pricePerUnitState}>price per unit cannot be empty</span>
                </div>
                <button type="submit" style={{backgroundColor: '#A49F2E'}} className={`create-btn-${submitButtonState} col-sm-3`} onClick={toggleConfirmation}>{props.btnLabel}</button>`
            </form>
        </div>
        <PromptModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            title={"Update Sales Error"}
            desc={errorMessage}/>
        <TwoWayModal
            show={twoWayModalShow}
            onHide = {() => setTwoWayModalShow(false)}
            title={"Update Sales Confirmation"}
            desc={"Are you sure you want to update this sales information? (the action cannot be undone)"}
            actionlabel={"Update"}
            action = {(e) => update(e)}
        />
    </div>
    )
}

export default SalesUpdate;