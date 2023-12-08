const ical = require("ical");

const today = new Date().toLocaleDateString().replace(/\//g, "-");

exports.getEvents = async function(url) {
  const baseURL = "https://my.tanda.co/roster/subscribe/"
  const response = await fetch(baseURL.concat(url));
  const text = await response.text();
  const data = ical.parseICS(text);
  const [startOfWeek, endOfWeek] = getStartAndEndOfWeek();
  const result = { events: [], startOfWeek, endOfWeek };
  for (let k in data) {
    let ev = data[k];
    if (ev.type == "VEVENT" && ev.summary.includes("Zigazoo")) {
      if (ev.start >= startOfWeek && ev.start <= endOfWeek) {
        result.events.push({
          title: ev.summary,
          date: new Date(ev.start).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          start: ev.start,
          end: ev.end,
        });
      }
    }
  }
  return result;
};

exports.formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function sortFunction(a, b) {
  const hourA = new Date(`01/01/2000 ${a.start}`).getHours();
  const hourB = new Date(`01/01/2000 ${b.start}`).getHours();
  return hourA - hourB;
}

function convertToLocalTimeZone(date) {
  const targetDate = new Date(date);
  targetDate.setMinutes(targetDate.getMinutes() + 180);
  return targetDate.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStartAndEndOfWeek() {
  const today = new Date();
  const currentDay = today.getDay();
  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);

  // Calculate the number of days to subtract/add to get to Monday and Sunday
  const daysUntilMonday = currentDay === 0 ? 6 : currentDay - 1;
  const daysUntilSunday = 7 - currentDay;

  // Set the start of the week to Monday 00:00:00
  startOfWeek.setDate(today.getDate() - daysUntilMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // Set the end of the week to Sunday 23:59:59
  endOfWeek.setDate(today.getDate() + daysUntilSunday);
  endOfWeek.setHours(23, 59, 59, 999);

  return [startOfWeek, endOfWeek];
}

module.exports = {
  ...exports,
  getStartAndEndOfWeek,
};
