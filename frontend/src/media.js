// Legacy media URL conventions.
//
// Confirmed patterns:
//   toefl_*  → https://english.am/vendor/img/toefl_reading/<file>   (snake_case kept whole)
//   ielts_*  → https://english.am/vendor/img/ielts/reading/<file>   (underscore replaced by /)
//
// Other tables default to snake_case-as-folder.

const ORIGIN = 'https://english.am/vendor/img';

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
