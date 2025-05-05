import React from 'react';
import { Task } from '../types/tasks';
import styles from '../styles/TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onDelete: (_id: string) => void;
  onUpdate: (task: Task) => void;
  onMarkComplete: (_id: string) => void; // New prop for marking tasks as complete
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDelete, onUpdate, onMarkComplete }) => {
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
              {/* Show "Mark as Complete" button only if the task is not already completed */}
              {task.status !== 'completed' && (
                <button onClick={() => onMarkComplete(task._id)}>Mark as Complete</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;

// Usage example (this part is not in the component file, just an illustration)
// <TaskList
//   tasks={tasks}
//   onDelete={() => {}}
//   onUpdate={() => {}}
//   onMarkComplete={handleMarkComplete}
// />