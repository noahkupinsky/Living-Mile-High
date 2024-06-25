"use client";

import { useState, useEffect } from 'react'
import { useServices } from '@/providers/ServiceProvider';

const AdminPanel = () => {
  const { apiService } = useServices();
  const [adminData, setAdminData] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const handleLogin = async () => {
    try {
      setIsAuthenticated(await apiService.login(username, password));
    } catch (error) {
      console.error('Login failed', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      apiService.fetch('/auth/data').then(data => setAdminData(data))
    }
  }, [apiService, isAuthenticated])

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
