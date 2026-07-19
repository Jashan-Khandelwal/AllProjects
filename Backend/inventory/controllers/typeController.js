const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

// Reusable validation rules for the type form.
const validateType = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required.")
    .isLength({ max: 50 }).withMessage("Name must be 50 characters or fewer."),
  body("description")
    .trim()
    .isLength({ max: 500 }).withMessage("Description is too long (max 500)."),
  body("color")
    .trim()
    .matches(/^#[0-9a-fA-F]{6}$/).withMessage("Colour must be a hex code like #F08030."),
];

// GET /types — list every type
async function typeList(req, res) {
  const types = await db.getAllTypes();
  res.render("types/list", { title: "All Types", types });
}

// GET /types/:id — one type and its Pokémon
async function typeDetail(req, res) {
  const type = await db.getTypeById(req.params.id);
  if (!type) return res.status(404).send("Type not found");
  const pokemon = await db.getPokemonByType(type.id);
  res.render("types/detail", { title: type.name, type, pokemon });
}

// GET /types/new — blank form
function typeCreateGet(req, res) {
  res.render("types/form", {
    title: "New Type",
    type: { name: "", description: "", color: "#777777" },
    errors: [],
    formAction: "/types/new",
  });
}

// POST /types/new — validate, then insert or re-show with errors
const typeCreatePost = [
  ...validateType,
  async (req, res) => {
    const errors = validationResult(req);
    const { name, description, color } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("types/form", {
        title: "New Type",
        type: { name, description, color },
        errors: errors.array(),
        formAction: "/types/new",
      });
    }
    await db.insertType({ name, description, color });
    res.redirect("/types");
  },
];

// GET /types/:id/edit — form pre-filled with existing values
async function typeUpdateGet(req, res) {
  const type = await db.getTypeById(req.params.id);
  if (!type) return res.status(404).send("Type not found");
  res.render("types/form", {
    title: `Edit ${type.name}`,
    type,
    errors: [],
    formAction: `/types/${type.id}/edit`,
  });
}

// POST /types/:id/edit — validate, then update or re-show with errors
const typeUpdatePost = [
  ...validateType,
  async (req, res) => {
    const errors = validationResult(req);
    const { name, description, color } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("types/form", {
        title: "Edit Type",
        type: { id: req.params.id, name, description, color },
        errors: errors.array(),
        formAction: `/types/${req.params.id}/edit`,
      });
    }
    await db.updateType(req.params.id, { name, description, color });
    res.redirect(`/types/${req.params.id}`);
  },
];

// POST /types/:id/delete — blocked if any Pokémon still use this type
async function typeDeletePost(req, res) {
  const type = await db.getTypeById(req.params.id);
  if (!type) return res.status(404).send("Type not found");

  const count = await db.countPokemonForType(type.id);
  if (count > 0) {
    // Guard: a type in use can't be deleted. Re-show its page with an error.
    const pokemon = await db.getPokemonByType(type.id);
    return res.status(400).render("types/detail", {
      title: type.name,
      type,
      pokemon,
      errors: [
        {
          msg: `Can't delete "${type.name}" — ${count} Pokémon still have this type. Remove or re-type them first.`,
        },
      ],
    });
  }

  await db.deleteType(type.id);
  res.redirect("/types");
}

module.exports = {
  typeList,
  typeDetail,
  typeCreateGet,
  typeCreatePost,
  typeUpdateGet,
  typeUpdatePost,
  typeDeletePost,
};
