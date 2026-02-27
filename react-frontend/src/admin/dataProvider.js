import { fetchUtils } from 'react-admin';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const ADMIN_API_URL = `${API_URL}/admin`;

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' });
  }
  
  const token = localStorage.getItem('adminToken');
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`);
  }
  
  return fetchUtils.fetchJson(url, options);
};

const dataProvider = {
  // Get a list of records
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    
    const query = {
      page,
      perPage,
      sortField: field,
      sortOrder: order,
      filter: JSON.stringify(params.filter),
    };
    
    const queryString = Object.keys(query)
      .map(key => `${key}=${encodeURIComponent(query[key])}`)
      .join('&');
    
    const url = `${ADMIN_API_URL}/${resource}?${queryString}`;
    const { json } = await httpClient(url);
    
    return {
      data: json.data,
      total: json.total,
    };
  },

  // Get a single record by id
  getOne: async (resource, params) => {
    const url = `${ADMIN_API_URL}/${resource}/${params.id}`;
    const { json } = await httpClient(url);
    
    return { data: json };
  },

  // Get multiple records by ids
  getMany: async (resource, params) => {
    const query = {
      ids: JSON.stringify(params.ids),
    };
    
    const queryString = Object.keys(query)
      .map(key => `${key}=${encodeURIComponent(query[key])}`)
      .join('&');
    
    const url = `${ADMIN_API_URL}/${resource}?${queryString}`;
    const { json } = await httpClient(url);
    
    return { data: json.data || json };
  },

  // Get records referenced by another record
  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    
    const query = {
      page,
      perPage,
      sortField: field,
      sortOrder: order,
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    
    const queryString = Object.keys(query)
      .map(key => `${key}=${encodeURIComponent(query[key])}`)
      .join('&');
    
    const url = `${ADMIN_API_URL}/${resource}?${queryString}`;
    const { json } = await httpClient(url);
    
    return {
      data: json.data,
      total: json.total,
    };
  },

  // Create a record
  create: async (resource, params) => {
    const url = `${ADMIN_API_URL}/${resource}`;
    const { json } = await httpClient(url, {
      method: 'POST',
      body: JSON.stringify(params.data),
    });
    
    return { data: { ...params.data, id: json.id } };
  },

  // Update a record
  update: async (resource, params) => {
    const url = `${ADMIN_API_URL}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    });
    
    return { data: json };
  },

  // Update multiple records
  updateMany: async (resource, params) => {
    const promises = params.ids.map(id =>
      httpClient(`${ADMIN_API_URL}/${resource}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      })
    );
    
    await Promise.all(promises);
    
    return { data: params.ids };
  },

  // Delete a record
  delete: async (resource, params) => {
    const url = `${ADMIN_API_URL}/${resource}/${params.id}`;
    const { json } = await httpClient(url, {
      method: 'DELETE',
    });
    
    return { data: json };
  },

  // Delete multiple records
  deleteMany: async (resource, params) => {
    const promises = params.ids.map(id =>
      httpClient(`${ADMIN_API_URL}/${resource}/${id}`, {
        method: 'DELETE',
      })
    );
    
    await Promise.all(promises);
    
    return { data: params.ids };
  },
};

export default dataProvider;

