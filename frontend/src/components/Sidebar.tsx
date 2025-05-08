import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Sidebar.module.css'; // Import the CSS module

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
    <nav className={styles.sidebar}>
      <a href="/profile" className={styles.profileLink}>
        Profile
      </a>
      <a href="/dashboard" className={`${styles.dashboardLink}`}>
        Dashboard
      </a>
      <a href="/tasks/completed" className={`${styles.completedTasksLink}`}>
        Completed Tasks
      </a>
      <a href="/tasks/assigned" className={`${styles.assignedTasksLink}`}>
        Tasks Assigned
      </a>
      <div>
        <button
          onClick={() => setShowPriority(!showPriority)}
          className={styles.priorityButton}
        >
          Tasks by Priority ▼
        </button>
        {showPriority && (
          <div className={styles.priorityDropdown}>
            <div onClick={() => handlePriorityClick('low')}>Low</div>
            <div onClick={() => handlePriorityClick('medium')}>Medium</div>
            <div onClick={() => handlePriorityClick('high')}>High</div>
          </div>
        )}
      </div>
      <button onClick={handleSignOut} className={styles.signOutButton}>
        Sign Out
      </button>
    </nav>
  );
};

export default Sidebar;