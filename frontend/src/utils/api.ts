import axios from 'axios';

const API_BASE_URL = 'http://localhost:5050/api';

interface UserData {
    username: string;
    email: string;
    password: string;
}

interface Credentials {
    username?: string;
    email?: string;
    password: string;
}

interface TaskData {
    title: string;
    description: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    assignedTo?: string;
    createdBy?: string;
}

export const registerUser = async (userData: UserData) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
};

export const loginUser = async (credentials: Credentials) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
};

export const createTask = async (taskData: TaskData) => {
    const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
    return response.data;
};

export const getTasks = async () => {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
};

export const updateTask = async (taskId: string, taskData: TaskData) => {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData);
    return response.data;
};

export const deleteTask = async (taskId: string) => {
    const response = await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
};

export async function fetchTasks() {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}