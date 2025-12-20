'use strict';

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
function getChapter(content, bookIndex, chapterIndex) {
  if (isArrayFormat(content)) {
    return content[bookIndex]?.[chapterIndex];
  } else if (isMapFormat(content)) {
    const bookNumber = bookIndex + 1;
    const chapterNumber = chapterIndex + 1;
    const chapter = content[bookNumber]?.[chapterNumber];
    if (!chapter) return void 0;
    const verses = [];
    const verseNumbers = Object.keys(chapter).map(Number).sort((a, b) => a - b);
    for (const verseNum of verseNumbers) {
      verses[verseNum - 1] = chapter[verseNum];
    }
    return verses;
  }
  return void 0;
}
function getBook(content, bookIndex) {
  if (isArrayFormat(content)) {
    return content[bookIndex];
  } else if (isMapFormat(content)) {
    const bookNumber = bookIndex + 1;
    const book = content[bookNumber];
    if (!book) return void 0;
    const chapters = [];
    const chapterNumbers = Object.keys(book).map(Number).sort((a, b) => a - b);
    for (const chapterNum of chapterNumbers) {
      const chapter = book[chapterNum];
      const verses = [];
      const verseNumbers = Object.keys(chapter).map(Number).sort((a, b) => a - b);
      for (const verseNum of verseNumbers) {
        verses[verseNum - 1] = chapter[verseNum];
      }
      chapters[chapterNum - 1] = verses;
    }
    return chapters;
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
function toArrayFormat(content) {
  if (isArrayFormat(content)) {
    return content;
  }
  if (isMapFormat(content)) {
    const result = [];
    const bookNumbers = Object.keys(content).map(Number).sort((a, b) => a - b);
    for (const bookNum of bookNumbers) {
      const book = content[bookNum];
      const chapters = [];
      const chapterNumbers = Object.keys(book).map(Number).sort((a, b) => a - b);
      for (const chapterNum of chapterNumbers) {
        const chapter = book[chapterNum];
        const verses = [];
        const verseNumbers = Object.keys(chapter).map(Number).sort((a, b) => a - b);
        for (const verseNum of verseNumbers) {
          verses[verseNum - 1] = chapter[verseNum];
        }
        chapters[chapterNum - 1] = verses;
      }
      result[bookNum - 1] = chapters;
    }
    return result;
  }
  return [];
}
function toMapFormat(content) {
  if (isMapFormat(content)) {
    return content;
  }
  const result = {};
  if (isArrayFormat(content)) {
    const arrayContent = content;
    for (let bookIndex = 0; bookIndex < arrayContent.length; bookIndex++) {
      const book = arrayContent[bookIndex];
      const bookNumber = bookIndex + 1;
      result[bookNumber] = {};
      for (let chapterIndex = 0; chapterIndex < book.length; chapterIndex++) {
        const chapter = book[chapterIndex];
        const chapterNumber = chapterIndex + 1;
        result[bookNumber][chapterNumber] = {};
        for (let verseIndex = 0; verseIndex < chapter.length; verseIndex++) {
          const verse = chapter[verseIndex];
          const verseNumber = verseIndex + 1;
          result[bookNumber][chapterNumber][verseNumber] = verse;
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

exports.CANONICAL_BOOK_COUNT = CANONICAL_BOOK_COUNT;
exports.TOTAL_BOOK_COUNT = TOTAL_BOOK_COUNT;
exports.bookAbbreviations = bookAbbreviations;
exports.books = books;
exports.chapterCounts = chapterCounts;
exports.fullEnglishBooks = fullEnglishBooks;
exports.fullPolishBooks = fullPolishBooks;
exports.getBook = getBook;
exports.getBookCount = getBookCount;
exports.getBookIndexFromOsis = getBookIndexFromOsis;
exports.getChapter = getChapter;
exports.getChapterCount = getChapterCount;
exports.getChapterCountForBook = getChapterCountForBook;
exports.getOsisCode = getOsisCode;
exports.getVerse = getVerse;
exports.getVerseCount = getVerseCount;
exports.isApocryphal = isApocryphal;
exports.isArrayFormat = isArrayFormat;
exports.isMapFormat = isMapFormat;
exports.osisBooks = osisBooks;
exports.toArrayFormat = toArrayFormat;
exports.toMapFormat = toMapFormat;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map