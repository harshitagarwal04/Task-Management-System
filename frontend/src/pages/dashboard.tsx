import { useEffect, useState } from 'react';
import { Task } from '../types/tasks';
import { fetchTasks, updateTask } from '../utils/api';
import TaskList from '../components/TaskList';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit Modal
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Task being edited

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

  // Handle opening the edit modal
  const handleUpdate = (task: Task) => {
    setEditingTask(task); // Set the task to be edited
    setShowEditModal(true); // Open the edit modal
  };

  // Handle editing a task (only status can be updated)
  const handleEditTask = async (updatedTask: Partial<Task>) => {
    try {
      if (editingTask) {
        const taskWithUpdatedStatus = { 
          ...editingTask, 
          status: updatedTask.status ?? editingTask.status // Ensure status is never undefined
        }; // Only update status
        await updateTask(editingTask._id, taskWithUpdatedStatus);
        setTasks(tasks.map(task => (task._id === editingTask._id ? taskWithUpdatedStatus : task))); // Update the task in the list
        setShowEditModal(false); // Close the modal
        setEditingTask(null); // Clear the editing task
      }
    } catch (err) {
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
          onDelete={() => {}} // No-op for delete
          onUpdate={handleUpdate} // Enable edit functionality
          onMarkComplete={handleMarkComplete}
          showDeleteButton={false} // Hide Delete button
          showEditButton={true} // Show Edit button
        />
        {showEditModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Edit Task Status</h2>
              <TaskForm
                users={[]} // No user selection needed
                initialTask={editingTask || undefined} // Pass the task being edited
                onSubmit={handleEditTask} // Handle editing the task
                disableFields={['title', 'description', 'dueDate', 'priority', 'assignedTo']} // Disable all fields except status
              />
              <button
                className={styles.modalCancelButton}
                onClick={() => {
                  setShowEditModal(false); // Close the modal
                  setEditingTask(null); // Clear the editing task
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