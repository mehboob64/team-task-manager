import Project from '../models/Project.js';
import Task from '../models/Task.js';

const userProjectFilter = (user) =>
  user.role === 'admin' ? {} : { members: user._id };

export const createProject = async (req, res, next) => {
  try {
    const { name, description, members = [] } = req.body;
    const uniqueMembers = [...new Set([req.user._id.toString(), ...members])];

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members: uniqueMembers
    });

    const populated = await project.populate('owner members', 'name email role');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find(userProjectFilter(req.user))
      .populate('owner members', 'name email role')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      ...userProjectFilter(req.user)
    }).populate('owner members', 'name email role');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo createdBy', 'name email role')
      .sort({ dueDate: 1 });

    res.json({ project, tasks });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    project.name = req.body.name ?? project.name;
    project.description = req.body.description ?? project.description;
    project.members = req.body.members ?? project.members;

    const updated = await project.save();
    res.json(await updated.populate('owner members', 'name email role'));
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();
    res.json({ message: 'Project and related tasks deleted' });
  } catch (error) {
    next(error);
  }
};
