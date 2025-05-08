import React, { useState } from 'react';
import { resetPassword } from '../utils/api';
import styles from '../styles/Resetpassword.module.css';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await resetPassword({ email, newPassword });
      setSuccessMessage('Password reset successfully! You can now log in with your new password.');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    }
  };

  return (
    <div className={styles.resetContainer}>
      <h1>Reset Password</h1>
      <form className={styles.resetForm} onSubmit={handleResetPassword}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        {error && <div className={styles.resetError}>{error}</div>}
        {successMessage && <div className={styles.resetSuccess}>{successMessage}</div>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;