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

    // Handle raw array responses (endpoints without server-side pagination)
    if (Array.isArray(json)) {
      let data = [...json];

      // Client-side filtering
      const filter = params.filter || {};
      if (Object.keys(filter).length > 0) {
        data = data.filter(item => {
          return Object.entries(filter).every(([key, value]) => {
            if (value === '' || value === null || value === undefined) return true;
            if (key === 'q') {
              const searchStr = String(value).toLowerCase();
              return Object.values(item).some(v =>
                String(v).toLowerCase().includes(searchStr)
              );
            }
            return String(item[key]) === String(value);
          });
        });
      }

      // Client-side sorting
      data.sort((a, b) => {
        const aVal = a[field] ?? '';
        const bVal = b[field] ?? '';
        if (aVal < bVal) return order === 'ASC' ? -1 : 1;
        if (aVal > bVal) return order === 'ASC' ? 1 : -1;
        return 0;
      });

      const total = data.length;
      const start = (page - 1) * perPage;
      const paginatedData = data.slice(start, start + perPage);

      return { data: paginatedData, total };
    }

    // Handle wrapped responses {data, total}
    return {
      data: json.data || [],
      total: json.total != null ? json.total : (json.data ? json.data.length : 0),
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
      filter: JSON.stringify({ ids: JSON.stringify(params.ids) }),
    };

    const queryString = Object.keys(query)
      .map(key => `${key}=${encodeURIComponent(query[key])}`)
      .join('&');

    const url = `${ADMIN_API_URL}/${resource}?${queryString}`;
    const { json } = await httpClient(url);

    if (Array.isArray(json)) {
      return { data: json.filter(item => params.ids.map(String).includes(String(item.id))) };
    }
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

    // Handle raw array responses
    if (Array.isArray(json)) {
      const targetFilter = { ...params.filter, [params.target]: params.id };
      let data = json.filter(item => {
        return Object.entries(targetFilter).every(([key, value]) => {
          if (value === '' || value === null || value === undefined) return true;
          return String(item[key]) === String(value);
        });
      });

      data.sort((a, b) => {
        const aVal = a[field] ?? '';
        const bVal = b[field] ?? '';
        if (aVal < bVal) return order === 'ASC' ? -1 : 1;
        if (aVal > bVal) return order === 'ASC' ? 1 : -1;
        return 0;
      });

      const total = data.length;
      const start = (page - 1) * perPage;
      return { data: data.slice(start, start + perPage), total };
    }

    return {
      data: json.data || [],
      total: json.total != null ? json.total : (json.data ? json.data.length : 0),
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
