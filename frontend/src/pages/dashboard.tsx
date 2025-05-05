import { useEffect, useState } from 'react';
import { Task } from '../types/tasks';
import { fetchTasks, updateTask } from '../utils/api';
import TaskList from '../components/TaskList';
import Sidebar from '../components/Sidebar';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks.filter((task: Task) => task.status !== 'completed'));
      } catch (err) {
        console.error('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleMarkComplete = async (_id: string) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === _id);
      if (!taskToUpdate) return;

      await updateTask(_id, { ...taskToUpdate, status: 'completed' });
      setTasks(tasks.map(task => (task._id === _id ? { ...task, status: 'completed' } : task)));
    } catch (err) {
      alert('Failed to mark task as complete.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <main className={styles.mainContent}>
        <h1>Dashboard</h1>
        <TaskList
          tasks={tasks}
          onDelete={() => {}}
          onUpdate={() => {}}
          onMarkComplete={handleMarkComplete}
        />
      </main>
    </div>
  );
};

export default Dashboard;