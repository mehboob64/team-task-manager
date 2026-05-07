import api from './api';

export const getTasks = async () => {
  const { data } = await api.get('/tasks');
  return data;
};

export const getTaskStats = async () => {
  const { data } = await api.get('/tasks/stats');
  return data;
};

export const createTask = async (payload) => {
  const { data } = await api.post('/tasks', payload);
  return data;
};

export const updateTask = async (id, payload) => {
  const { data } = await api.patch(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await api.delete(`/tasks/${id}`);
  return data;
};
