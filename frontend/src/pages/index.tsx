import React from 'react';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
  const router = useRouter();

  return (
    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <h1>Welcome to the Task Management System</h1>
      <p>Manage your tasks efficiently and collaborate with your team.</p>
      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => router.push('/login')} style={{ marginRight: '1rem' }}>
          Login
        </button>
        <button onClick={() => router.push('/register')}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;