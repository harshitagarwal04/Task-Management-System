import React, { useState, useEffect } from 'react';
import styles from '../styles/profile.module.css';
import { getUserProfile, updateUserProfile, changePassword } from '../utils/api';
import PasswordForm from '../components/PasswordForm';

interface UserProfile {
  username: string; // Non-editable
  name?: string; // Editable
  email: string;
  password?: string; // Optional for updating
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfile();
        setProfile(userProfile);
      } catch (err) {
        setError('Failed to load profile. Please log in again.');
        localStorage.removeItem('token'); // Clear the token
        window.location.href = '/login';  // Redirect to login page
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({ ...profile, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      await updateUserProfile({
        name: profile.name ?? '',
        email: profile.email,
        password: profile.password,
      });
      setSuccessMessage('Profile updated successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to update profile.');
      setSuccessMessage(null);
    }
  };

  const handleChangePassword = async ({ currentPassword, newPassword }: { currentPassword?: string; newPassword: string }) => {
    try {
      await changePassword({ currentPassword: currentPassword ?? '', newPassword });
      setSuccessMessage('Password changed successfully!');
      setError(null);
      setShowChangePasswordForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
    }
  };

  const handleGoBack = () => {
    window.location.href = '/dashboard';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.backButtonContainer}>
        <button onClick={handleGoBack} className={styles.goBackButton}>
          Go Back to Dashboard
        </button>
      </div>

      <h1 className={styles.profileHeading}>My Profile</h1>
      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      {profile && (
        <form className={styles.profileForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={profile.username || ''}
              className={styles.formInput}
              disabled
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name || ''}
              onChange={handleInputChange}
              className={styles.formInput}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.formLabel}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email || ''}
              onChange={handleInputChange}
              className={styles.formInput}
              disabled
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Update Profile
          </button>
        </form>
      )}
      <h2>Change Password</h2>
      {!showChangePasswordForm ? (
        <button
          className={styles.changePasswordButton}
          onClick={() => setShowChangePasswordForm(true)}
        >
          Change Password
        </button>
      ) : (
        <PasswordForm mode="change" onSubmit={handleChangePassword} />
      )}
    </div>
  );
};

export default Profile;