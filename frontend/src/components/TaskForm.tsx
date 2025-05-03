import React, { useState } from 'react';
import styles from '../styles/TaskForm.module.css';

interface Task {
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
}

interface TaskFormProps {
    onSubmit: (task: Task) => void;
    initialTask?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialTask }) => {
    const [title, setTitle] = useState(initialTask ? initialTask.title : '');
    const [description, setDescription] = useState(initialTask ? initialTask.description : '');
    const [dueDate, setDueDate] = useState(initialTask ? initialTask.dueDate : '');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialTask ? initialTask.priority : 'medium');
    const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>(initialTask ? initialTask.status : 'pending');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const taskData: Task = { title, description, dueDate, priority, status };
        onSubmit(taskData);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('medium');
        setStatus('pending');
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Due Date:</label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Priority:</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div>
                <label>Status:</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as 'pending' | 'in-progress' | 'completed')}>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <button type="submit">Save Task</button>
        </form>
    );
};

export default TaskForm;