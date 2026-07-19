const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateTrainer = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name too long."),
  body("hometown").trim().isLength({ max: 100 }).withMessage("Hometown too long."),
  body("bio").trim().isLength({ max: 500 }).withMessage("Bio too long (max 500)."),
];

// GET /trainers
async function trainerList(req, res) {
  const trainers = await db.getAllTrainers();
  res.render("trainers/list", { title: "Trainers", trainers });
}

// GET /trainers/:id
async function trainerDetail(req, res) {
  const trainer = await db.getTrainerById(req.params.id);
  if (!trainer) return res.status(404).send("Trainer not found");

  const pokemon = await db.getPokemonByTrainer(trainer.id);
  res.render("trainers/detail", { title: trainer.name, trainer, pokemon });
}

// GET /trainers/new
function trainerCreateGet(req, res) {
  res.render("trainers/form", {
    title: "New Trainer",
    trainer: { name: "", hometown: "", bio: "" },
    errors: [],
    formAction: "/trainers/new",
  });
}

// POST /trainers/new
const trainerCreatePost = [
  ...validateTrainer,
  async (req, res) => {
    const errors = validationResult(req);
    const { name, hometown, bio } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("trainers/form", {
        title: "New Trainer",
        trainer: { name, hometown, bio },
        errors: errors.array(),
        formAction: "/trainers/new",
      });
    }
    await db.insertTrainer({ name, hometown, bio });
    res.redirect("/trainers");
  },
];

// GET /trainers/:id/edit
async function trainerUpdateGet(req, res) {
  const trainer = await db.getTrainerById(req.params.id);
  if (!trainer) return res.status(404).send("Trainer not found");
  res.render("trainers/form", {
    title: `Edit ${trainer.name}`,
    trainer,
    errors: [],
    formAction: `/trainers/${trainer.id}/edit`,
  });
}

// POST /trainers/:id/edit
const trainerUpdatePost = [
  ...validateTrainer,
  async (req, res) => {
    const errors = validationResult(req);
    const { name, hometown, bio } = req.body;
    if (!errors.isEmpty()) {
      return res.status(400).render("trainers/form", {
        title: "Edit Trainer",
        trainer: { id: req.params.id, name, hometown, bio },
        errors: errors.array(),
        formAction: `/trainers/${req.params.id}/edit`,
      });
    }
    await db.updateTrainer(req.params.id, { name, hometown, bio });
    res.redirect(`/trainers/${req.params.id}`);
  },
];

// POST /trainers/:id/delete — their Pokémon become wild (trainer_id set to null)
async function trainerDeletePost(req, res) {
  await db.deleteTrainer(req.params.id);
  res.redirect("/trainers");
}

module.exports = {
  trainerList,
  trainerDetail,
  trainerCreateGet,
  trainerCreatePost,
  trainerUpdateGet,
  trainerUpdatePost,
  trainerDeletePost,
};