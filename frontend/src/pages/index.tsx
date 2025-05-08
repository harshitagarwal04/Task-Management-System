import React from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.homeTitle}>Welcome to the Task Management System</h1>
      <p className={styles.homeSubtitle}>Manage your tasks efficiently and collaborate with your team.</p>
      <div className={styles.homeButtonGroup}>
        <button 
          className={styles.homeButton} 
          onClick={() => router.push('/login')} 
          style={{ marginRight: '1rem' }}
        >
          Login
        </button>
        <button 
          className={styles.homeButton} 
          onClick={() => router.push('/register')}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;