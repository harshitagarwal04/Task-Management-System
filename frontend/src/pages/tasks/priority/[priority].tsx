import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchTasks, updateTask } from '../../../utils/api';
import { Task } from '../../../types/tasks';
import TaskList from '../../../components/TaskList';
import Sidebar from '../../../components/Sidebar';
import { getCurrentUserId } from '../../../utils/auth';

const TasksByPriority = () => {
  const router = useRouter();
  const { priority } = router.query;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        if (typeof priority !== 'string') return;

        const userId = getCurrentUserId();
        if (!userId) {
          console.error('No user is logged in.');
          setLoading(false);
          return;
        }
        const allUserTasks = await fetchTasks({ assignedTo: userId });
        // Filter by priority AND exclude completed tasks
        const filteredByPriority = allUserTasks.filter(
          (task: Task) => task.priority === priority && task.status !== 'completed'
        );

        setTasks(filteredByPriority);
      } catch (err) {
        console.error('Failed to load tasks by priority:', err);
      } finally {
        setLoading(false);
      }
    };

    if (priority) loadTasks();
  }, [priority]);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: '200px', padding: '2rem', width: '100%' }}>
        <h1>Tasks with Priority: {priority}</h1>
        <TaskList
          tasks={tasks}
          onDelete={() => {}}
          onUpdate={() => {}}
          onMarkComplete={handleMarkComplete}
        />
      </main>
    </div>
  );
};

export default TasksByPriority;