// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import '../App.css';

export default function Dashboard() {
  const [heartbeats, setHeartbeats] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Redirect if no token
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Fetch heartbeats and refresh every 3 seconds
  useEffect(() => {
    const fetchHeartbeats = async () => {
      try {
        setErrorMsg('');

        const response = await api.get('/api/heartbeat/');
        console.log('Heartbeat API response:', response.data);

        let data = [];

        if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data.results && Array.isArray(response.data.results)) {
          data = response.data.results;
        } else {
          throw new Error('Unexpected response format from API.');
        }

        // Sort data by timestamp ascending for chart
        data.sort((a, b) => new Date(a.timestamp || a.time) - new Date(b.timestamp || b.time));

        setHeartbeats(data);
      } catch (error) {
        console.error('Error fetching heartbeats:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate('/login', { replace: true });
        } else {
          setErrorMsg('Failed to fetch heartbeat data.');
        }
      }
    };

    fetchHeartbeats();
    const interval = setInterval(fetchHeartbeats, 3000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  // Prepare data for the chart
  const chartData = heartbeats.map(beat => ({
    time: new Date(beat.timestamp || beat.time).toLocaleTimeString(),
    bpm: beat.value || beat.heart_rate || 0,
  }));

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div
        className="card"
        style={{
          maxWidth: 900,
          minHeight: 600,
          padding: '2rem',
          borderRadius: '10px',
          boxShadow: '0 0 15px rgba(0,0,0,0.2)',
          backgroundColor: '#fff',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div className="heartbeat-icon" style={{ fontSize: '3rem', marginBottom: '10px' }}>💓</div>
        <h2 style={{ color: '#ff4d4f' }}>Dashboard - Heartbeat Data</h2>
        <button onClick={handleLogout} className="button-red logout" style={{ marginBottom: '1rem' }}>
          Logout
        </button>

        {errorMsg && <p style={{ color: 'red', fontSize: '1.2rem' }}>{errorMsg}</p>}

        {!errorMsg && heartbeats.length > 0 && (
          <>
            <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Heartbeat Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[40, 140]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bpm"
                  stroke="#ff4d4f"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>

            <ul style={{ maxHeight: 250, overflowY: 'auto', paddingLeft: 0, marginTop: '1rem' }}>
              {heartbeats.map((beat, index) => {
                const key = beat.id || beat._id || index;
                const value = beat.value || beat.heart_rate || 0;
                let bpmClass = "bpm-normal";
                if (value < 60) bpmClass = "bpm-low";
                else if (value > 100) bpmClass = "bpm-high";

                return (
                  <li
                    key={key}
                    className={bpmClass}
                    style={{ marginBottom: '0.5rem', listStyle: 'none' }}
                  >
                    💓 <strong>{value} BPM</strong> - {new Date(beat.timestamp || beat.time).toLocaleString()}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {!errorMsg && heartbeats.length === 0 && (
          <p>No heartbeat records available.</p>
        )}
      </div>
    </div>
  );
}
