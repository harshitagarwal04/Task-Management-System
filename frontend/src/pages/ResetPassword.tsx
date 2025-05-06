import React, { useState } from 'react';
import { resetPassword } from '../utils/api';

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
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handleResetPassword}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;