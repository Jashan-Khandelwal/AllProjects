const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validatePokemon = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name too long."),
  body("dex_number")
    .optional({ values: "falsy" })
    .isInt({ min: 1 })
    .withMessage("Dex number must be a positive whole number."),
  body("level")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 100 })
    .withMessage("Level must be between 1 and 100."),
  body("quantity")
    .optional({ values: "falsy" })
    .isInt({ min: 0 })
    .withMessage("Quantity must be 0 or more."),
  body("image_url")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Image URL must be a valid URL."),
  body("types").custom((value) => {
    const arr = [].concat(value || []);
    if (arr.length === 0) throw new Error("Pick at least one type.");
    if (arr.length > 2) throw new Error("A Pokémon can have at most 2 types.");
    return true;
  }),
];

// Turn the raw form body into clean values for the DB.
function parseBody(b) {
  return {
    name: b.name.trim(),
    dex_number: b.dex_number ? Number(b.dex_number) : null,
    description: (b.description || "").trim(),
    level: b.level ? Number(b.level) : 1,
    quantity: b.quantity ? Number(b.quantity) : 1,
    image_url: (b.image_url || "").trim() || null,
    trainer_id: b.trainer_id ? Number(b.trainer_id) : null,
  };
}

// Load the dropdown + checkbox data and render the shared form.
async function renderForm(res, opts) {
  const [types, trainers] = await Promise.all([
    db.getAllTypes(),
    db.getAllTrainers(),
  ]);
  res
    .status(opts.status || 200)
    .render("pokemon/form", { types, trainers, ...opts });
}

async function pokemonList(req, res) {
  const pokemon = await db.getAllPokemon();
  res.render("pokemon/list", { title: "All Pokémon", pokemon });
}

async function pokemonDetail(req, res) {
  const pokemon = await db.getPokemonById(req.params.id);
  if (!pokemon) return res.status(404).send("Pokémon not found");
  const types = await db.getTypesForPokemon(pokemon.id);
  res.render("pokemon/detail", { title: pokemon.name, pokemon, types });
}

async function pokemonCreateGet(req, res) {
  await renderForm(res, {
    title: "New Pokémon",
    pokemon: {
      name: "",
      dex_number: "",
      description: "",
      level: 5,
      quantity: 1,
      image_url: "",
      trainer_id: "",
    },
    selectedTypeIds: [],
    formAction: "/pokemon/new",
    errors: [],
  });
}

const pokemonCreatePost = [
  ...validatePokemon,
  async (req, res) => {
    const errors = validationResult(req);
    const typeIds = [].concat(req.body.types || []).map(Number);
    if (!errors.isEmpty()) {
      return renderForm(res, {
        title: "New Pokémon",
        pokemon: req.body,
        selectedTypeIds: typeIds,
        formAction: "/pokemon/new",
        errors: errors.array(),
        status: 400,
      });
    }
    await db.insertPokemon(parseBody(req.body), typeIds);
    res.redirect("/pokemon");
  },
];

async function pokemonUpdateGet(req, res) {
  const pokemon = await db.getPokemonById(req.params.id);
  if (!pokemon) return res.status(404).send("Pokémon not found");
  const currentTypes = await db.getTypesForPokemon(pokemon.id);
  await renderForm(res, {
    title: `Edit ${pokemon.name}`,
    pokemon,
    selectedTypeIds: currentTypes.map((t) => t.id),
    formAction: `/pokemon/${pokemon.id}/edit`,
    errors: [],
  });
}

const pokemonUpdatePost = [
  ...validatePokemon,
  async (req, res) => {
    const errors = validationResult(req);
    const typeIds = [].concat(req.body.types || []).map(Number);
    if (!errors.isEmpty()) {
      return renderForm(res, {
        title: "Edit Pokémon",
        pokemon: { id: req.params.id, ...req.body },
        selectedTypeIds: typeIds,
        formAction: `/pokemon/${req.params.id}/edit`,
        errors: errors.array(),
        status: 400,
      });
    }
    await db.updatePokemon(req.params.id, parseBody(req.body), typeIds);
    res.redirect(`/pokemon/${req.params.id}`);
  },
];

// POST /pokemon/:id/delete
async function pokemonDeletePost(req, res) {
  await db.deletePokemon(req.params.id);
  res.redirect("/pokemon");
}

module.exports = {
  pokemonList,
  pokemonDetail,
  pokemonCreateGet,
  pokemonCreatePost,
  pokemonUpdateGet,
  pokemonUpdatePost,
  pokemonDeletePost,
};
