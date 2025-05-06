import { useEffect, useState } from 'react';
import { fetchTasks } from '../../utils/api';
import { Task } from '../../types/tasks';
import TaskList from '../../components/TaskList';
import Sidebar from '../../components/Sidebar';
import { getCurrentUserId } from '../../utils/auth'; // <-- ADD THIS
import styles from '../../styles/completed.module.css';

const CompletedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const userId = getCurrentUserId(); // <-- GET CURRENT USER ID
        if (!userId) {
          console.error('No user is logged in.');
          setLoading(false);
          return;
        }

        // Fetch only tasks assigned to the current user
        const userTasks = await fetchTasks({ assignedTo: userId });
        // Filter by "completed" status
        const completedTasks = userTasks.filter((task: Task) => task.status === 'completed');

        setTasks(completedTasks);
      } catch (err) {
        console.error('Failed to fetch completed tasks', err);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.completedTasksContainer}>
      <Sidebar />
      <main className={styles.completedTasksMain}>
        <h1>Completed Tasks</h1>
        <TaskList
          tasks={tasks}
          onDelete={() => {}}
          onUpdate={() => {}}
          onMarkComplete={() => {}}
        />
      </main>
    </div>
  );
};

export default CompletedTasks;