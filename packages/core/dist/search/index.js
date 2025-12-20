import { Parser, plPL, enUS } from 'jota-parser';
export { Parser, enUS, plPL } from 'jota-parser';

// src/search/parser.ts

// src/bible/books.ts
var osisBooks = [
  "Gen",
  "Exod",
  "Lev",
  "Num",
  "Deut",
  "Josh",
  "Judg",
  "Ruth",
  "1Sam",
  "2Sam",
  "1Kgs",
  "2Kgs",
  "1Chr",
  "2Chr",
  "Ezra",
  "Neh",
  "Esth",
  "Job",
  "Ps",
  "Prov",
  "Eccl",
  "Song",
  "Isa",
  "Jer",
  "Lam",
  "Ezek",
  "Dan",
  "Hos",
  "Joel",
  "Amos",
  "Obad",
  "Jonah",
  "Mic",
  "Nah",
  "Hab",
  "Zeph",
  "Hag",
  "Zech",
  "Mal",
  "Matt",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Rom",
  "1Cor",
  "2Cor",
  "Gal",
  "Eph",
  "Phil",
  "Col",
  "1Thess",
  "2Thess",
  "1Tim",
  "2Tim",
  "Titus",
  "Phlm",
  "Heb",
  "Jas",
  "1Pet",
  "2Pet",
  "1John",
  "2John",
  "3John",
  "Jude",
  "Rev",
  // Apocrypha
  "Jdt",
  "Tob",
  "1Macc",
  "2Macc",
  "Wis",
  "Sir",
  "Bar"
];

// src/search/parser.ts
var defaultParser = new Parser({ locales: [plPL, enUS] });
function parseReferences(input, parser = defaultParser) {
  return parser.parse(input).map((v) => {
    const b = v[0];
    const c = v[1] - 1;
    const s = v[2] ? v[2] - 1 : void 0;
    const e = v[3] ? v[3] - 1 : s;
    return [b, c, s, e];
  });
}
function osisToPassage(osis) {
  const match = [...osis.matchAll(/(\w+)\.(\d+)\.?(\d+)?/g)][0] || [null, osis];
  return [osisBooks.indexOf(match[1]), parseInt(match[2]) - 1, parseInt(match[3]) - 1];
}
function createParser(options) {
  return new Parser(options);
}

// src/bible/translation-utils.ts
function isArrayFormat(content) {
  return Array.isArray(content);
}
function isMapFormat(content) {
  return !Array.isArray(content) && typeof content === "object" && content !== null;
}
function getVerse(content, bookIndex, chapterIndex, verseIndex) {
  if (isArrayFormat(content)) {
    return content[bookIndex]?.[chapterIndex]?.[verseIndex];
  } else if (isMapFormat(content)) {
    const bookNumber = bookIndex + 1;
    const chapterNumber = chapterIndex + 1;
    const verseNumber = verseIndex + 1;
    return content[bookNumber]?.[chapterNumber]?.[verseNumber];
  }
  return void 0;
}
function getBookCount(content) {
  if (isArrayFormat(content)) {
    return content.length;
  } else if (isMapFormat(content)) {
    return Object.keys(content).length;
  }
  return 0;
}
function getChapterCount(content, bookIndex) {
  if (isArrayFormat(content)) {
    return content[bookIndex]?.length || 0;
  } else if (isMapFormat(content)) {
    const bookNumber = bookIndex + 1;
    const book = content[bookNumber];
    return book ? Object.keys(book).length : 0;
  }
  return 0;
}
function getVerseCount(content, bookIndex, chapterIndex) {
  if (isArrayFormat(content)) {
    return content[bookIndex]?.[chapterIndex]?.length || 0;
  } else if (isMapFormat(content)) {
    const bookNumber = bookIndex + 1;
    const chapterNumber = chapterIndex + 1;
    const chapter = content[bookNumber]?.[chapterNumber];
    return chapter ? Object.keys(chapter).length : 0;
  }
  return 0;
}

