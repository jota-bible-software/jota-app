'use strict';

// src/bible/translation-utils.ts
function isArrayFormat(content2) {
  return Array.isArray(content2);
}
function isMapFormat(content2) {
  return !Array.isArray(content2) && typeof content2 === "object" && content2 !== null;
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

exports.formatChapterCaption = formatChapterCaption;
exports.formatPassage = formatPassage;
exports.formatPassageComposable = formatPassageComposable;
exports.formatReference = formatReference;
exports.formatWithTemplate = formatWithTemplate;
exports.getChapterVerses = getChapterVerses;
exports.getPassageVerses = getPassageVerses;
exports.patternToTemplate = patternToTemplate;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map