import React, { useEffect, useState } from 'react';
import api from '../api';
import '../App.css';

const HeartbeatHistory = () => {
  const [heartbeats, setHeartbeats] = useState([]);

  useEffect(() => {
    api.get('/api/heartbeat/').then(res => {
      setHeartbeats(res.data);
    });
  }, []);

  return (
    <div className="card" style={{ maxWidth: 600 }}>
      <h3>Heartbeat History</h3>
      <ul>
        {heartbeats.map(h => (
          <li key={h.id}>
            {h.value} BPM @ {new Date(h.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeartbeatHistory;
