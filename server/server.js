const express = require("express");
const app = express();
const PORT = 5050;
const { getEvents } = require("./date");

app.get("/", (_, res) => {
  res.send('<a href="/api">Go to API</a>');
});

app.get("/api", async (_, res) => {
  const events = await getEvents();
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
