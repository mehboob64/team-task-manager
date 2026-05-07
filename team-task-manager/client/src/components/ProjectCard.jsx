import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/projects/${project._id}`} className="panel block p-5 transition hover:border-blue-300">
      <h3 className="font-bold text-slate-900">{project.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
        {project.description || 'No description added'}
      </p>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>{project.members?.length || 0} members</span>
        <span>Owner: {project.owner?.name || 'Admin'}</span>
      </div>
    </Link>
  );
};

export default ProjectCard;
