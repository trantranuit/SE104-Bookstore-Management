import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import './DangNhap.css';
import { ROUTES } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// Wrap the Login component with withRouter HOC
const withRouter = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
};

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            showPassword: false,
            role: 'staff' // Default role
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

    handleRoleChange = (event) => {
        this.setState({
            role: event.target.value
        })
    }

    handleLogin = () => {
        // Lưu trạng thái đăng nhập
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ 
            email: this.state.email, 
            role: this.state.role 
        }));
        
        // Chuyển hướng đến trang chủ sử dụng React Router
        this.props.navigate(ROUTES.HOME);
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

                        <div className="col-12 form-group login-input">
                            <label>Vai trò:</label>
                            <select 
                                className="form-control"
                                value={this.state.role}
                                onChange={this.handleRoleChange}
                            >
                                <option value="staff">Nhân viên</option>
                                <option value="manager">Quản lý</option>
                            </select>
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

export default withRouter(Login);