import React from 'react';
import { Task } from '../types';
import styles from '../styles/TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onDelete: (_id: string) => void;
  onUpdate: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onUpdate }) => {
  return (
    <div className={styles['task-list']}>
      <h2>Task List</h2>
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className={`${styles['task-item']} ${styles[task.status]}`}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {task.status}</p>
              <button onClick={() => onUpdate(task)}>Edit</button>
              <button onClick={() => onDelete(task._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;