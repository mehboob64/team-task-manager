import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { getProjects } from '../services/projectService';
import { createTask, getTasks, updateTask } from '../services/taskService';
import { getUsers } from '../services/userService';

const Tasks = () => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    project: '',
    assignedTo: ''
  });

  const load = async () => {
    const [taskData, projectData, userData] = await Promise.all([getTasks(), getProjects(), getUsers()]);
    setTasks(taskData);
    setProjects(projectData);
    setUsers(userData);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await createTask(form);
      setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', project: '', assignedTo: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task');
    }
  };

  const handleStatusChange = async (id, status) => {
    await updateTask(id, { status });
    load();
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
      {isAdmin && (
        <form className="panel p-5" onSubmit={handleCreate}>
          <h2 className="text-lg font-bold text-slate-900">Assign task</h2>
          {error && <p className="mt-3 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Title
            <input className="form-field mt-1" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Description
            <textarea className="form-field mt-1 min-h-20" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Project
              <select className="form-field mt-1" value={form.project} onChange={(event) => setForm({ ...form, project: event.target.value })} required>
                <option value="">Select</option>
                {projects.map((project) => <option key={project._id} value={project._id}>{project.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Assignee
              <select className="form-field mt-1" value={form.assignedTo} onChange={(event) => setForm({ ...form, assignedTo: event.target.value })} required>
                <option value="">Select</option>
                {users.map((teamUser) => <option key={teamUser._id} value={teamUser._id}>{teamUser.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Due date
              <input className="form-field mt-1" type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} required />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Priority
              <select className="form-field mt-1" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <button className="btn-primary mt-5 w-full" type="submit">Create task</button>
        </form>
      )}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
          <p className="text-sm text-slate-500">Members can update status on assigned tasks.</p>
        </div>
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

export default Tasks;
