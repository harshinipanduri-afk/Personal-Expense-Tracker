import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await API.post('/auth/register', {
                name,
                email,
                password
            });

            localStorage.setItem('token', response.data.token);

            alert('Registration successful!');
            navigate('/dashboard');

        } catch (err) {
            setError(
                err.response?.data?.message || 'Registration failed. Please try again.'
            );
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h1>Personal Expense Tracker</h1>
                <h2>Create Account</h2>
                <p>Register to start tracking your expenses</p>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">Register</button>
                </form>

                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}

export default Register;