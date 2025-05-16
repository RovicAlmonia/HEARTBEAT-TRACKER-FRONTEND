import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../App.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await api.post('/api/token/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="heartbeat-icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>💓</div>
        <h2 style={{ color: '#ff4d4f' }}>Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          onKeyDown={e => { if (e.key === 'Enter') login(); }}
        />
        <button className="button-red" onClick={login}>Login</button>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#ff4d4f' }}>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
