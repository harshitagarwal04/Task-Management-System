import { useEffect, useState } from 'react';
import { fetchTasks, deleteTask, updateTask, fetchUsers } from '../../utils/api';
import { Task } from '../../types/tasks';
import TaskList from '../../components/TaskList';
import Sidebar from '../../components/Sidebar';
import { getCurrentUserId } from '../../utils/auth';
import styles from '../../styles/AssignedTasks.module.css';

const AssignedTasks = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getCurrentUserId();
    setUserId(id);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const loadTasks = async () => {
      try {
        const allTasks = await fetchTasks({ createdBy: userId });
        setTasks(allTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [userId]);

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
    <div className={styles.assignedTasksContainer}>
      <Sidebar />
      <main className={styles.assignedTasksMain}>
        <h1>Assigned Tasks</h1>
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

export default AssignedTasks;