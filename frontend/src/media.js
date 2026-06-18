// Legacy media URL conventions.
//
// Origin is set via VITE_MEDIA_BASE_URL at build time. Default keeps the
// legacy CDN host so dev shows real images out of the box.
//
// Confirmed patterns:
//   toefl_*  → <origin>/toefl_reading/<file>   (snake_case kept whole)
//   ielts_*  → <origin>/ielts/reading/<file>   (underscore replaced by /)
// Other tables default to snake_case-as-folder.

const ORIGIN = (
  import.meta.env.VITE_MEDIA_BASE_URL || 'https://english.am/vendor/img'
).replace(/\/$/, '');

function folderForTable(table) {
  if (table.startsWith('ielts_')) return table.replace(/_/g, '/');
  return table;
}

export function mediaUrl(table, filename) {
  if (!filename) return null;
  const folder = folderForTable(table);
  return `${ORIGIN}/${folder}/${filename}`;
}

const IMAGE_RE = /(?:^|_)image(?:_|$)/i;
const AUDIO_RE = /(?:^|_)audio(?:_|$)/i;

export function isImageField(name) { return IMAGE_RE.test(name); }
export function isAudioField(name) { return AUDIO_RE.test(name); }
