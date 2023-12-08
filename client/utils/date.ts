function getWeekNumber(currentDate: Date | string) {
  const date = new Date(currentDate);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));

  const yearStart = new Date(date.getFullYear(), 0, 1);
  const weekNumber = Math.ceil((((+date - +yearStart) / 86400000) + 1) / 7);

  return weekNumber;
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

export { getWeekNumber, formatDate };
