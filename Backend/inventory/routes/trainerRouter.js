const { Router } = require("express");
const trainerController = require("../controllers/trainerController");

const trainerRouter = Router();

trainerRouter.get("/", trainerController.trainerList);

// Create — must come before "/:id"
trainerRouter.get("/new", trainerController.trainerCreateGet);
trainerRouter.post("/new", trainerController.trainerCreatePost);

// Update
trainerRouter.get("/:id/edit", trainerController.trainerUpdateGet);
trainerRouter.post("/:id/edit", trainerController.trainerUpdatePost);

// Delete
trainerRouter.post("/:id/delete", trainerController.trainerDeletePost);

// Detail (catch-all "/:id" goes last)
trainerRouter.get("/:id", trainerController.trainerDetail);

module.exports = trainerRouter;