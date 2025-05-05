import { useEffect, useState } from 'react';
import { fetchTasks } from '../../utils/api';
import { Task } from '../../types/tasks';
import TaskList from '../../components/TaskList';
import Sidebar from '../../components/Sidebar';
import styles from '../../styles/completed.module.css'; // Import the CSS module

const CompletedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      const allTasks = await fetchTasks();
      setTasks(allTasks.filter((task: Task) => task.status === 'completed'));
      setLoading(false);
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
          onDelete={(_id) => {}}
          onUpdate={(task) => {}}
          onMarkComplete={(_id) => {}}
        />
      </main>
    </div>
  );
};

export default CompletedTasks;