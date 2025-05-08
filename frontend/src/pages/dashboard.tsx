import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import { Task } from '../types/tasks';
import { fetchTasks, updateTask } from '../utils/api';
import { getCurrentUserId } from '../utils/auth'; 
import TaskForm from '../components/TaskForm';
import styles from '../styles/dashboard.module.css';

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');

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

  const now = new Date();
  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== 'completed' &&
      new Date(task.dueDate) < now &&
      (task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter ? task.status === statusFilter : true) &&
      (priorityFilter ? task.priority === priorityFilter : true) &&
      (dueDateFilter ? task.dueDate.slice(0, 10) === dueDateFilter : true)
  );

  // Filter non-overdue tasks and by search/filters
  const nonOverdueTasks = tasks.filter(
    (task) =>
      !(task.status !== 'completed' && new Date(task.dueDate) < now) &&
      (task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())) &&
      (statusFilter ? task.status === statusFilter : true) &&
      (priorityFilter ? task.priority === priorityFilter : true) &&
      (dueDateFilter ? task.dueDate.slice(0, 10) === dueDateFilter : true)
  );

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <main className={styles.mainContent}>
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

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search tasks by title or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.searchBar}
        />

        {/* Overdue Tasks Section */}
        {overdueTasks.length > 0 && (
          <section className={styles.overdueSection}>
            <h2 className={styles.overdueTitle}>Overdue Tasks</h2>
            <ul className={styles.overdueTasksList}>
              {overdueTasks.map(task => (
                <li key={task._id} className={styles.overdueTaskCard}>
                  <h3>{task.title}</h3>
                  <p className={styles['task-description']}>{task.description}</p>
                  <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
                  <p>Priority: {task.priority}</p>
                  <p>Status: {task.status}</p>
                  <div className={styles['task-footer']}>
                    <button onClick={() => handleMarkComplete(task._id)}>
                      Mark as Complete
                    </button>
                    <button onClick={() => handleUpdate(task)}>
                      {/* Pen icon */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <path d="M11.013 1.427a1.45 1.45 0 012.05 2.05l-.97.97-2.05-2.05.97-.97zM1 11.488l7.116-7.116 2.05 2.05L3.05 13.538H1v-2.05z" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        <TaskList
          tasks={nonOverdueTasks}
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