import { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { getTaskStats, getTasks, updateTask } from '../services/taskService';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [tasks, setTasks] = useState([]);

  const load = async () => {
    const [statsData, tasksData] = await Promise.all([getTaskStats(), getTasks()]);
    setStats(statsData);
    setTasks(tasksData.slice(0, 5));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateTask(id, { status });
    load();
  };

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500">Hello {user?.name}, here is the current delivery picture.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard label="Total tasks" value={stats.total} />
        <DashboardCard label="Completed" value={stats.completed} tone="green" />
        <DashboardCard label="Pending" value={stats.pending} tone="amber" />
        <DashboardCard label="Overdue" value={stats.overdue} tone="red" />
      </div>
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-bold text-slate-900">Upcoming tasks</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              canEdit={isAdmin || task.assignedTo?._id === user?.id}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
