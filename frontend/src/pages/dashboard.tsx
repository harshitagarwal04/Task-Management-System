import { useEffect, useState } from 'react';
import { Task } from '../types/tasks';
import { fetchTasks, updateTask } from '../utils/api';
import { getCurrentUserId } from '../utils/auth'; // Make sure this utility is imported
import TaskList from '../components/TaskList';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        // Get the current user's ID and pass it to fetchTasks
        const currentUserId = getCurrentUserId();
        if (!currentUserId) {
          console.error('No user is logged in.');
          setLoading(false);
          return;
        }
        // Fetch tasks assigned to the current user
        const fetchedTasks = await fetchTasks({ assignedTo: currentUserId });
        setTasks(fetchedTasks.filter((task: Task) => task.status !== 'completed'));
      } catch (err) {
        console.error('Failed to load tasks', err);
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
    } catch {
      alert('Failed to mark task as complete.');
    }
  };

  const handleUpdate = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleEditTask = async (updatedTask: Partial<Task>) => {
    try {
      if (editingTask) {
        const taskWithUpdatedStatus = {
          ...editingTask,
          status: updatedTask.status ?? editingTask.status,
        };
        await updateTask(editingTask._id, taskWithUpdatedStatus);
        setTasks(tasks.map(task => (task._id === editingTask._id ? taskWithUpdatedStatus : task)));
        setShowEditModal(false);
        setEditingTask(null);
      }
    } catch {
      alert('Failed to update task.');
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
          onUpdate={handleUpdate}
          onMarkComplete={handleMarkComplete}
          showDeleteButton={false}
          showEditButton={true}
        />
        {showEditModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Edit Task Status</h2>
              <TaskForm
                users={[]}
                initialTask={editingTask || undefined}
                onSubmit={handleEditTask}
                disableFields={[
                  'title',
                  'description',
                  'dueDate',
                  'priority',
                  'assignedTo',
                ]}
              />
              <button
                className={styles.modalCancelButton}
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;