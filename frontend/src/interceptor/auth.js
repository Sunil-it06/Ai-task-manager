import client from './client';

export const registerRequest = (payload) =>
  client.post('/auth/register', payload).then((res) => res.data);

export const loginRequest = (payload) =>
  client.post('/auth/login', payload).then((res) => res.data);