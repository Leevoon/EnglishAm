// Generic repository: same API for mock arrays and Sequelize queries.
// Controllers call repo.find / repo.findOne / repo.create / repo.update / repo.remove.

const config = require('../config');
const mock = require('../data/mock');
const { getSequelize } = require('../config/db');

function clone(o) { return JSON.parse(JSON.stringify(o)); }

function applyWhere(rows, where) {
  if (!where) return rows;
  return rows.filter((row) => {
    for (const k of Object.keys(where)) {
      const v = where[k];
      if (Array.isArray(v)) {
        if (!v.includes(row[k])) return false;
      } else if (v && typeof v === 'object' && '$ne' in v) {
        if (row[k] === v.$ne) return false;
      } else {
        if (row[k] !== v) return false;
      }
    }
    return true;
  });
}

function applyOrder(rows, order) {
  if (!order || !order.length) return rows;
  const [field, dir] = order;
  const sign = String(dir || 'ASC').toUpperCase() === 'DESC' ? -1 : 1;
  return [...rows].sort((a, b) => {
    if (a[field] < b[field]) return -1 * sign;
    if (a[field] > b[field]) return 1 * sign;
    return 0;
  });
}

function applyRange(rows, limit, offset) {
  const start = offset || 0;
  const end = limit != null ? start + limit : undefined;
  return rows.slice(start, end);
}

async function find(table, opts = {}) {
  if (config.useMock) {
    let rows = mock[table] ? clone(mock[table]) : [];
    rows = applyWhere(rows, opts.where);
    rows = applyOrder(rows, opts.order);
    const total = rows.length;
    rows = applyRange(rows, opts.limit, opts.offset);
    return { rows, total };
  }
  const seq = getSequelize();
  const where = opts.where || {};
  const replacements = {};
  const conds = [];
  Object.keys(where).forEach((k, i) => {
    const v = where[k];
    if (Array.isArray(v)) {
      conds.push(`\`${k}\` IN (:p${i})`);
      replacements[`p${i}`] = v;
    } else {
      conds.push(`\`${k}\` = :p${i}`);
      replacements[`p${i}`] = v;
    }
  });
  const whereSql = conds.length ? `WHERE ${conds.join(' AND ')}` : '';
  const orderSql = opts.order ? `ORDER BY \`${opts.order[0]}\` ${opts.order[1] || 'ASC'}` : '';
  const limitSql = opts.limit != null ? `LIMIT ${parseInt(opts.limit, 10)}` : '';
  const offsetSql = opts.offset ? `OFFSET ${parseInt(opts.offset, 10)}` : '';
  const sql = `SELECT * FROM \`${table}\` ${whereSql} ${orderSql} ${limitSql} ${offsetSql}`;
  const [rows] = await seq.query(sql, { replacements });
  const [countRows] = await seq.query(
    `SELECT COUNT(*) AS c FROM \`${table}\` ${whereSql}`,
    { replacements },
  );
  const total = countRows[0] ? Number(countRows[0].c) : 0;
  return { rows, total };
}

async function findOne(table, where) {
  const { rows } = await find(table, { where, limit: 1 });
  return rows[0] || null;
}

async function findById(table, id) {
  return findOne(table, { id });
}

async function create(table, payload) {
  if (config.useMock) {
    mock[table] = mock[table] || [];
    const nextId = mock[table].reduce((m, r) => Math.max(m, r.id || 0), 0) + 1;
    const row = { id: nextId, ...payload };
    mock[table].push(row);
    return clone(row);
  }
  const seq = getSequelize();
  const cols = Object.keys(payload);
  const placeholders = cols.map((_, i) => `:p${i}`);
  const replacements = {};
  cols.forEach((c, i) => { replacements[`p${i}`] = payload[c]; });
  const sql = `INSERT INTO \`${table}\` (${cols.map((c) => `\`${c}\``).join(',')}) VALUES (${placeholders.join(',')})`;
  const [result] = await seq.query(sql, { replacements });
  const id = result && result.insertId ? result.insertId : null;
  return id ? findById(table, id) : { ...payload };
}

async function update(table, id, payload) {
  if (config.useMock) {
    const arr = mock[table] || [];
    const idx = arr.findIndex((r) => r.id === Number(id) || r.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...payload };
    return clone(arr[idx]);
  }
  const seq = getSequelize();
  const cols = Object.keys(payload);
  if (!cols.length) return findById(table, id);
  const sets = cols.map((c, i) => `\`${c}\` = :p${i}`);
  const replacements = { id };
  cols.forEach((c, i) => { replacements[`p${i}`] = payload[c]; });
  await seq.query(`UPDATE \`${table}\` SET ${sets.join(',')} WHERE \`id\` = :id`, { replacements });
  return findById(table, id);
}

async function remove(table, id) {
  if (config.useMock) {
    const arr = mock[table] || [];
    const idx = arr.findIndex((r) => r.id === Number(id) || r.id === id);
    if (idx === -1) return false;
    arr.splice(idx, 1);
    return true;
  }
  const seq = getSequelize();
  const [result] = await seq.query(`DELETE FROM \`${table}\` WHERE \`id\` = :id`, { replacements: { id } });
  return result && result.affectedRows > 0;
}

async function rawQuery(sql, replacements = {}) {
  if (config.useMock) throw new Error('rawQuery not supported in mock mode');
  const seq = getSequelize();
  const [rows] = await seq.query(sql, { replacements });
  return rows;
}

module.exports = { find, findOne, findById, create, update, remove, rawQuery };
