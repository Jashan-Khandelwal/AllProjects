const { Router } = require("express");
const pokemonController = require("../controllers/pokemonController");

const pokemonRouter = Router();

pokemonRouter.get("/", pokemonController.pokemonList);

pokemonRouter.get("/new", pokemonController.pokemonCreateGet);
pokemonRouter.post("/new", pokemonController.pokemonCreatePost);

pokemonRouter.get("/:id/edit", pokemonController.pokemonUpdateGet);
pokemonRouter.post("/:id/edit", pokemonController.pokemonUpdatePost);

pokemonRouter.post("/:id/delete", pokemonController.pokemonDeletePost);

pokemonRouter.get("/:id", pokemonController.pokemonDetail);

module.exports = pokemonRouter;
