import React, { useState } from 'react';
import { useRouter } from 'next/router';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const [showPriority, setShowPriority] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handlePriorityClick = (priority: string) => {
    router.push(`/tasks/priority/${priority}`);
  };

  return (
    <nav style={{
      width: '175px',
      height: '100vh',
      background: '#0070f3',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <a 
        href="/profile" 
        style={{ 
          color: '#fff',
          marginTop: '2rem', 
          marginBottom: '6rem', 
          textDecoration: 'none', 
          fontWeight: 600, 
          fontSize: '1.5rem'
        }}>
        Profile
      </a>
      <a
        href="/dashboard"
        style={{
          color: '#fff',
          marginBottom: '1rem',
          textDecoration: 'none',
          marginTop: '4rem',
          display: 'block'
        }}
      >
        Dashboard
      </a>
      <a 
        href="/tasks/completed" 
        style={{ color: '#fff', marginBottom: '1rem', textDecoration: 'none' }}>
        Completed Tasks
      </a>
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowPriority(!showPriority)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            textAlign: 'left',
            padding: 0,
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Tasks by Priority ▼
        </button>
        {showPriority && (
          <div style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
            <div
              style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
              onClick={() => handlePriorityClick('low')}
            >
              Low
            </div>
            <div
              style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
              onClick={() => handlePriorityClick('medium')}
            >
              Medium
            </div>
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => handlePriorityClick('high')}
            >
              High
            </div>
          </div>
        )}
      </div>
      <button
        onClick={handleSignOut}
        style={{
          marginTop: 'auto',
          marginBottom: 'auto',
          background: '#fff',
          color: '#0070f3',
          border: 'none',
          borderRadius: '4px',
          padding: '0.5rem 1rem',
          cursor: 'pointer'
        }}
      >
        Sign Out
      </button>
    </nav>
  );
};

export default Sidebar;