import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API.post('/auth/login', {
                email,
                password
            });

            localStorage.setItem('token', response.data.token);

            alert('Login successful!');
            navigate('/dashboard');

        } catch (err) {
            setError(
                err.response?.data?.message || 'Invalid email or password.'
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Personal Expense Tracker</h1>
                <h2>Welcome Back!</h2>
                <p>Login to manage your expenses</p>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Login</button>
                </form>

                <p>
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </div>
        </div>
    );
}

export default Login;