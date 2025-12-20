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

export { Direction, addDays, daysBetween, decodeHtml, encodeHtml, errorMessage, escapeRegex, formatDate, getLang, isValidLocale, locale2lang, locale2region, nameSorter, normalizeLocale, normalizeWhitespace, parseDate };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map