// src/search/engine.ts
async function search(bible, text, options, progress) {
  text = text.replace(/[\u202d\u202c]/gm, "");
  if (text.startsWith("/")) {
    const end = text.lastIndexOf("/");
    const flags = end === text.length - 1 ? "gi" : text.substring(end + 1, text.length);
    let regex2;
    let error;
    try {
      regex2 = new RegExp(`(${text.substring(1, end)})`, flags);
    } catch (ex) {
      error = ex;
      throw Error(`Invalid regular expression RegExp(${text.substring(1, end)}, ${flags})${error ? ", " + error : ""}`);
    }
    return searchContent(regex2, bible, progress);
  }
  options.apocrypha = options.apocrypha === void 0 ? getBookCount(bible) > 66 : options.apocrypha;
  const fragments = parseReferences(text);
  if (fragments.length) return fragments;
  let regex;
  if (options.words) {
    const notWord = "[^a-zA-Z\u0105\u0107\u0119\u0142\u0144\xF3\u015B\u017A\u017C\u0104\u0118\u0141\u0143\xD3\u015A\u0179\u017B]";
    regex = new RegExp(`(^|${notWord})(${text.trim()})($|${notWord})`, "i");
  } else {
    regex = new RegExp(`(${text})`, "i");
  }
  return searchContent(regex, bible, progress);
}
async function searchContent(regex, bible, progress) {
  const found = [];
  const bookCount = getBookCount(bible);
  await Promise.all(
    Array.from(
      { length: bookCount },
      (_, bi) => new Promise(
        (resolve) => setTimeout(() => {
          const chapterCount = getChapterCount(bible, bi);
          for (let ci = 0; ci < chapterCount; ci++) {
            const verseCount = getVerseCount(bible, bi, ci);
            for (let vi = 0; vi < verseCount; vi++) {
              const verse = getVerse(bible, bi, ci, vi);
              if (verse && regex.test(verse)) {
                const fragment = [bi, ci, vi, vi];
                Object.preventExtensions(fragment);
                Object.freeze(fragment);
                found.push(fragment);
              }
            }
          }
          progress.step(bi + 1);
          resolve();
        }, 100)
      )
    )
  );
  progress.regex = regex;
  Object.preventExtensions(found);
  Object.freeze(found);
  return found;
}
function ensureGlobalRegex(regex) {
  return regex ? regex.flags.includes("g") ? regex : new RegExp(regex.source, regex.flags + "g") : "";
}
function sortAndDeduplicate(fragments) {
  fragments.sort(
    (a, b) => a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : a[2] != null && b[2] != null ? a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0 : 0
  );
  if (fragments.length < 2) {
    return fragments;
  }
  let prev = fragments[0];
  const result = [prev];
  for (let i = 1; i < fragments.length; i++) {
    const curr = fragments[i];
    if (!(prev[0] === curr[0] && prev[1] === curr[1] && (prev[2] === curr[2] || prev[2] == null && curr[2] == null))) {
      result.push(curr);
    }
    prev = curr;
  }
  return result;
}

// src/search/reference-resolver.ts
function resolveOsisToPassages(translationContent, osis, shouldSort = false) {
  if (!osis) return [];
  const fragments = [];
  osis.split(",").forEach((it) => {
    const [it1, it2] = it.split("-");
    const from = it1;
    let to = it2;
    const a = osisToPassage(from);
    if (isNaN(a[1])) {
      a[1] = 0;
      to = to || true;
    }
    if (to) {
      const b = to === true ? [a[0], getChapterCount(translationContent, a[0]) - 1] : osisToPassage(to);
      if (a[0] !== b[0] || a[1] !== b[1]) {
        a[2] = a[2] || 0;
        if (a[2] === 0) {
          a.splice(2, 1);
          fragments.push(a);
        } else {
          push(a, getVerseCount(translationContent, a[0], a[1]) - 1);
        }
        if (a[0] < b[0]) {
          addChapters(a[0], a[1] + 1, getChapterCount(translationContent, a[0]));
        } else {
          addChapters(a[0], a[1] + 1, b[1]);
        }
        if (a[0] + 1 < b[0]) {
          for (let bi = a[0] + 1; bi < b[0]; bi++) {
            addChapters(bi, 0, getChapterCount(translationContent, bi));
          }
        }
        if (a[0] < b[0]) {
          addChapters(b[0], 0, isNaN(b[1]) ? getChapterCount(translationContent, b[0]) : b[1]);
        }
        if (!isNaN(b[1])) {
          if (isNaN(b[2]) || b[2] === getVerseCount(translationContent, b[0], b[1]) - 1) {
            fragments.push([b[0], b[1]]);
          } else {
            fragments.push([b[0], b[1], 0, b[2]]);
          }
        }
      } else {
        push(a, b[2]);
      }
    } else {
      push(a, a[2]);
    }
  });
  return shouldSort ? sortPassages(fragments) : fragments;
  function addChapters(bi, ci, len) {
    for (; ci < len; ci++) {
      fragments.push([bi, ci]);
    }
  }
  function push(tokens, end) {
    tokens.push(end);
    fragments.push(tokens);
  }
}
function sortPassages(fragments) {
  fragments.sort(
    (a, b) => a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : a[2] != null && b[2] != null ? a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0 : 0
  );
  return fragments;
}

export { createParser, ensureGlobalRegex, osisToPassage, parseReferences, resolveOsisToPassages, search, searchContent, sortAndDeduplicate };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map