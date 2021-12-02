import {React, useState, useEffect} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Header from '../../../components/header/Header';
import PromptModal from '../../../components/PromptModal';
import TwoWayModal from '../../../components/modal/TwoWayModal';
import './expenditureupdate.css';

const ExpenditureUpdate = (props) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [date, setDate] = useState(state.expense_date_unformatted.slice(0,19).replace('T',' '));
    const [totalExpense, setTotalExpense] = useState(state.total_expense.replace(/,/g, ''));
    const [productiveExpense, setProductiveExpense] = useState(state.productive_expense.replace(/,/g, ''));
    const [expenseNote, setExpenseNote] = useState((state.expense_note === "-") ? "" : state.expense_note);
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

    const update = (e) => {
        e.preventDefault();
        axios.put(`https://wongso-farm-api.herokuapp.com/v1/expenditure/updateById?expenseid=${state.expense_id}`, {
            userid: localStorage.getItem("userId"),
            expensedate: date,
            totalexpense: totalExpense,
            productiveexpense: productiveExpense,
            expensenote: expenseNote
        }).then((response) => {
            return response.status;
        }).then((status) => {
            if (status === 204) {
                navigate('/expenditure')
            }
        }).catch((error) => {
            setTwoWayModalShow(false);
            setModalShow(true);
            setErrorMessage(error.response.data.message);
        });
    }

    const enableExpenditureBtn = () => {
        if (date.trim().length > 0 && totalExpense.trim().length > 0 && productiveExpense.length > 0) {
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
                        <input type="text" id="date" name="expense-date" className="expenditure-input" placeholder="ex: 2021-11-13 14:47:28" value={date} onChange={getExpenseDate}/>
                        <span className={dateState}>expenditure date cannot be empty</span>
                    </div>
                    <br/>
                    <div className="total-expense-container">
                        <label htmlFor="total-expense" className="expenditure-input-label">TOTAL EXPENSE</label>
                        <input type="number" id="total-expense" name="total-expense" className="expenditure-input" value={totalExpense} onChange={getTotalExpense}/>
                        <span className={totalExpenseState}>total expense cannot be empty</span>
                    </div>
                    <br/>
                    <div className="productive-expense-container">
                        <label htmlFor="productive-expense" className="expenditure-input-label">PRODUCTIVE EXPENSE</label>
                        <input type="number" id="productive-expense" name="productive-expense" className="expenditure-input" value={productiveExpense} onChange={getProductiveExpense}/>
                        <span className={productiveExpenseState}>productive expense cannot be empty</span>
                    </div>
                    <br/>
                    <div className="expense-note-container">
                        <label htmlFor="expense-note" className="expenditure-input-label">EXPENSE NOTE</label>
                        <input type="text" id="expense-note" name="expense-note" className="expenditure-input" value={expenseNote} onChange={getExpenseNote}/>
                    </div>
                    <br/>
                    <button type="submit" style={{backgroundColor: '#A49F2E'}} className={`create-btn-${submitButtonState} col-sm-3`} onClick={toggleConfirmation}>{props.btnLabel}</button>`
                </form>
            </div>
            <PromptModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                title={"Update Expenditure Error"}
                desc={errorMessage}/>
            <TwoWayModal
                show={twoWayModalShow}
                onHide = {() => setTwoWayModalShow(false)}
                title={"Update Expenditure Confirmation"}
                desc={"Are you sure you want to update this expenditure information? (the action cannot be undone)."}
                actionlabel={"Update"}
                action = {(e) => update(e)}/>
        </div>
    )
}

export default ExpenditureUpdate