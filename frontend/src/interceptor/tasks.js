import client from './client';

export const listTasks = () => client.get('/tasks').then((res) => res.data.tasks);

export const getTask = (id) => client.get(`/tasks/${id}`).then((res) => res.data.task);

export const createTask = (payload) =>
  client.post('/tasks', payload).then((res) => res.data.task);

export const runTask = (id) => client.post(`/tasks/${id}/run`).then((res) => res.data.task);