// Helpers for the *_label pattern: pick the row matching the requested
// language, fall back to default language, then to any available row.

const config = require('../config');
const repo = require('./repo');

async function pickLabel(table, fkField, fkValue, languageId) {
  const wanted = parseInt(languageId, 10) || config.defaultLanguageId;
  const { rows } = await repo.find(table, { where: { [fkField]: fkValue } });
  if (!rows.length) return null;
  return (
    rows.find((r) => r.language_id === wanted) ||
    rows.find((r) => r.language_id === config.defaultLanguageId) ||
    rows[0]
  );
}

async function attachLabel(items, opts) {
  const { table, fkField, languageId, mapTo } = opts;
  const out = [];
  for (const item of items) {
    const label = await pickLabel(table, fkField, item.id, languageId);
    out.push({ ...item, ...(label ? mapTo(label) : {}) });
  }
  return out;
}

function languageFromReq(req) {
  return parseInt(req.query.lang || req.headers['x-language-id'] || config.defaultLanguageId, 10);
}

module.exports = { pickLabel, attachLabel, languageFromReq };
