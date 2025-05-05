import { useEffect, useState } from 'react';
import { fetchTasks, deleteTask, updateTask, fetchUsers, createTask } from '../../utils/api';
import { Task } from '../../types/tasks';
import TaskList from '../../components/TaskList';
import Sidebar from '../../components/Sidebar';
import TaskForm from '../../components/TaskForm';
import { getCurrentUserId } from '../../utils/auth';
import styles from '../../styles/AssignedTasks.module.css';

const AssignedTasks = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<{ _id: string; username: string }[]>([]);
  const [showAddModal, setShowAddModal] = useState(false); // State for Add Task modal
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit Task modal
  const [editingTask, setEditingTask] = useState<Task | null>(null); // Task being edited

  // Fetch the current user's ID
  useEffect(() => {
    const id = getCurrentUserId();
    setUserId(id);
  }, []);

  // Fetch tasks created by the current user
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

  // Fetch all users
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    loadUsers();
  }, []);

  // Handle marking a task as complete
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

  // Handle deleting a task
  const handleDelete = async (_id: string) => {
    try {
      await deleteTask(_id);
      setTasks(tasks.filter(task => task._id !== _id)); // Remove the deleted task from the list
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  // Handle adding a new task
  const handleAddTask = async (newTask: Partial<Task>) => {
    try {
      const createdTask = await createTask(newTask as Task); // Cast to Task for backend
      setTasks([...tasks, createdTask]); // Add the new task to the list
      setShowAddModal(false); // Close the modal
    } catch (err) {
      alert('Failed to add task.');
    }
  };

  // Handle opening the edit modal
  const handleUpdate = (task: Task) => {
    setEditingTask(task); // Set the task to be edited
    setShowEditModal(true); // Open the edit modal
  };

  // Handle editing a task
  const handleEditTask = async (updatedTask: Partial<Task>) => {
    try {
      if (editingTask) {
        const { _id } = editingTask; // Destructure `_id` from `editingTask`
        const taskWithId = { ...editingTask, ...updatedTask, _id }; // Merge to ensure all required fields
        await updateTask(editingTask._id, taskWithId);
        setTasks(tasks.map(task => (task._id === _id ? taskWithId : task))); // Use `_id` directly
        setShowEditModal(false); // Close the modal
        setEditingTask(null); // Clear the editing task
      }
    } catch (err) {
      alert('Failed to update task.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.assignedTasksContainer}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <main className={styles.assignedTasksMain}>
        <h1>Assigned Tasks</h1>
        <button
          className={styles.addTaskButton}
          onClick={() => setShowAddModal(true)} // Open the Add Task modal
        >
          + Add Task
        </button>
        <TaskList
          tasks={tasks}
          onDelete={handleDelete}
          onMarkComplete={handleMarkComplete}
          onUpdate={handleUpdate} // Pass the handleUpdate function to TaskList
        />
        {showAddModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Add Task</h2>
              <TaskForm
                users={users} // Pass the user list to TaskForm
                onSubmit={handleAddTask} // Handle adding a new task
              />
              <button
                className={styles.modalCancelButton}
                onClick={() => setShowAddModal(false)} // Close the modal
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {showEditModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Edit Task</h2>
              <TaskForm
                users={users} // Pass the user list to TaskForm
                initialTask={editingTask || undefined} // Pass the task being edited
                onSubmit={handleEditTask} // Handle editing the task
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

export default AssignedTasks;