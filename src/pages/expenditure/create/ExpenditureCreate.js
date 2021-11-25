import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Header from '../../../components/header/Header';
import PromptModal from '../../../components/PromptModal';
import TwoWayModal from '../../../components/modal/TwoWayModal';
import './expenditurecreate.css';

const ExpenditureCreate = (props) => {
    const navigate = useNavigate();
    const [date, setDate] = useState("initial");
    const [totalExpense, setTotalExpense] = useState("initial");
    const [productiveExpense, setProductiveExpense] = useState("initial");
    const [expenseNote, setExpenseNote] = useState("");
    const [submitButtonState, setSubmitButtonState] = useState("disabled");
    const [dateState, setDateState] = useState("");
    const [totalExpenseState, setTotalExpenseState] = useState("");
    const [productiveExpenseState, setProductiveExpenseState] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const [twoWayModalShow, setTwoWayModalShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const getExpenseDate = (e) => {
        setDate(e.target.value);
    }

    const getTotalExpense = (e) => {
        setTotalExpense(e.target.value);
    }

    const getProductiveExpense = (e) => {
        setProductiveExpense(e.target.value);
    }

    const getExpenseNote = (e) => {
        setExpenseNote(e.target.value);
    }

    const create = (e) => {
        e.preventDefault();
        axios.post('https://wongso-farm-api.herokuapp.com/v1/expenditure/create', {
            userid: localStorage.getItem("userId"),
            expensedate: date,
            totalexpense: totalExpense,
            productiveexpense: productiveExpense,
            expensenote: expenseNote
        }).then((response) => {
            return response.status;
        }).then((status) => {
            if (status === 201) {
                navigate('/expenditure')
            }
        }).catch((error) => {
            setModalShow(true);
            setErrorMessage(error.response.data.message);
        });
    }

    const enableExpenditureBtn = () => {
        if (date.trim().length > 0 && totalExpense.trim().length > 0 && productiveExpense.length > 0) {
            if (date === "initial" || totalExpense === "initial" || productiveExpense === "initial") {
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

    const toggleConfirmation = (e) => {
        e.preventDefault();
        setTwoWayModalShow(true);
    }

    useEffect(() => {
        (date === "") ? setDateState("error-active") : setDateState("error-inactive");
    }, [date]);

    useEffect(() => {
        (totalExpense === "") ? setTotalExpenseState("error-active") : setTotalExpenseState("error-inactive");
    }, [totalExpense]);

    useEffect(() => {
        (productiveExpense === "") ? setProductiveExpenseState("error-active") : setProductiveExpenseState("error-inactive");
    }, [productiveExpense]);

    useEffect(() => {
        enableExpenditureBtn();
    })

    return(
        <div className="details">
            <Header title={props.title}/>
            <div className="expenditure-form-container offset-sm-1 col-sm-10">
                <form className="expenditure-form">
                    <h2 className="expenditure-title">Expenditure Information</h2>
                    <div className="date-container">
                        <label htmlFor="expense-date" className="expenditure-input-label">DATE</label> 
                        <input type="text" id="date" name="expense-date" className="expenditure-input" placeholder="ex: 2021-11-13 14:47:28" onChange={getExpenseDate}/>
                        <span className={dateState}>expenditure date cannot be empty</span>
                    </div>
                    <br/>
                    <div className="total-expense-container">
                        <label htmlFor="total-expense" className="expenditure-input-label">TOTAL EXPENSE</label>
                        <input type="number" id="total-expense" name="total-expense" className="expenditure-input" onChange={getTotalExpense}/>
                        <span className={totalExpenseState}>total expense cannot be empty</span>
                    </div>
                    <br/>
                    <div className="productive-expense-container">
                        <label htmlFor="productive-expense" className="expenditure-input-label">PRODUCTIVE EXPENSE</label>
                        <input type="number" id="productive-expense" name="productive-expense" className="expenditure-input" onChange={getProductiveExpense}/>
                        <span className={productiveExpenseState}>productive expense cannot be empty</span>
                    </div>
                    <br/>
                    <div className="expense-note-container">
                        <label htmlFor="expense-note" className="expenditure-input-label">EXPENSE NOTE</label>
                        <input type="text" id="expense-note" name="expense-note" className="expenditure-input" onChange={getExpenseNote}/>
                    </div>
                    <br/>
                    <button type="submit" style={{backgroundColor: '#BD7100'}} className={`create-btn-${submitButtonState} col-sm-3`} onClick={toggleConfirmation}>{props.btnLabel}</button>`
                </form>
            </div>
            <PromptModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                title={"Create Expenditure Error"}
                desc={errorMessage}/>
            <TwoWayModal
                show={twoWayModalShow}
                onHide = {() => setTwoWayModalShow(false)}
                title={"Create Expenditure Confirmation"}
                desc={"Are you sure you want to create a new expenditure information? (the action cannot be undone)"}
                actionlabel={"Create"}
                action = {(e) => create(e)}
            />
        </div>
    )
}


export default ExpenditureCreate;