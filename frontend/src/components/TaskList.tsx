import React from 'react';
import { Task } from '../types/tasks';
import styles from '../styles/TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onDelete: (_id: string) => void;
  onUpdate: (task: Task) => void;
  onMarkComplete: (_id: string) => void; // New prop for marking tasks as complete
  showDeleteButton?: boolean; // Optional prop to show/hide Delete button
  showEditButton?: boolean; // Optional prop to show/hide Edit button
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onUpdate,
  onMarkComplete,
  showDeleteButton = true, // Default to true
  showEditButton = true, // Default to true
}) => {
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
              <button onClick={() => onMarkComplete(task._id)}>Mark as Complete</button>
              {showEditButton && <button onClick={() => onUpdate(task)}>Edit</button>}
              {showDeleteButton && <button onClick={() => onDelete(task._id)}>Delete</button>}
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