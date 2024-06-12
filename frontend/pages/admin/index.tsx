import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [adminData, setAdminData] = useState(null);

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
      axios.get('/api/auth/data', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setAdminData(response.data))
      .catch(error => console.error('Failed to fetch admin data', error));
    }
  }, [token]);

  return (
    <div>
      <h1>Admin Panel</h1>
      {!token ? (
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, Admin!</h2>
          <pre>{JSON.stringify(adminData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;