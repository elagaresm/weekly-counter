const express = require("express");
const app = express();
const PORT = 5050;
const { getEvents } = require("./date");

app.get("/", (_, res) => {
  res.send('<a href="/api">Go to API</a>');
});

app.get("/api/:url", async (req, res) => {
  const { url } = req.params;
  const events = await getEvents(url);
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
