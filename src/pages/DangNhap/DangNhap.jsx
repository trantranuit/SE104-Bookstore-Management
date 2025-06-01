import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import authService from '../../services/authService'; // Import authService
import './DangNhap.css';
import logo from '../../assets/imgs/logo.svg';

// Wrapper function để sử dụng hook useNavigate với class component
function LoginWithNavigate(props) {
    const navigate = useNavigate();
    return <Login {...props} navigate={navigate} />;
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            showPassword: false,
            loading: false,
            error: '',
            role: 'Admin' // Thêm state role mặc định
        };
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        });
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        });
    }

    handleRoleChange = (event) => {
        this.setState({
            role: event.target.value
        });
    }

    toggleShowPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        });
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleLogin();
        }
    }

    handleLogin = async () => {
        this.setState({ loading: true, error: '' });

        try {
            if (!this.state.email || !this.state.password) {
                this.setState({ error: 'Vui lòng nhập đầy đủ thông tin đăng nhập', loading: false });
                return;
            }
            // Gọi API đăng nhập qua authService
            await authService.login(
                this.state.email,
                this.state.password,
                this.state.role
            );
            // Lưu role vào localStorage để sidebar sử dụng
            localStorage.setItem('currentRole', this.state.role);
            // Chuyển hướng đến trang chủ
            this.props.navigate(ROUTES.HOME);
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            // Hiển thị thông báo lỗi
            this.setState({
                error: 'Vui lòng kiểm tra tên đăng nhập và mật khẩu.',
                loading: false
            });
        }
    }

    render() {
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="col-12 text-center mb-4">
                            <img src={logo} alt="Logo" className="dangnhap-logo" />
                        </div>
                        <div className="col-12 login-text">Đăng Nhập</div>

                        {/* Hiển thị thông báo lỗi nếu có */}
                        {this.state.error && (
                            <div className="col-12 error-message-login" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
                                {this.state.error}
                            </div>
                        )}

                        <div className="col-12 form-group login-input">
                            <label>Username:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                value={this.state.email}
                                onChange={this.handleOnChangeEmail}
                                onKeyPress={this.handleKeyPress}
                                disabled={this.state.loading}
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
                                    onChange={this.handleOnChangePassword}
                                    onKeyPress={this.handleKeyPress}
                                    disabled={this.state.loading}
                                />
                                <span
                                    className="password-icon"
                                    onClick={this.toggleShowPassword}
                                >
                                    <FontAwesomeIcon icon={this.state.showPassword ? faEye : faEyeSlash} />
                                </span>
                            </div>
                        </div>

                        <div className="col-12 form-group login-input">
                            <label>Chọn vai trò:</label>
                            <select
                                className="form-control"
                                value={this.state.role}
                                onChange={this.handleRoleChange}
                                disabled={this.state.loading}
                            >
                                <option value="Kho">Kho</option>
                                <option value="Thu Ngân">Thu Ngân</option>
                                <option value="Quản Lý">Quản Lý</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <div className="col-12">
                            <button
                                className="btn-login"
                                onClick={this.handleLogin}
                                disabled={this.state.loading}
                            >
                                {this.state.loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginWithNavigate;