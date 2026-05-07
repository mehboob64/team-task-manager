import { CalendarDays } from 'lucide-react';
import { formatDate, isOverdue } from '../utils/formatDate';

const statusClasses = {
  todo: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-amber-100 text-amber-800',
  completed: 'bg-emerald-100 text-emerald-800'
};

const TaskCard = ({ task, onStatusChange, canEdit }) => {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <article className="panel p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{task.description || 'No description'}</p>
        </div>
        <span className={`rounded-md px-2 py-1 text-xs font-bold ${statusClasses[task.status]}`}>
          {task.status}
        </span>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>Project: {task.project?.name || 'Unassigned'}</p>
        <p>Assignee: {task.assignedTo?.name || 'Unknown'}</p>
        <p className="flex items-center gap-2">
          <CalendarDays size={16} />
          {formatDate(task.dueDate)}
        </p>
        <p className={overdue ? 'font-semibold text-rose-600' : 'text-slate-600'}>
          {overdue ? 'Overdue' : `Priority: ${task.priority}`}
        </p>
      </div>
      {canEdit && (
        <select
          className="form-field mt-4"
          value={task.status}
          onChange={(event) => onStatusChange(task._id, event.target.value)}
        >
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      )}
    </article>
  );
};

export default TaskCard;
