const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const authProvider = {
  // Called when the user attempts to log in
  login: async ({ username, password }) => {
    const request = new Request(`${API_URL}/admin/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email: username, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const response = await fetch(request);
    
    if (response.status < 200 || response.status >= 300) {
      const error = await response.json();
      throw new Error(error.message || 'Invalid credentials');
    }

    const { token, admin } = await response.json();
    
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(admin));
    localStorage.setItem('adminPermissions', JSON.stringify(admin.permissions || []));
    
    return Promise.resolve();
  },

  // Called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminPermissions');
    return Promise.resolve();
  },

  // Called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminPermissions');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem('adminToken')
      ? Promise.resolve()
      : Promise.reject();
  },

  // Called when the user navigates to a new location, to check for permissions
  getPermissions: () => {
    const permissions = localStorage.getItem('adminPermissions');
    return permissions ? Promise.resolve(JSON.parse(permissions)) : Promise.resolve([]);
  },

  // Get the current user identity
  getIdentity: () => {
    try {
      const adminUser = localStorage.getItem('adminUser');
      if (adminUser) {
        const { id, name, email, avatar } = JSON.parse(adminUser);
        return Promise.resolve({
          id,
          fullName: name || email,
          avatar: avatar || undefined,
        });
      }
      return Promise.reject();
    } catch (error) {
      return Promise.reject(error);
    }
  },
};

export default authProvider;

