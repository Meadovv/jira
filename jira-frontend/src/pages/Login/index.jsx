import React from "react";
import "./index.css"
import axios from "axios";
import configs from "../../.configs";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();
    const [username, setUsername] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    
    const handleLogin = async () => {
        await axios.post(`${configs.API_URL}/auth/login`, {
            username, password
        })
        .then(res => {
            alert(res.data.message);
            localStorage.setItem("token", res.data.token);
            navigate("/");
        })
        .catch(err => {
            console.log(err);
            alert("Login failed with error: " + err.response.data.message);
        })
    }

    return (
        <div className="login-container">
            <div className="login-panel">
                <div className="login-panel-title">
                    Welcome to Jira
                </div>
                <div className="login-panel-form">
                    <div className="panel-form-item">
                        <div className="form-label">Username</div>
                        <input type="text" onChange={(event) => {
                            const new_username = event.target.value;
                            setUsername(new_username);
                        }}/>
                    </div>
                    <div className="panel-form-item">
                        <div className="form-label">Password</div>
                        <input type="password" onChange={(event) => {
                            const new_password = event.target.value;
                            setPassword(new_password);
                        }}/>
                    </div>
                    <div>
                        <button className="login-button" onClick={handleLogin}>Login</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;