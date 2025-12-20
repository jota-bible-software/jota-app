'use strict';

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

exports.calculateProgress = calculateProgress;
exports.getDayNumber = getDayNumber;
exports.getReadingForDay = getReadingForDay;
exports.parseReadings = parseReadings;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map