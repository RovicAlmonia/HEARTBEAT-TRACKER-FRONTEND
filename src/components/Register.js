import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    try {
      await api.post('/api/register/', { username, password });
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="heartbeat-icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>💓</div>
        <h2 style={{ color: '#ff4d4f' }}>Register</h2>
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
          autoComplete="new-password"
        />
        <button className="button-red" onClick={register}>Register</button>
        <div className="register-footer" style={{ marginTop: '1rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#ff4d4f' }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
