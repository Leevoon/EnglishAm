// Custom data provider matching our /api/admin/:resource endpoints.
// Returns Content-Range from the backend so react-admin paginates correctly.

import api from '../services/api';

const provider = {
  getList: async (resource, params) => {
    const { page = 1, perPage = 25 } = params.pagination || {};
    const { field = 'id', order = 'DESC' } = params.sort || {};
    const range = [(page - 1) * perPage, page * perPage - 1];
    const filter = params.filter || {};
    const { data, headers } = await api.get(`/admin/${resource}`, {
      params: {
        range: JSON.stringify(range),
        sort: JSON.stringify([field, order]),
        filter: JSON.stringify(filter),
      },
    });
    const totalHeader = headers['content-range'];
    let total = data.length;
    if (totalHeader) {
      const m = String(totalHeader).match(/\/(\d+)$/);
      if (m) total = parseInt(m[1], 10);
    } else if (headers['x-total-count']) {
      total = parseInt(headers['x-total-count'], 10);
    }
    return { data, total };
  },

  getOne: async (resource, params) => {
    const { data } = await api.get(`/admin/${resource}/${params.id}`);
    return { data };
  },

  getMany: async (resource, params) => {
    const items = await Promise.all(params.ids.map((id) => api.get(`/admin/${resource}/${id}`).then((r) => r.data).catch(() => null)));
    return { data: items.filter(Boolean) };
  },

  getManyReference: async (resource, params) => {
    const { page = 1, perPage = 25 } = params.pagination || {};
    const { field = 'id', order = 'DESC' } = params.sort || {};
    const range = [(page - 1) * perPage, page * perPage - 1];
    const filter = { ...(params.filter || {}), [params.target]: params.id };
    const { data, headers } = await api.get(`/admin/${resource}`, {
      params: { range: JSON.stringify(range), sort: JSON.stringify([field, order]), filter: JSON.stringify(filter) },
    });
    let total = data.length;
    const totalHeader = headers['content-range'];
    if (totalHeader) {
      const m = String(totalHeader).match(/\/(\d+)$/);
      if (m) total = parseInt(m[1], 10);
    }
    return { data, total };
  },

  create: async (resource, params) => {
    const { data } = await api.post(`/admin/${resource}`, params.data);
    return { data };
  },

  update: async (resource, params) => {
    const { data } = await api.put(`/admin/${resource}/${params.id}`, params.data);
    return { data };
  },

  updateMany: async (resource, params) => {
    await Promise.all(params.ids.map((id) => api.put(`/admin/${resource}/${id}`, params.data)));
    return { data: params.ids };
  },

  delete: async (resource, params) => {
    await api.delete(`/admin/${resource}/${params.id}`);
    return { data: params.previousData || { id: params.id } };
  },

  deleteMany: async (resource, params) => {
    await Promise.all(params.ids.map((id) => api.delete(`/admin/${resource}/${id}`)));
    return { data: params.ids };
  },
};

export default provider;
