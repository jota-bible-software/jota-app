'use strict';

// src/bible/books.ts
var chapterCounts = [
  50,
  40,
  27,
  36,
  34,
  24,
  21,
  4,
  31,
  24,
  22,
  25,
  29,
  36,
  10,
  13,
  10,
  42,
  150,
  31,
  12,
  8,
  66,
  52,
  5,
  48,
  12,
  14,
  3,
  9,
  1,
  4,
  7,
  3,
  3,
  3,
  2,
  14,
  3,
  28,
  16,
  24,
  21,
  28,
  16,
  16,
  13,
  6,
  6,
  4,
  4,
  5,
  3,
  6,
  4,
  3,
  1,
  13,
  5,
  5,
  3,
  5,
  1,
  1,
  1,
  22
];

// src/audio/audio-manager.ts
function getGlobalChapterIndex(passage) {
  const [bookIndex, chapterIndex] = passage;
  const previousChapters = chapterCounts.slice(0, bookIndex).reduce((acc, cur) => acc + cur, 0);
  return previousChapters + chapterIndex;
}
function getTotalChapterCount() {
  return chapterCounts.reduce((acc, cur) => acc + cur, 0);
}
function getAudioSource(passage, provider) {
  if (!passage) return "";
  const chapterIndex = getGlobalChapterIndex(passage);
  return provider.baseUrl + provider.getFileName(chapterIndex);
}

exports.getAudioSource = getAudioSource;
exports.getGlobalChapterIndex = getGlobalChapterIndex;
exports.getTotalChapterCount = getTotalChapterCount;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map