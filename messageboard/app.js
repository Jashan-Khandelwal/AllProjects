const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

const messages = [
  {
    id:1,
    text: "Hi there!",
    user: "Amando",
    added: new Date(),
  },
  {
    id:0,
    text: "Hello World!",
    user: "Charles",
    added: new Date(),
  },
];
const links=[{href:"/new",text:"new message"}];

app.get("/", (req, res) => {
  res.render("message", { title: "mini MessageBoard", messages: messages,links:links });
});

app.get("/new", (req, res) => {
  res.render("form");
});


app.post("/new", (req, res) => {
  const author = req.body.author;
  const message = req.body.message;

  console.log(author, message);
  messages.push({ text: message, user: author, added: new Date() });

  res.redirect("/");
//   res.send("message received");
});
app.get("/new/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const message = messages.find(m => m.id === id);
//   const added=messages.find(m=>m.id===id)

  if (!message) {
    return res.status(404).send("Message not found");
  }

  res.render("individual", { title: "Message Detail", message });
});

app.listen(3000, () => console.log("http://localhost:3000"));
