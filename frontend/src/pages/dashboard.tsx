import { useEffect, useState } from 'react';
import { Task } from '../types/tasks';
import { fetchTasks, createTask, fetchUsers } from '../utils/api';
import TaskList from '../components/TaskList';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [users, setUsers] = useState<{ _id: string; username: string }[]>([]);

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

    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (err) {
        // handle error
      }
    };

    loadTasks();
    loadUsers();
  }, []);

  const handleDelete = (_id: string) => {
    setTasks(tasks.filter(task => task._id !== _id));
  };

  const handleUpdate = (task: Task) => {
    console.log('Update task:', task);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed');

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: '200px', padding: '2rem', width: '100%' }}>
        <h1>Dashboard</h1>
        <button
          style={{
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            marginBottom: '1rem',
            cursor: 'pointer'
          }}
          onClick={() => setShowModal(true)}
        >
          + Add Task
        </button>
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '8px',
              minWidth: '350px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <h2>Add Task</h2>
              <TaskForm
                users={users}
                onSubmit={async (task) => {
                  try {
                    await createTask(task);
                    const fetchedTasks = await fetchTasks();
                    setTasks(fetchedTasks);
                    setShowModal(false);
                  } catch (err) {
                    alert('Failed to add task.');
                  }
                }}
              />
              <button
                style={{ marginTop: '1rem' }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <h2>Overdue Tasks</h2>
        <TaskList tasks={overdueTasks} onDelete={handleDelete} onUpdate={handleUpdate} />
        <h2>Your Tasks</h2>
        <TaskList tasks={tasks} onDelete={handleDelete} onUpdate={handleUpdate} />
      </main>
    </div>
  );
};

export default Dashboard;