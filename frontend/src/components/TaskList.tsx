import React from 'react';
import { Task } from '../types/tasks';
import styles from '../styles/TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  onDelete: (_id: string) => void;
  onUpdate: (task: Task) => void;
  onMarkComplete: (_id: string) => void;
  showDeleteButton?: boolean;
  showEditButton?: boolean;
  showCompleteButton?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onUpdate,
  onMarkComplete,
  showDeleteButton = true,
  showEditButton = true,
  showCompleteButton = true,
}) => {
  const handleDeleteConfirmation = (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (confirmed) {
      onDelete(id);
    }
  };

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

              {/* Scrollable description */}
              <p className={styles['task-description']}>{task.description}</p>

              {/* Other fields (date, priority, etc.) */}
              <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {task.status}</p>

              {/* Footer for buttons */}
              <div className={styles['task-footer']}>
                {showCompleteButton && (
                  <button onClick={() => onMarkComplete(task._id)}>Mark as Complete</button>
                )}
                {showEditButton && (
                  <button onClick={() => onUpdate(task)}>
                    {/* Pen icon */}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11.013 1.427a1.45 1.45 0 012.05 2.05l-.97.97-2.05-2.05.97-.97zM1 11.488l7.116-7.116 2.05 2.05L3.05 13.538H1v-2.05z" />
                    </svg>
                  </button>
                )}
                {showDeleteButton && (
                  <button onClick={() => handleDeleteConfirmation(task._id)}>Delete</button>
                )}
              </div>
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