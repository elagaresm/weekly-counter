export function createWeek(startOfWeek: string, endOfWeek: string) {
  const property = `${startOfWeek}-${endOfWeek}`;
  const dataModel = {
    0: "0",
    1: "0",
    2: "0",
    3: "0",
    4: "0",
    5: "0",
    6: "0"
  }
  localStorage.getItem(property) || localStorage.setItem(property, "0");
}

export function findCurrentDay(date: string) {
  return localStorage.getItem(formatDate(date));
}

function formatDate(str: string | Date) {
  const date = typeof str == "string" ? new Date(str) : str;
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// set up a week object with a daily count
