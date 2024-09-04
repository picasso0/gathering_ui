import React from "react";
import "../../assets/css/login.css"
import { Link } from 'react-router-dom';
import authLayout from "../../hoc/authLayout";
import axios from "axios";
class LoginPage extends React.Component {
    state = {
        username: '',
        password: '',
        error: '',
      };
    
      handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
      };
    
      handleSubmit = async (e) => {
        e.preventDefault();
    
        const { username, password } = this.state;
        try {
            const response = await axios.post(process.env.REACT_APP_API_URL + '/token/', { username, password });
      
            // Store the access token in local storage or a cookie
            localStorage.setItem('accessToken', response.data.access_token);
            
            // Redirect the user to a protected route
            window.location.href = '/';
          } catch (error) {
            this.setState({ error: 'Invalid username or password' });
          }
        };

    render(){
        const { username, password, error } = this.state;
        return <>
            <form onSubmit={this.handleSubmit} className="login-form">
                <div className="d-flex align-items-center my-4">
                    <h1 className="text-center fw-normal mb-0 me-3">Sign In</h1>
                </div>
                {/* <!-- Email input --> */}
                <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="form3Example3">Username</label>
                    <input name="username" value={username} onChange={this.handleChange} type="text" id="form3Example3" className="form-control form-control-lg"                    placeholder="Enter Username" />
                </div>

                {/* <!-- Password input --> */}
                <div className="form-outline mb-3">
                    <label className="form-label" htmlFor="form3Example4">Password</label>
                    <input name="password" value={password} onChange={this.handleChange} type="password" id="form3Example4" className="form-control form-control-lg"
                    placeholder="Enter password" />
                </div>

                <div className="text-center text-lg-start mt-4 pt-2">
                {error && <div>{error}</div>}
          <button className="btn btn-primary btn-lg" type="submit">Login</button>
                </div>
            </form>
        </>
    }
}

export default authLayout(LoginPage);