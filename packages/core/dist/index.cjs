'use strict';

var jotaParser = require('jota-parser');

// src/bible/translation-utils.ts
function isArrayFormat(content2) {
  return Array.isArray(content2);
}
function isMapFormat(content2) {
  return !Array.isArray(content2) && typeof content2 === "object" && content2 !== null;
}
function getVerse(content2, bookIndex, chapterIndex, verseIndex) {
  if (isArrayFormat(content2)) {
    return content2[bookIndex]?.[chapterIndex]?.[verseIndex];
  } else if (isMapFormat(content2)) {
    const bookNumber = bookIndex + 1;
    const chapterNumber = chapterIndex + 1;
    const verseNumber = verseIndex + 1;
    return content2[bookNumber]?.[chapterNumber]?.[verseNumber];
  }
  return void 0;
}
function getChapter(content2, bookIndex, chapterIndex) {
  if (isArrayFormat(content2)) {
    return content2[bookIndex]?.[chapterIndex];
  } else if (isMapFormat(content2)) {
    const bookNumber = bookIndex + 1;
    const chapterNumber = chapterIndex + 1;
    const chapter2 = content2[bookNumber]?.[chapterNumber];
    if (!chapter2) return void 0;
    const verses2 = [];
    const verseNumbers = Object.keys(chapter2).map(Number).sort((a, b) => a - b);
    for (const verseNum of verseNumbers) {
      verses2[verseNum - 1] = chapter2[verseNum];
    }
    return verses2;
  }
  return void 0;
}
function getBook(content2, bookIndex) {
  if (isArrayFormat(content2)) {
    return content2[bookIndex];
  } else if (isMapFormat(content2)) {
    const bookNumber = bookIndex + 1;
    const book2 = content2[bookNumber];
    if (!book2) return void 0;
    const chapters = [];
    const chapterNumbers = Object.keys(book2).map(Number).sort((a, b) => a - b);
    for (const chapterNum of chapterNumbers) {
      const chapter2 = book2[chapterNum];
      const verses2 = [];
      const verseNumbers = Object.keys(chapter2).map(Number).sort((a, b) => a - b);
      for (const verseNum of verseNumbers) {
        verses2[verseNum - 1] = chapter2[verseNum];
      }
      chapters[chapterNum - 1] = verses2;
    }
    return chapters;
  }
  return void 0;
}
function getBookCount(content2) {
  if (isArrayFormat(content2)) {
    return content2.length;
  } else if (isMapFormat(content2)) {
    return Object.keys(content2).length;
  }
  return 0;
}
function getChapterCount(content2, bookIndex) {
  if (isArrayFormat(content2)) {
    return content2[bookIndex]?.length || 0;
  } else if (isMapFormat(content2)) {
    const bookNumber = bookIndex + 1;
    const book2 = content2[bookNumber];
    return book2 ? Object.keys(book2).length : 0;
  }
  return 0;
}
function getVerseCount(content2, bookIndex, chapterIndex) {
  if (isArrayFormat(content2)) {
    return content2[bookIndex]?.[chapterIndex]?.length || 0;
  } else if (isMapFormat(content2)) {
    const bookNumber = bookIndex + 1;
    const chapterNumber = chapterIndex + 1;
    const chapter2 = content2[bookNumber]?.[chapterNumber];
    return chapter2 ? Object.keys(chapter2).length : 0;
  }
  return 0;
}
function toArrayFormat(content2) {
  if (isArrayFormat(content2)) {
    return content2;
  }
  if (isMapFormat(content2)) {
    const result = [];
    const bookNumbers = Object.keys(content2).map(Number).sort((a, b) => a - b);
    for (const bookNum of bookNumbers) {
      const book2 = content2[bookNum];
      const chapters = [];
      const chapterNumbers = Object.keys(book2).map(Number).sort((a, b) => a - b);
      for (const chapterNum of chapterNumbers) {
        const chapter2 = book2[chapterNum];
        const verses2 = [];
        const verseNumbers = Object.keys(chapter2).map(Number).sort((a, b) => a - b);
        for (const verseNum of verseNumbers) {
          verses2[verseNum - 1] = chapter2[verseNum];
        }
        chapters[chapterNum - 1] = verses2;
      }
      result[bookNum - 1] = chapters;
    }
    return result;
  }
  return [];
}
function toMapFormat(content2) {
  if (isMapFormat(content2)) {
    return content2;
  }
  const result = {};
  if (isArrayFormat(content2)) {
    const arrayContent = content2;
    for (let bookIndex = 0; bookIndex < arrayContent.length; bookIndex++) {
      const book2 = arrayContent[bookIndex];
      const bookNumber = bookIndex + 1;
      result[bookNumber] = {};
      for (let chapterIndex = 0; chapterIndex < book2.length; chapterIndex++) {
        const chapter2 = book2[chapterIndex];
        const chapterNumber = chapterIndex + 1;
        result[bookNumber][chapterNumber] = {};
        for (let verseIndex = 0; verseIndex < chapter2.length; verseIndex++) {
          const verse2 = chapter2[verseIndex];
          const verseNumber = verseIndex + 1;
          result[bookNumber][chapterNumber][verseNumber] = verse2;
        }
      }
    }
  }
  return result;
}

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
var fullEnglishBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
  // Apocrypha
  "Judith",
  "Tobith",
  "1 Maccabees",
  "2 Maccabees",
  "Wisdom",
  "Sirah",
  "Baruch"
];
var fullPolishBooks = [
  "Rodzaju",
  "Wyj\u015Bcia",
  "Kap\u0142a\u0144ska",
  "Liczb",
  "Powt\xF3rzonego Prawa",
  "Jozuego",
  "S\u0119dzi\xF3w",
  "Rut",
  "1 Samuela",
  "2 Samuela",
  "1 Kr\xF3lewska",
  "2 Kr\xF3lewska",
  "1 Kronik",
  "2 Kronik",
  "Ezdrasza",
  "Nehemiasza",
  "Estery",
  "Hioba",
  "Psalmy",
  "Przypowie\u015Bci",
  "Pie\u015B\u0144 nad Pie\u015Bniami",
  "Kaznodziei",
  "Izajasza",
  "Jeremiasza",
  "Lamentacje",
  "Ezechiela",
  "Daniela",
  "Ozeasza",
  "Joela",
  "Amosa",
  "Abdiasza",
  "Jonasza",
  "Micheasza",
  "Nahuma",
  "Habakuka",
  "Sofoniasza",
  "Aggeusza",
  "Zachariasza",
  "Malachiasza",
  "Mateusza",
  "Marka",
  "\u0141ukasza",
  "Jana",
  "Dzieje Apostolskie",
  "List do Rzymian",
  "1 List do Koryntian",
  "2 List do Koryntian",
  "List do Galat\xF3w",
  "List do Efezjan",
  "List do Filipian",
  "List do Kolosan",
  "1 List do Tesaloniczan",
  "2 List do Tesaloniczan",
  "1 List do Tymoteusza",
  "2 List do Tymoteusza",
  "List do Tytusa",
  "List do Filemona",
  "List do Hebrajczyk\xF3w",
  "List Jakuba",
  "1 List Piotra",
  "2 List Piotra",
  "1 List Jana",
  "2 List Jana",
  "3 List Jana",
  "List Judy",
  "Objawienie Jana"
];
var bookAbbreviations = {
  pl: [
    "1 Moj",
    "2 Moj",
    "3 Moj",
    "4 Moj",
    "5 Moj",
    "Joz",
    "Sdz",
    "Rut",
    "1 Sam",
    "2 Sam",
    "1 Krl",
    "2 Krl",
    "1 Krn",
    "2 Krn",
    "Ezd",
    "Ne",
    "Est",
    "Job",
    "Ps",
    "Prz",
    "Kz",
    "Pnp",
    "Iz",
    "Jr",
    "Tr",
    "Ez",
    "Dn",
    "Oz",
    "Jl",
    "Am",
    "Ab",
    "Jon",
    "Mi",
    "Na",
    "Ha",
    "So",
    "Ag",
    "Za",
    "Ml",
    "Mt",
    "Mr",
    "\u0141k",
    "Jn",
    "Dz",
    "Rz",
    "1 Kor",
    "2 Kor",
    "Ga",
    "Ef",
    "Flp",
    "Kol",
    "1 Tes",
    "2 Tes",
    "1 Tm",
    "2 Tm",
    "Tt",
    "Flm",
    "Hbr",
    "Jk",
    "1 Pt",
    "2 Pt",
    "1 Jn",
    "2 Jn",
    "3 Jn",
    "Jud",
    "Obj",
    // Apocrypha
    "Jdt",
    "Tob",
    "1Ma",
    "2Ma",
    "Mdr",
    "Syr",
    "Bar"
  ],
  en: [
    "Gen",
    "Exo",
    "Lev",
    "Num",
    "Deu",
    "Jos",
    "Jdg",
    "Rth",
    "1Sa",
    "2Sa",
    "1Ki",
    "2Ki",
    "1Ch",
    "2Ch",
    "Ezr",
    "Neh",
    "Est",
    "Job",
    "Psa",
    "Pro",
    "Ecc",
    "Son",
    "Isa",
    "Jer",
    "Lam",
    "Eze",
    "Dan",
    "Hos",
    "Joe",
    "Amo",
    "Oba",
    "Jon",
    "Mic",
    "Nah",
    "Hab",
    "Zep",
    "Hag",
    "Zec",
    "Mal",
    "Mat",
    "Mar",
    "Luk",
    "Joh",
    "Act",
    "Rom",
    "1Co",
    "2Co",
    "Gal",
    "Eph",
    "Phi",
    "Col",
    "1Th",
    "2Th",
    "1Ti",
    "2Ti",
    "Tit",
    "Phm",
    "Heb",
    "Jas",
    "1Pe",
    "2Pe",
    "1Jo",
    "2Jo",
    "3Jo",
    "Jud",
    "Rev"
  ]
};
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
var CANONICAL_BOOK_COUNT = 66;
var TOTAL_BOOK_COUNT = osisBooks.length;
function getOsisCode(bookIndex) {
  return osisBooks[bookIndex];
}
function getBookIndexFromOsis(osisCode) {
  return osisBooks.indexOf(osisCode);
}
function getChapterCountForBook(bookIndex) {
  return chapterCounts[bookIndex] || 0;
}
function isApocryphal(bookIndex) {
  return bookIndex >= CANONICAL_BOOK_COUNT;
}
var books = {
  osis: osisBooks,
  fullEnglish: fullEnglishBooks,
  fullPolish: fullPolishBooks,
  bookAbbreviations,
  chapterCount: chapterCounts
};
var defaultParser = new jotaParser.Parser({ locales: [jotaParser.plPL, jotaParser.enUS] });
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
  return new jotaParser.Parser(options);
}

