import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/auth/login', { password });
      setToken(response.data.token);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  useEffect(() => {
    if (token) {
      // Fetch admin data or redirect to admin dashboard
    }
  }, [token]);

  return (
    <div>
      <h1>Admin Panel</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AdminPanel;