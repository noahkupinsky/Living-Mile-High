'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { styled, Button, View, Input, Text } from 'tamagui';

const Container = styled(View, {
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
});

const Title = styled(Text, {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
});

const Form = styled(View, {
  width: '100%',
});

const FormRow = styled(View, {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '15px',
});

const FormLabel = styled(Text, {
  fontSize: '14px',
  marginBottom: '5px',
  color: '#333',
});

const StyledInput = styled(Input, {
  width: '100%',
  padding: '10px',
  borderColor: '#ccc',
  borderWidth: '1px',
  borderRadius: '5px',
  fontSize: '16px',
  backgroundColor: '#fff',
});

const StyledButton = styled(Button, {
  width: '100%',
  padding: '10px',
  marginTop: '10px',
  backgroundColor: '#007BFF',
  color: '#fff',
  borderRadius: '5px',
  cursor: 'pointer',
});

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
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
    <Container>
      <Title>Admin Login</Title>
      <Form>
        <FormRow>
          <FormLabel>Username</FormLabel>
          <StyledInput
            value={username} onChange={(e: any) => setUsername(e.target.value)} placeholder="Username" />
        </FormRow>
        <FormRow>
          <FormLabel>Password</FormLabel>
          <StyledInput

            value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="Password" secureTextEntry />
        </FormRow>
        <StyledButton onPress={handleLogin}>Login</StyledButton>
      </Form>
    </Container>
  );
};

export default LoginPage;