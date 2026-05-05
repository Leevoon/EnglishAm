import api from '../services/api';

const authProvider = {
  login: async ({ username, password }) => {
    try {
      const { data } = await api.post('/auth/admin/login', { email: username, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
    } catch (err) {
      const msg = (err.response && err.response.data && err.response.data.error) || 'Invalid credentials';
      throw new Error(msg);
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
  },

  checkError: async (error) => {
    const status = error && error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      throw new Error('Session expired');
    }
  },

  checkAuth: async () => {
    if (!localStorage.getItem('token') || !localStorage.getItem('admin')) {
      throw new Error('Not authenticated');
    }
  },

  getPermissions: async () => {
    try {
      const admin = JSON.parse(localStorage.getItem('admin') || 'null');
      return admin ? admin.group_id : null;
    } catch (e) { return null; }
  },

  getIdentity: async () => {
    const admin = JSON.parse(localStorage.getItem('admin') || 'null');
    if (!admin) throw new Error('No admin');
    return { id: admin.id, fullName: admin.name || admin.email, avatar: admin.avatar };
  },
};

export default authProvider;
