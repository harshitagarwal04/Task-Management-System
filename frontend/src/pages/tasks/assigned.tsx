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
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');

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

  // Filter tasks by search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesDueDate = dueDateFilter ? task.dueDate.slice(0, 10) === dueDateFilter : true;
    return matchesSearch && matchesStatus && matchesPriority && matchesDueDate;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.assignedTasksContainer}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <main className={styles.assignedTasksMain}>
        <h1>Assigned Tasks</h1>
        {/* Filter Section */}
        <div className={styles.filterSection}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={dueDateFilter}
            onChange={e => setDueDateFilter(e.target.value)}
            className={styles.filterSelect}
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchBar}
          />
          <button
            className={styles.addTaskButton}
            onClick={() => setShowAddModal(true)}
          >
            + Add Task
          </button>
        </div>
        <TaskList
          tasks={filteredTasks}
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