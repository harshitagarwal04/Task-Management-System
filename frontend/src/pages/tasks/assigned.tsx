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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
      setTasks(tasks.filter(task => task._id !== _id));
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  // Handle adding a new task
  const handleAddTask = async (newTask: Partial<Task>) => {
    try {
      const createdTask = await createTask(newTask as Task);
      setTasks([...tasks, createdTask]);
      setShowAddModal(false);
    } catch (err) {
      alert('Failed to add task.');
    }
  };

  // Handle opening the edit modal
  const handleUpdate = (task: Task) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  // Handle editing a task
  const handleEditTask = async (updatedTask: Partial<Task>) => {
    try {
      if (editingTask) {
        const { _id } = editingTask;
        const taskWithId = { ...editingTask, ...updatedTask, _id };
        await updateTask(editingTask._id, taskWithId);
        setTasks(tasks.map(task => (task._id === _id ? taskWithId : task)));
        setShowEditModal(false);
        setEditingTask(null);
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
          onClick={() => setShowAddModal(true)}
        >
          + Add Task
        </button>
        <TaskList
          tasks={tasks}
          onDelete={handleDelete}
          onMarkComplete={handleMarkComplete}
          onUpdate={handleUpdate}
        />
        {showAddModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h2>Add Task</h2>
              <TaskForm
                users={users}
                onSubmit={handleAddTask}
              />
              <button
                className={styles.modalCancelButton}
                onClick={() => setShowAddModal(false)}
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
                users={users}
                initialTask={editingTask || undefined}
                onSubmit={handleEditTask}
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

export default AssignedTasks;