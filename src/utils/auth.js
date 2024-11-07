import axios from 'axios';

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const register = async (userData) => {
  const response = await axios.post('/api/register', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post('/api/login', userData);
  return response.data;
};

export const deleteUser = async (token) => {
  const response = await axios.delete('/api/user', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getUserInfo = async (token) => {
  const response = await axios.get('/api/user-info', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const addToCart = async (items) => {
  const token = getToken();
  const response = await axios.post('/api/cart', { items }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getCart = async () => {
  const token = getToken();
  const response = await axios.get('/api/cart', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const clearCart = async () => {
  const token = getToken();
  const response = await axios.delete('/api/cart', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};