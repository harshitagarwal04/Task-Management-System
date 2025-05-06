import React, { useState } from 'react';
import styles from '../styles/TaskForm.module.css';

interface User {
  _id: string;
  username: string;
}

interface Task {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
}

interface TaskFormProps {
  onSubmit: (task: Partial<Task>) => void;
  initialTask?: Task;
  users: User[];
  disableFields?: string[]; // Array of field names to disable
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialTask, users, disableFields = [] }) => {
  const [title, setTitle] = useState(initialTask ? initialTask.title : '');
  const [description, setDescription] = useState(initialTask ? initialTask.description : '');
  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate
      ? initialTask.dueDate.slice(0, 10) // Converts "2024-05-06T00:00:00.000Z" to "2024-05-06"
      : ''
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    initialTask ? initialTask.priority : 'medium'
  );
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>(
    initialTask ? initialTask.status : 'pending'
  );
  const [assignedTo, setAssignedTo] = useState(initialTask?.assignedTo || (users[0]?._id ?? ''));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const taskData: Partial<Task> = { title, description, dueDate, priority, status, assignedTo };
    onSubmit(taskData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={disableFields.includes('title')} // Disable if specified
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={disableFields.includes('description')} // Disable if specified
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="dueDate">Due Date:</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={disableFields.includes('dueDate')} // Disable if specified
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="priority">Priority:</label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          disabled={disableFields.includes('priority')} // Disable if specified
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')}
          disabled={disableFields.includes('status')} // Disable if specified
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="assignedTo">Assign To:</label>
        <select
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          disabled={disableFields.includes('assignedTo')} // Disable if specified
          required
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className={styles.submitButton}>
        Save Task
      </button>
    </form>
  );
};

export default TaskForm;