import React, {useState, useEffect} from 'react';
import axios from "axios";
import './login.css'
import PromptModal from '../../components/PromptModal';
import {useNavigate} from 'react-router-dom';


const Login = () => {
    const [username, setUsername] = useState("initial");
    const [password, setPassword] = useState("initial");
    const [usernameState, setUsernameState] = useState("");
    const [passwordState, setPasswordState] = useState("");
    const [submitButtonState, setSubmitButtonState] = useState("disabled");
    const [errorMessage, setErrorMessage] = useState("");
    const [modalShow, setModalShow] = useState(false);
    const navigate = useNavigate();

    const getUsername = (e) => {
        setUsername(e.target.value);
    }

    const getPassword = (e) => {
        setPassword(e.target.value);
    }

    const enableLoginBtn = () => {
        if (username.trim().length > 0 && password.trim().length > 0) {
            if (username === "initial" || password === "initial") {
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

    const login = (e) => {
        e.preventDefault();
        axios.get('https://wongso-farm-api.herokuapp.com/v1/credential/findByUserNameAndPassword',{params: {
            username: username,
            password: password
        }}).then((response) => {
            console.log(response);
            if (response.status === 200) {
                window.localStorage.setItem('userId', response.data.message[0].user_id);
                navigate('/overview');
            }
        }).catch((error) => {
            setModalShow(true);
            setErrorMessage(error.response.data.message);
        });
    }

    useEffect(() => {
        (username === "") ? setUsernameState("error-active") : setUsernameState("error-inactive");
    }, [username]);

    useEffect(() => {
        (password === "") ? setPasswordState("error-active") : setPasswordState("error-inactive");
    }, [password]);

    useEffect(() => {
        enableLoginBtn();
    })
    
    return (
        <div className="login-page row">
            <div className="login-banner col-sm-6">
            </div>
            <div className="login-container col-sm-6">
                <form method="get" className="login-form">
                    <h2 className="login-title">Login</h2>
                    <div className="username-container">
                        <label htmlFor="username" className="input-label">USERNAME</label> 
                        <br/>
                        <input type="text" id="username" name="username" className="login-input" onChange={getUsername}/>
                        <span className={usernameState}>username cannot be empty</span>
                    </div>
                    <div className="password-container">
                        <label htmlFor="password" className="input-label">PASSWORD</label>
                        <br />
                        <input type="password" id="password" name="password" className="login-input" onChange={getPassword}/>
                        <span className={passwordState}>password cannot be empty</span>
                    </div>
                    <br />
                    <button type="submit" className={"login-btn col-sm-3 " + submitButtonState} onClick={(e) => {login(e)}}>Login</button>`
                </form>
            </div>
            <PromptModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                title={"Login Error"}
                desc={errorMessage}
            />
        </div>
    )
}

export default Login;