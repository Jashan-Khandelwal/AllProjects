const db = require("../db/queries");

async function homePage(req, res) {
  const types = await db.getAllTypes();
  res.render("index", { title: "Pokémon Inventory", types });
}

module.exports = { homePage };
