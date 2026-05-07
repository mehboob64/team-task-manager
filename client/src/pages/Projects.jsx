import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import { createProject, getProjects } from '../services/projectService';
import { getUsers } from '../services/userService';

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', members: [] });
  const [error, setError] = useState('');

  const load = async () => {
    const [projectData, userData] = await Promise.all([getProjects(), getUsers()]);
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
      await createProject(form);
      setForm({ name: '', description: '', members: [] });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create project');
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
      {isAdmin && (
        <form className="panel p-5" onSubmit={handleCreate}>
          <h2 className="text-lg font-bold text-slate-900">New project</h2>
          {error && <p className="mt-3 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Project name
            <input className="form-field mt-1" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Description
            <textarea className="form-field mt-1 min-h-24" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </label>
          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Members
            <select className="form-field mt-1 min-h-32" multiple value={form.members} onChange={(event) => setForm({ ...form, members: [...event.target.selectedOptions].map((option) => option.value) })}>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
              ))}
            </select>
          </label>
          <button className="btn-primary mt-5 w-full" type="submit">Create project</button>
        </form>
      )}
      <div>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
          <p className="text-sm text-slate-500">Open a project to view related tasks.</p>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {projects.map((project) => <ProjectCard key={project._id} project={project} />)}
        </div>
      </div>
    </section>
  );
};

export default Projects;
