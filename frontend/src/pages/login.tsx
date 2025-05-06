import React, { useState } from 'react';
import { loginUser } from '../utils/api';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { token } = await loginUser({ username, password });
      localStorage.setItem('token', token);
      window.location.href = '/dashboard'; // Redirect to the dashboard after successful login
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    }
  };

  const handleResetPassword = () => {
    console.log('Redirecting to reset password page...');
    window.location.href = '/ResetPassword'; // Redirect to the reset password page
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <button onClick={handleResetPassword}>Forgot Password?</button>
    </div>
  );
};

export default Login;