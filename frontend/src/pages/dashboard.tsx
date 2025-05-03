import { useEffect, useState } from 'react';
import { Task } from '../types';
import { fetchTasks } from '../utils/api';
import TaskList from '../components/TaskList';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Add these handlers
  const handleDelete = (_id: string) => {
    // Implement delete logic here (e.g., call API, update state)
    setTasks(tasks.filter(task => task._id !== _id));
  };

  const handleUpdate = (task: Task) => {
    // Implement update logic here (e.g., open edit modal)
    // For now, just log the task
    console.log('Update task:', task);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed');

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Overdue Tasks</h2>
      <TaskList tasks={overdueTasks} onDelete={handleDelete} onUpdate={handleUpdate} />
      <h2>Your Tasks</h2>
      <TaskList tasks={tasks} onDelete={handleDelete} onUpdate={handleUpdate} />
    </div>
  );
};

export default Dashboard;