// src/search/engine.ts
async function search(bible, text2, options, progress) {
  text2 = text2.replace(/[\u202d\u202c]/gm, "");
  if (text2.startsWith("/")) {
    const end2 = text2.lastIndexOf("/");
    const flags = end2 === text2.length - 1 ? "gi" : text2.substring(end2 + 1, text2.length);
    let regex2;
    let error;
    try {
      regex2 = new RegExp(`(${text2.substring(1, end2)})`, flags);
    } catch (ex) {
      error = ex;
      throw Error(`Invalid regular expression RegExp(${text2.substring(1, end2)}, ${flags})${error ? ", " + error : ""}`);
    }
    return searchContent(regex2, bible, progress);
  }
  options.apocrypha = options.apocrypha === void 0 ? getBookCount(bible) > 66 : options.apocrypha;
  const fragments = parseReferences(text2);
  if (fragments.length) return fragments;
  let regex;
  if (options.words) {
    const notWord = "[^a-zA-Z\u0105\u0107\u0119\u0142\u0144\xF3\u015B\u017A\u017C\u0104\u0118\u0141\u0143\xD3\u015A\u0179\u017B]";
    regex = new RegExp(`(^|${notWord})(${text2.trim()})($|${notWord})`, "i");
  } else {
    regex = new RegExp(`(${text2})`, "i");
  }
  return searchContent(regex, bible, progress);
}
async function searchContent(regex, bible, progress) {
  const found = [];
  const bookCount = getBookCount(bible);
  await Promise.all(
    Array.from(
      { length: bookCount },
      (_, bi2) => new Promise(
        (resolve) => setTimeout(() => {
          const chapterCount = getChapterCount(bible, bi2);
          for (let ci2 = 0; ci2 < chapterCount; ci2++) {
            const verseCount = getVerseCount(bible, bi2, ci2);
            for (let vi = 0; vi < verseCount; vi++) {
              const verse2 = getVerse(bible, bi2, ci2, vi);
              if (verse2 && regex.test(verse2)) {
                const fragment = [bi2, ci2, vi, vi];
                Object.preventExtensions(fragment);
                Object.freeze(fragment);
                found.push(fragment);
              }
            }
          }
          progress.step(bi2 + 1);
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
function resolveOsisToPassages(translationContent2, osis, shouldSort = false) {
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
      const b = to === true ? [a[0], getChapterCount(translationContent2, a[0]) - 1] : osisToPassage(to);
      if (a[0] !== b[0] || a[1] !== b[1]) {
        a[2] = a[2] || 0;
        if (a[2] === 0) {
          a.splice(2, 1);
          fragments.push(a);
        } else {
          push(a, getVerseCount(translationContent2, a[0], a[1]) - 1);
        }
        if (a[0] < b[0]) {
          addChapters(a[0], a[1] + 1, getChapterCount(translationContent2, a[0]));
        } else {
          addChapters(a[0], a[1] + 1, b[1]);
        }
        if (a[0] + 1 < b[0]) {
          for (let bi2 = a[0] + 1; bi2 < b[0]; bi2++) {
            addChapters(bi2, 0, getChapterCount(translationContent2, bi2));
          }
        }
        if (a[0] < b[0]) {
          addChapters(b[0], 0, isNaN(b[1]) ? getChapterCount(translationContent2, b[0]) : b[1]);
        }
        if (!isNaN(b[1])) {
          if (isNaN(b[2]) || b[2] === getVerseCount(translationContent2, b[0], b[1]) - 1) {
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
  function addChapters(bi2, ci2, len) {
    for (; ci2 < len; ci2++) {
      fragments.push([bi2, ci2]);
    }
  }
  function push(tokens, end2) {
    tokens.push(end2);
    fragments.push(tokens);
  }
}
function sortPassages(fragments) {
  fragments.sort(
    (a, b) => a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : a[2] != null && b[2] != null ? a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0 : 0
  );
  return fragments;
}

// src/format/passage-formatter.ts
function replaceEnterChar(str) {
  return str.replace(/⏎/g, "\n");
}
function formatPassageComposable(template2, passage2, translationContent2, bookNames2, translationAbbreviation) {
  const t = {
    ...template2,
    referenceCharsBefore: replaceEnterChar(template2.referenceCharsBefore),
    referenceCharsAfter: replaceEnterChar(template2.referenceCharsAfter),
    translationAbbreviationCharsBefore: replaceEnterChar(template2.translationAbbreviationCharsBefore),
    translationAbbreviationCharsAfter: replaceEnterChar(template2.translationAbbreviationCharsAfter),
    quoteCharsBefore: replaceEnterChar(template2.quoteCharsBefore),
    quoteCharsAfter: replaceEnterChar(template2.quoteCharsAfter),
    verseNumberCharsBefore: replaceEnterChar(template2.verseNumberCharsBefore),
    verseNumberCharsAfter: replaceEnterChar(template2.verseNumberCharsAfter)
  };
  const [bi2, ci2, si2, ei2] = passage2;
  const chapter2 = ci2 + 1;
  const chapterContent = getChapter(translationContent2, bi2, ci2);
  if (!chapterContent) return void 0;
  const bookName = bookNames2[bi2];
  const start2 = si2 === void 0 ? 1 : si2 + 1;
  const end2 = ei2 === void 0 ? si2 === void 0 ? chapterContent.length : si2 + 1 : ei2 + 1;
  const ending = start2 === end2 ? "" : t.rangeChar + end2;
  const ta = t.translationAbbreviation;
  const ab = ta === "none" ? "" : ta === "lowercase" ? translationAbbreviation.toLowerCase() : translationAbbreviation.toUpperCase();
  const abb = ab ? ` ${t.translationAbbreviationCharsBefore}${ab}${t.translationAbbreviationCharsAfter}` : "";
  const reference = `${t.referenceCharsBefore}${bookName} ${chapter2}${t.separatorChar}${start2}${ending}${abb}${t.referenceCharsAfter}`;
  let text2 = "";
  const includesNumbers2 = t.numbers;
  const includesNewLines2 = t.verseNewLine;
  const oneVerse2 = start2 === end2;
  const verses2 = chapterContent.slice(start2 - 1, end2);
  const numberedVerse = (i, s) => `${t.verseNumberCharsBefore}${start2 + i}${t.verseNumberCharsAfter} ${s}`;
  if (includesNumbers2 && includesNewLines2) {
    text2 = oneVerse2 ? verses2.join(" ") : verses2.map((v, i) => numberedVerse(i, v)).join("\n");
  } else if (includesNewLines2) {
    text2 = oneVerse2 ? verses2.join(" ") : verses2.join("\n");
  } else if (includesNumbers2) {
    text2 = oneVerse2 ? verses2.join(" ") : verses2.map((v, i) => numberedVerse(i, v)).join(" ");
  } else {
    text2 = verses2.join(" ");
  }
  const content2 = `${t.quoteCharsBefore}${text2}${t.quoteCharsAfter}`;
  const separator2 = t.referenceLine === "new line" ? "\n" : " ";
  const referenceFirst = t.referencePosition === "before";
  return { reference, separator: separator2, content: content2, referenceFirst };
}
function formatPassage(template2, passage2, translationContent2, bookNames2, translationAbbreviation) {
  const result = formatPassageComposable(template2, passage2, translationContent2, bookNames2, translationAbbreviation);
  if (!result) return "";
  const { reference, separator: separator2, content: content2, referenceFirst } = result;
  if (template2.referenceWithoutContent) {
    return reference;
  }
  return referenceFirst ? reference + separator2 + content2 : content2 + separator2 + reference;
}
function formatReference(passage2, bookNames2, separator2) {
  const [bookIndex, chapter2, start2, end2] = passage2;
  const book2 = bookNames2[bookIndex];
  if (start2 == null) {
    return `${book2} ${chapter2 + 1}`;
  } else if (end2 == null || start2 === end2) {
    return `${book2} ${chapter2 + 1}${separator2}${start2 + 1}`;
  } else {
    return `${book2} ${chapter2 + 1}${separator2}${start2 + 1}-${end2 + 1}`;
  }
}
function formatChapterCaption(passage2, bookNames2) {
  if (!passage2) return "";
  const [bookIndex, chapter2] = passage2;
  const book2 = bookNames2[bookIndex];
  return `${book2} ${chapter2 + 1}`;
}
function getPassageVerses(bible, passage2) {
  const [bi2, ci2, si2, ei2] = passage2;
  const content2 = getChapter(bible, bi2, ci2);
  if (!content2) return [];
  const start2 = si2 == null ? 1 : si2 + 1;
  const end2 = ei2 == null ? si2 == null ? content2.length : si2 + 1 : ei2 + 1;
  return content2.slice(start2 - 1, end2);
}
function getChapterVerses(bible, passage2) {
  if (!passage2) return [];
  const [book2, chapter2] = passage2;
  const content2 = getChapter(bible, book2, chapter2);
  return content2 || [];
}

// src/format/template-engine.ts
function patternToTemplate(pattern) {
  const { referencePosition, referenceNewLine, separatorChar, quotes, verseNewLine, numbers } = pattern;
  const ref = `\${book} \${chapter}${separatorChar}\${start}-\${end}`;
  let s = `\${text${numbers ? "Numbers" : ""}${verseNewLine ? "NewLines" : ""}}`;
  if (quotes) s = `"${s}"`;
  if (referencePosition === "before") {
    s = `${ref}${referenceNewLine === "new line" ? "\n" : " "}${s}`;
  } else {
    s = `${s}${referenceNewLine === "new line" ? "\n" : " "}${ref}`;
  }
  return s;
}
function formatWithTemplate(translationContent, passage, template, bookNames, separator, translation) {
  const [bi, ci, si, ei] = passage;
  bookNames[bi];
  const content = getChapter(translationContent, bi, ci);
  if (!content) return "";
  const start = si == null ? 1 : si + 1;
  const end = ei == null ? si == null ? content.length : si + 1 : ei + 1;
  const verses = content.slice(start - 1, end);
  if (start === end) template = template.replace("-${end}", "");
  translation ? translation.toUpperCase() : "";
  const includesNumbers = template.includes("Numbers");
  const includesNewLines = template.includes("NewLines");
  const oneVerse = start === end;
  if (includesNumbers && includesNewLines) {
    oneVerse ? verses.join(" ") : "\n" + verses.map((v, i) => `(${start + i}) ${v}`).join("\n");
  } else if (includesNewLines) {
    oneVerse ? verses.join(" ") : "\n" + verses.join("\n");
  } else if (includesNumbers) {
    oneVerse ? verses.join(" ") : verses.map((v, i) => `(${start + i}) ${v}`).join(" ");
  } else {
    verses.join(" ");
  }
  return eval("`" + template + "`");
}

// src/highlight/highlighter.ts
function getPassageKey(passage2) {
  return `${passage2[0]}-${passage2[1]}-${passage2[2]}-${passage2[3]}`;
}
function getOverlappingHighlights(highlights, passage2) {
  const [book2, chapter2, start2, end2] = passage2;
  return highlights.filter((h) => {
    const [hBook, hChapter, hStart, hEnd] = h.passage;
    if (hBook !== book2 || hChapter !== chapter2) return false;
    return !(hEnd < start2 || hStart > end2);
  });
}
function getExactPassageHighlight(highlights, passage2) {
  const [book2, chapter2, start2, end2] = passage2;
  return highlights.find((h) => {
    const [b, c, hStart, hEnd] = h.passage;
    return b === book2 && c === chapter2 && hStart === start2 && hEnd === end2;
  });
}
function getHighlightForVerse(highlights, book2, chapter2, verse2) {
  return highlights.find((h) => {
    const [b, c, start2, end2] = h.passage;
    return b === book2 && c === chapter2 && verse2 >= start2 && verse2 <= end2;
  });
}
function getHighlights(highlights) {
  return highlights;
}
function removeHighlight(highlights, passage2) {
  const key = getPassageKey(passage2);
  return highlights.filter((h) => getPassageKey(h.passage) !== key);
}
function addHighlight(highlights, passage2, colorId) {
  const [book2, chapter2, start2, end2] = passage2;
  const overlapping = getOverlappingHighlights(highlights, passage2);
  const result = highlights.filter(
    (h) => !overlapping.some((o) => getPassageKey(o.passage) === getPassageKey(h.passage))
  );
  const sameColorOverlapping = overlapping.filter((h) => h.highlightColorId === colorId);
  let mergedStart = start2;
  let mergedEnd = end2;
  if (sameColorOverlapping.length > 0) {
    sameColorOverlapping.forEach((h) => {
      const [, , hStart, hEnd] = h.passage;
      mergedStart = Math.min(mergedStart, hStart);
      mergedEnd = Math.max(mergedEnd, hEnd);
    });
  }
  const newHighlight = {
    passage: [book2, chapter2, mergedStart, mergedEnd],
    highlightColorId: colorId
  };
  return [...result, newHighlight];
}
function removeOverlappingAndCreateRemainders(highlights, passage2, activeColorId) {
  const [, , start2, end2] = passage2;
  const overlapping = getOverlappingHighlights(highlights, passage2);
  let result = highlights.filter(
    (h) => !overlapping.some((o) => getPassageKey(o.passage) === getPassageKey(h.passage))
  );
  overlapping.filter((h) => h.highlightColorId === activeColorId).forEach((highlight) => {
    const [hBook, hChapter, hStart, hEnd] = highlight.passage;
    if (hStart < start2) {
      result = addHighlight(result, [hBook, hChapter, hStart, start2 - 1], highlight.highlightColorId);
    }
    if (hEnd > end2) {
      result = addHighlight(result, [hBook, hChapter, end2 + 1, hEnd], highlight.highlightColorId);
    }
  });
  return result;
}
function toggleHighlight(highlights, passage2, activeColorId) {
  const [book2, chapter2, start2, end2] = passage2;
  if (start2 == null || end2 == null) return highlights;
  const overlapping = getOverlappingHighlights(highlights, passage2);
  const sameColorHighlights = overlapping.filter((h) => h.highlightColorId === activeColorId);
  const differentColorHighlights = overlapping.filter((h) => h.highlightColorId !== activeColorId);
  let hasExactMatch = false;
  for (const highlight of sameColorHighlights) {
    const [, , hStart, hEnd] = highlight.passage;
    if (hStart === start2 && hEnd === end2) {
      hasExactMatch = true;
      break;
    }
  }
  if (overlapping.length === 0) {
    return addHighlight(highlights, passage2, activeColorId);
  }
  if (hasExactMatch) {
    return removeOverlappingAndCreateRemainders(highlights, passage2, activeColorId);
  }
  if (start2 === end2 || overlapping.length > 0) {
    let shouldAddHighlight = true;
    let result = highlights.filter(
      (h) => !overlapping.some((o) => getPassageKey(o.passage) === getPassageKey(h.passage))
    );
    sameColorHighlights.forEach((h) => {
      const [hBook, hChapter, hStart, hEnd] = h.passage;
      if (hStart < start2) {
        result = addHighlight(result, [hBook, hChapter, hStart, start2 - 1], activeColorId);
      }
      if (hEnd > end2) {
        result = addHighlight(result, [hBook, hChapter, end2 + 1, hEnd], activeColorId);
      }
      if (start2 === end2 && hStart <= start2 && hEnd >= end2) {
        shouldAddHighlight = false;
      }
    });
    differentColorHighlights.forEach((h) => {
      const [hBook, hChapter, hStart, hEnd] = h.passage;
      if (hStart < start2) {
        result = addHighlight(result, [hBook, hChapter, hStart, start2 - 1], h.highlightColorId);
      }
      if (hEnd > end2) {
        result = addHighlight(result, [hBook, hChapter, end2 + 1, hEnd], h.highlightColorId);
      }
    });
    if (shouldAddHighlight) {
      result = addHighlight(result, passage2, activeColorId);
    }
    return result;
  }
  if (sameColorHighlights.length > 0) {
    let mergedStart = start2;
    let mergedEnd = end2;
    sameColorHighlights.forEach((h) => {
      const [, , hStart, hEnd] = h.passage;
      mergedStart = Math.min(mergedStart, hStart);
      mergedEnd = Math.max(mergedEnd, hEnd);
    });
    let result = highlights.filter(
      (h) => !overlapping.some((o) => getPassageKey(o.passage) === getPassageKey(h.passage))
    );
    result = addHighlight(result, [book2, chapter2, mergedStart, mergedEnd], activeColorId);
    return result;
  }
  return addHighlight(highlights, passage2, activeColorId);
}
function clearAllHighlights(_highlights) {
  return [];
}
function clearColorHighlights(highlights, colorId) {
  return highlights.filter((h) => h.highlightColorId !== colorId);
}
var Highlighter = class {
  constructor(initialHighlights = []) {
    this.highlights = [...initialHighlights];
  }
  addHighlight(passage2, colorId) {
    this.highlights = addHighlight(this.highlights, passage2, colorId);
  }
  removeHighlight(passage2) {
    this.highlights = removeHighlight(this.highlights, passage2);
  }
  toggleHighlight(passage2, activeColorId) {
    this.highlights = toggleHighlight(this.highlights, passage2, activeColorId);
  }
  getHighlightForVerse(book2, chapter2, verse2) {
    return getHighlightForVerse(this.highlights, book2, chapter2, verse2);
  }
  getExactPassageHighlight(passage2) {
    return getExactPassageHighlight(this.highlights, passage2);
  }
  getOverlappingHighlights(passage2) {
    return getOverlappingHighlights(this.highlights, passage2);
  }
  getHighlights() {
    return this.highlights;
  }
  clearColorHighlights(colorId) {
    this.highlights = clearColorHighlights(this.highlights, colorId);
  }
  clearAllHighlights() {
    this.highlights = clearAllHighlights(this.highlights);
  }
};

// src/audio/audio-manager.ts
function getGlobalChapterIndex(passage2) {
  const [bookIndex, chapterIndex] = passage2;
  const previousChapters = chapterCounts.slice(0, bookIndex).reduce((acc, cur) => acc + cur, 0);
  return previousChapters + chapterIndex;
}
function getTotalChapterCount() {
  return chapterCounts.reduce((acc, cur) => acc + cur, 0);
}
function getAudioSource(passage2, provider) {
  if (!passage2) return "";
  const chapterIndex = getGlobalChapterIndex(passage2);
  return provider.baseUrl + provider.getFileName(chapterIndex);
}

// src/plans/reading-plans.ts
function parseReadings(plan) {
  return plan.readings.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
}
function getReadingForDay(plan, dayIndex) {
  const readings = parseReadings(plan);
  return readings[dayIndex];
}
function calculateProgress(currentDay, totalDays) {
  if (totalDays <= 0) return 0;
  return Math.min(100, Math.round(currentDay / totalDays * 100));
}
function getDayNumber(startDate, currentDate = /* @__PURE__ */ new Date()) {
  const diffTime = currentDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

// src/utils/date.ts
function parseDate(dateString) {
  const tokens = dateString.split("-").map((it) => parseInt(it));
  return new Date(tokens[0], tokens[1] - 1, tokens[2]);
}
function formatDate(date) {
  if (!date) date = /* @__PURE__ */ new Date();
  if (date instanceof Date) {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
  } else {
    return date;
  }
}
function daysBetween(from, to) {
  const diffTime = to.getTime() - from.getTime();
  return Math.floor(diffTime / (1e3 * 60 * 60 * 24));
}
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// src/utils/text.ts
function encodeHtml(html) {
  return html.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
function decodeHtml(encoded) {
  return encoded.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
}
function errorMessage(prefix, ex) {
  const message = ex instanceof Error ? ex.message : String(ex);
  return `${prefix} ${message}`;
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function normalizeWhitespace(str) {
  return str.replace(/\s+/g, " ").trim();
}

// src/utils/locale.ts
var Direction = /* @__PURE__ */ ((Direction2) => {
  Direction2[Direction2["Next"] = 1] = "Next";
  Direction2[Direction2["Prev"] = -1] = "Prev";
  return Direction2;
})(Direction || {});
function locale2lang(locale) {
  return locale.split("-")[0];
}
function locale2region(locale) {
  if (!locale) return "";
  const parts = locale.split("-");
  return parts.length > 1 ? parts[1].toLowerCase() : "";
}
function getLang(localeOrLang) {
  return localeOrLang.substring(0, 2);
}
function nameSorter(locale) {
  return (a, b) => a.name.localeCompare(b.name, locale, { sensitivity: "base", ignorePunctuation: true });
}
function isValidLocale(locale) {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(locale);
}
function normalizeLocale(locale) {
  const parts = locale.replace("_", "-").split("-");
  if (parts.length === 1) return parts[0].toLowerCase();
  return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
}

Object.defineProperty(exports, "Parser", {
  enumerable: true,
  get: function () { return jotaParser.Parser; }
});
Object.defineProperty(exports, "enUS", {
  enumerable: true,
  get: function () { return jotaParser.enUS; }
});
Object.defineProperty(exports, "plPL", {
  enumerable: true,
  get: function () { return jotaParser.plPL; }
});
exports.CANONICAL_BOOK_COUNT = CANONICAL_BOOK_COUNT;
exports.Direction = Direction;
exports.Highlighter = Highlighter;
exports.TOTAL_BOOK_COUNT = TOTAL_BOOK_COUNT;
exports.addDays = addDays;
exports.addHighlight = addHighlight;
exports.bookAbbreviations = bookAbbreviations;
exports.books = books;
exports.calculateProgress = calculateProgress;
exports.chapterCounts = chapterCounts;
exports.clearAllHighlights = clearAllHighlights;
exports.clearColorHighlights = clearColorHighlights;
exports.createParser = createParser;
exports.daysBetween = daysBetween;
exports.decodeHtml = decodeHtml;
exports.encodeHtml = encodeHtml;
exports.ensureGlobalRegex = ensureGlobalRegex;
exports.errorMessage = errorMessage;
exports.escapeRegex = escapeRegex;
exports.formatChapterCaption = formatChapterCaption;
exports.formatDate = formatDate;
exports.formatPassage = formatPassage;
exports.formatPassageComposable = formatPassageComposable;
exports.formatReference = formatReference;
exports.formatWithTemplate = formatWithTemplate;
exports.fullEnglishBooks = fullEnglishBooks;
exports.fullPolishBooks = fullPolishBooks;
exports.getAudioSource = getAudioSource;
exports.getBook = getBook;
exports.getBookCount = getBookCount;
exports.getBookIndexFromOsis = getBookIndexFromOsis;
exports.getChapter = getChapter;
exports.getChapterCount = getChapterCount;
exports.getChapterCountForBook = getChapterCountForBook;
exports.getChapterVerses = getChapterVerses;
exports.getDayNumber = getDayNumber;
exports.getExactPassageHighlight = getExactPassageHighlight;
exports.getGlobalChapterIndex = getGlobalChapterIndex;
exports.getHighlightForVerse = getHighlightForVerse;
exports.getHighlights = getHighlights;
exports.getLang = getLang;
exports.getOsisCode = getOsisCode;
exports.getOverlappingHighlights = getOverlappingHighlights;
exports.getPassageVerses = getPassageVerses;
exports.getReadingForDay = getReadingForDay;
exports.getTotalChapterCount = getTotalChapterCount;
exports.getVerse = getVerse;
exports.getVerseCount = getVerseCount;
exports.isApocryphal = isApocryphal;
exports.isArrayFormat = isArrayFormat;
exports.isMapFormat = isMapFormat;
exports.isValidLocale = isValidLocale;
exports.locale2lang = locale2lang;
exports.locale2region = locale2region;
exports.nameSorter = nameSorter;
exports.normalizeLocale = normalizeLocale;
exports.normalizeWhitespace = normalizeWhitespace;
exports.osisBooks = osisBooks;
exports.osisToPassage = osisToPassage;
exports.parseDate = parseDate;
exports.parseReadings = parseReadings;
exports.parseReferences = parseReferences;
exports.patternToTemplate = patternToTemplate;
exports.removeHighlight = removeHighlight;
exports.resolveOsisToPassages = resolveOsisToPassages;
exports.search = search;
exports.searchContent = searchContent;
exports.sortAndDeduplicate = sortAndDeduplicate;
exports.toArrayFormat = toArrayFormat;
exports.toMapFormat = toMapFormat;
exports.toggleHighlight = toggleHighlight;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map