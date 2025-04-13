import React, { Component } from 'react';
import './DangNhap.css';
import { ROUTES } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            showPassword: false
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = () => {
        // Lưu trạng thái đăng nhập
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ 
            email: this.state.email, 
            role: 'admin' 
        }));
        
        // Chuyển hướng đến trang chủ
        window.location.href = ROUTES.HOME;
    }
    

    toggleShowPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    render() {
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row"> 
                        <div className="col-12 login-text">Đăng Nhập</div>
                        <div className="col-12 form-group login-input">
                            <label>Email:</label>
                            <input type="text" 
                            className="form-control" 
                            placeholder="Enter your email" 
                            value={this.state.email}
                            onChange={(event) => this.handleOnChangeEmail(event)}
                            />
                        </div>

                        <div className="col-12 form-group login-input">
                            <label>Mật khẩu:</label>
                            <div className="custom-input-password" >
                                <input
                                    className="form-control"
                                    type={this.state.showPassword ? "text" : "password"}
                                    placeholder="Enter your password" 
                                    value={this.state.password}
                                    onChange={(event) => this.handleOnChangePassword(event)}
                                />
                                <span className="password-icon" onClick={this.toggleShowPassword}>
                                    <FontAwesomeIcon icon={this.state.showPassword ? faEye : faEyeSlash} />
                                </span>
                            </div>
                        </div>
                        <div className="col-12">
                            <button className="btn-login" onClick={() => { this.handleLogin()}} >Đăng Nhập</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;