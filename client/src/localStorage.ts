import { getWeekNumber, formatDate } from "../utils/date";

export function initializeWeek(date: Date) {
  const propertyName = `week${getWeekNumber(date)}`;
  const weekData = localStorage.getItem(propertyName);

  if (weekData === null) {
    const obj = {
      [formatDate(date)]: 0,
    };
    localStorage.setItem(propertyName, JSON.stringify(obj));
  } else {
    const obj = JSON.parse(weekData);
    if (obj[formatDate(date).toString()] === undefined) {
      obj[formatDate(date)] = 0;
      localStorage.setItem(propertyName, JSON.stringify(obj));
    } else {
      return;
    }
  }
}

export function getDayCount(date: Date): number {
  const propertyName = `week${getWeekNumber(date)}`;
  const weekData = localStorage.getItem(propertyName);
  if (weekData === null) {
    return 0;
  }
  const obj = JSON.parse(weekData!);
  if (obj[formatDate(date)] === undefined) {
    return 0;
  }
  return obj[formatDate(date)];
}

export function getWeeklyCount(date: Date): number {
  const propertyName = `week${getWeekNumber(date)}`;
  const weekData = localStorage.getItem(propertyName);
  const obj = JSON.parse(weekData!);
  let count = 0;
  for (const key in obj) {
    count += obj[key];
  }
  return count;
}

export function updateDayCount(date: Date, count: number) {
  const propertyName = `week${getWeekNumber(date)}`;
  const weekData = localStorage.getItem(propertyName);
  // the exclamation mark tells TypeScript that weekData is not null or undefined so it doesn't need to be checked for null or undefined
  const obj = JSON.parse(weekData!);
  obj[formatDate(date)] = count;
  localStorage.setItem(propertyName, JSON.stringify(obj));
}
