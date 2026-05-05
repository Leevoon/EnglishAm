// Common list-query helpers (pagination + react-admin range/filter parsing).
// react-admin's simple-rest sends ?range=[0,9]&sort=["id","DESC"]&filter={"q":"foo"}
// — we accept both that style and ?page=&limit= for the public API.

function parseListParams(query) {
  const out = { where: {}, order: ['id', 'DESC'], limit: 25, offset: 0 };

  if (query.range) {
    try {
      const r = JSON.parse(query.range);
      if (Array.isArray(r) && r.length === 2) {
        out.offset = parseInt(r[0], 10) || 0;
        out.limit = parseInt(r[1], 10) - parseInt(r[0], 10) + 1;
      }
    } catch (e) { /* ignore */ }
  } else if (query.page || query.limit) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(query.limit || '12', 10)));
    out.limit = limit;
    out.offset = (page - 1) * limit;
  }

  if (query.sort) {
    try {
      const s = JSON.parse(query.sort);
      if (Array.isArray(s) && s.length === 2) out.order = s;
    } catch (e) { /* ignore */ }
  } else if (query.sort_field) {
    out.order = [query.sort_field, query.sort_dir || 'ASC'];
  }

  if (query.filter) {
    try {
      const f = JSON.parse(query.filter);
      Object.assign(out.where, f);
    } catch (e) { /* ignore */ }
  }

  return out;
}

function setContentRange(res, resource, offset, count, total) {
  res.set('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count');
  res.set('X-Total-Count', String(total));
  res.set('Content-Range', `${resource} ${offset}-${offset + count - 1}/${total}`);
}

module.exports = { parseListParams, setContentRange };
