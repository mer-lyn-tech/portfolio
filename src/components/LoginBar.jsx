import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import './LoginBar.css';

export default function LoginBar() {
  const { isAdmin, setIsAdmin } = useAdmin();
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    if (password === 'merlyn2024') {
      setIsAdmin(true);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500); // Remove shake class after animation
    }
  };

  return (
    <div className="login-bar">
      <div className="login-bar-content">
        {isAdmin ? (
          <div className="admin-badge">
            <span className="pulse-dot"></span> ADMIN ACTIVE
          </div>
        ) : (
          <div className="login-controls">
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={shake ? 'shake' : ''}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <button onClick={handleLogin}>Admin Login</button>
          </div>
        )}
      </div>
    </div>
  );
}
