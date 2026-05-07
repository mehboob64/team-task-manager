import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { getProject } from '../services/projectService';
import { updateTask } from '../services/taskService';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const load = async () => {
    const data = await getProject(id);
    setProject(data.project);
    setTasks(data.tasks);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleStatusChange = async (taskId, status) => {
    await updateTask(taskId, { status });
    load();
  };

  if (!project) return null;

  return (
    <section>
      <Link className="text-sm font-semibold text-brand" to="/projects">Back to projects</Link>
      <div className="mt-4 panel p-5">
        <h2 className="text-2xl font-bold text-slate-900">{project.name}</h2>
        <p className="mt-2 text-slate-600">{project.description || 'No description'}</p>
        <p className="mt-4 text-sm text-slate-500">{project.members?.length || 0} members assigned</p>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            canEdit={isAdmin || task.assignedTo?._id === user?.id}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectDetails;
