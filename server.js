// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// (optional) parse JSON bodies if you add POST routes later
app.use(express.json());

// More specific route first is a good habit:
app.get("/:username/messages/:messageId", (req, res) => {
  const { username, messageId } = req.params;
  console.log("Params:", req.params);

  // Example: pretend to fetch a single message
  res.json({
    ok: true,
    route: "/:username/messages/:messageId",
    username,
    messageId,
    info: "This would return a single message for the user.",
  });
});

app.get("/:username/messages", (req, res) => {
  const { username } = req.params;
  console.log("Params:", req.params);

  // Example: pretend to list messages
  res.json({
    ok: true,
    route: "/:username/messages",
    username,
    messages: [
      { id: "101", text: "Hello!" },
      { id: "102", text: "How are you?" },
    ],
  });
});

// A simple root route so hitting / shows something
app.get("/", (req, res) => {
  res.type("text").send("Try /odin/messages or /odin/messages/79687378");
});

// 404 for anything else (after all routes)
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
