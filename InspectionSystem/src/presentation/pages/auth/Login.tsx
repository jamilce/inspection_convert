import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { loginUser } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate reCAPTCHA response if needed
        const gRecaptchaResponse = 'test-recaptcha-token';

        // Dispatch thunk action
        dispatch(loginUser({ username, password, gRecaptchaResponse }));
    };

    return (
        <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg border-0" style={{ width: '450px', borderRadius: '15px' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h4 className="fw-bold text-success mb-1" style={{ color: '#bf8d42' }}>نظام الامتثال البيئي</h4>
                        <h5 className="text-muted">Smart Inspection System</h5>
                    </div>

                    <hr className="my-4" />

                    {error && (
                        <div className="alert alert-danger py-2" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group mb-3">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoFocus
                            />
                            <span className="input-group-text bg-light text-muted">@moccae.gov.ae</span>
                        </div>

                        <div className="input-group mb-4">
                            <span className="input-group-text bg-white border-end-0">
                                <i className="bi bi-lock"></i>
                            </span>
                            <input
                                type="password"
                                className="form-control border-start-0 ps-0"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="form-check">
                                <input className="form-check-input text-success" type="checkbox" id="rememberMe" />
                                <label className="form-check-label" htmlFor="rememberMe">
                                    تذكرنى (Remember me)
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success btn-lg w-100 rounded-pill shadow-sm"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    جاري تسجيل الدخول...
                                </>
                            ) : (
                                'تسجيل الدخول (Sign In)'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
