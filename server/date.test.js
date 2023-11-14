const { getStartAndEndOfWeek, formatDate } = require("./date");

test("getStartAndEndOfWeek returns the correct start and end of the week", () => {
  const [startOfWeek, endOfWeek] = getStartAndEndOfWeek();
  expect(formatDate(startOfWeek)).toEqual("Monday, November 13, 2023");
  expect(formatDate(endOfWeek)).toEqual("Sunday, November 19, 2023");
});
