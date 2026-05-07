import Project from '../models/Project.js';
import Task from '../models/Task.js';

const visibleTaskFilter = async (user) => {
  if (user.role === 'admin') return {};
  const projects = await Project.find({ members: user._id }).select('_id');
  return {
    $or: [
      { assignedTo: user._id },
      { project: { $in: projects.map((project) => project._id) } }
    ]
  };
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, project, assignedTo } = req.body;
    const existingProject = await Project.findById(project);

    if (!existingProject) {
      res.status(404);
      throw new Error('Project not found');
    }

    if (!existingProject.members.map(String).includes(assignedTo)) {
      existingProject.members.push(assignedTo);
      await existingProject.save();
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignedTo,
      createdBy: req.user._id
    });

    res.status(201).json(await task.populate('project assignedTo createdBy', 'name email role title'));
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const filter = await visibleTaskFilter(req.user);
    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .populate('assignedTo createdBy', 'name email role')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const canEdit =
      req.user.role === 'admin' || task.assignedTo.toString() === req.user._id.toString();

    if (!canEdit) {
      res.status(403);
      throw new Error('You can only update tasks assigned to you');
    }

    const editableFields =
      req.user.role === 'admin'
        ? ['title', 'description', 'status', 'priority', 'dueDate', 'project', 'assignedTo']
        : ['status'];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    const updated = await task.save();
    res.json(await updated.populate('project assignedTo createdBy', 'name email role title'));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    next(error);
  }
};

export const getTaskStats = async (req, res, next) => {
  try {
    const filter = await visibleTaskFilter(req.user);
    const tasks = await Task.find(filter);
    const now = new Date();

    res.json({
      total: tasks.length,
      completed: tasks.filter((task) => task.status === 'completed').length,
      pending: tasks.filter((task) => task.status !== 'completed').length,
      overdue: tasks.filter((task) => task.status !== 'completed' && task.dueDate < now).length
    });
  } catch (error) {
    next(error);
  }
};
