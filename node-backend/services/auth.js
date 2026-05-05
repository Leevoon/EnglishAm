// Token + password helpers built on Node's crypto (no extra deps).
// Tokens are HMAC-SHA256 signed JSON payloads, base64url encoded — JWT-shaped
// without the library, so the frontend can decode them like any JWT.

const crypto = require('crypto');
const config = require('../config');

function b64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function b64urlDecode(str) {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return Buffer.from(str, 'base64').toString('utf8');
}

function md5(s) {
  return crypto.createHash('md5').update(String(s)).digest('hex');
}

function verifyPassword(plain, stored) {
  if (!stored) return false;
  // Legacy md5 hashes (32 hex chars) — match the existing schema.
  if (/^[a-f0-9]{32}$/i.test(stored)) return md5(plain) === stored.toLowerCase();
  return false;
}

function hashPassword(plain) {
  return md5(plain);
}

function signToken(payload, expiresInSec = config.jwtExpiresInSec) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { iat: now, exp: now + expiresInSec, ...payload };
  const headB = b64url(JSON.stringify(header));
  const bodyB = b64url(JSON.stringify(body));
  const sig = b64url(
    crypto.createHmac('sha256', config.jwtSecret).update(`${headB}.${bodyB}`).digest()
  );
  return `${headB}.${bodyB}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, b, s] = parts;
  const expected = b64url(
    crypto.createHmac('sha256', config.jwtSecret).update(`${h}.${b}`).digest()
  );
  if (expected !== s) return null;
  let body;
  try { body = JSON.parse(b64urlDecode(b)); } catch (e) { return null; }
  if (body.exp && body.exp < Math.floor(Date.now() / 1000)) return null;
  return body;
}

module.exports = { md5, hashPassword, verifyPassword, signToken, verifyToken };
