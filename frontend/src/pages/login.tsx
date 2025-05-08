import React, { useState } from 'react';
import { loginUser } from '../utils/api';
import { useRouter } from 'next/router';
import styles from '../styles/login.module.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
    window.location.href = '/ResetPassword';
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <div className={styles.loginContainer}>
      <h1>Login</h1>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles.loginError}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <button className={styles.resetpasswordLink} onClick={handleResetPassword}>
        Forgot Password?
      </button>
      <button className={styles.registerRedirectButton} onClick={handleRegisterRedirect}>
        Don't have an account? Register
      </button>
    </div>
  );
};

export default Login;