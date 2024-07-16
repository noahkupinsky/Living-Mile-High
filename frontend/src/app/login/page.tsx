'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const success = await login(username, password);
      if (success) {
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
        if (redirectUrl) {
          router.replace(decodeURIComponent(redirectUrl));
        } else {
          router.replace('/');
        }
      } else {
        alert('Login failed, please try again.');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
      if (redirectUrl) {
        router.replace(decodeURIComponent(redirectUrl));
      } else {
        router.replace('/');
      }
    }
  }, [isAuthenticated, router]);

  return (
    <div>
      <h1>Admin Login</h1>
      <div>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;