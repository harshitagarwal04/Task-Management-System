import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchTasks } from '../../../utils/api';
import { Task } from '../../../types/tasks';
import TaskList from '../../../components/TaskList';
import Sidebar from '../../../components/Sidebar';

const TasksByPriority = () => {
  const router = useRouter();
  const { priority } = router.query;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      if (typeof priority === 'string') {
        const allTasks = await fetchTasks();
        setTasks(allTasks.filter((task: Task) => task.priority === priority));
        setLoading(false);
      }
    };
    if (priority) loadTasks();
  }, [priority]);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: '200px', padding: '2rem', width: '100%' }}>
        <h1>Tasks with Priority: {priority}</h1>
        <TaskList tasks={tasks} onDelete={(_id) => {}} onUpdate={(task) => {}} />
      </main>
    </div>
  );
};

export default TasksByPriority;