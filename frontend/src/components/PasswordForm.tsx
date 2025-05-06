import React, { useState } from 'react';

interface PasswordFormProps {
  mode: 'reset' | 'change'; // 'reset' for forgot password, 'change' for profile page
  onSubmit: (data: { currentPassword?: string; newPassword: string }) => Promise<void>;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ mode, onSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      await onSubmit({ currentPassword, newPassword });
      setSuccessMessage(mode === 'reset' ? 'Password reset successfully!' : 'Password changed successfully!');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <form onSubmit={handleSubmit}>
        {mode === 'change' && (
          <div>
            <label htmlFor="currentPassword">Current Password:</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ display: 'block', marginBottom: '10px' }}
            />
          </div>
        )}
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{ display: 'block', marginBottom: '10px' }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          {mode === 'reset' ? 'Reset Password' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;