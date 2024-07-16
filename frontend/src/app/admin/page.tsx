"use client";

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext';

const AdminPanel = () => {
  const { isAuthenticated, login } = useAuth()
  const [adminData, setAdminData] = useState({})
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleLogin = async () => {
    try {
      await login(username, password);
    } catch (error) {
      console.error('Login failed', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      setAdminData({ data: "Authenticated" });
    }
  }, [isAuthenticated])

  return (
    <div>
      <h1>Admin Panel</h1>
      {!isAuthenticated ? (
        <div>
          <input type="text" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, Admin!</h2>
          <pre>{JSON.stringify(adminData, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
