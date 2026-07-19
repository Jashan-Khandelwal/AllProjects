const { Router } = require("express");
const typeController = require("../controllers/typeController");

const typeRouter = Router();

typeRouter.get("/", typeController.typeList);

// Create — MUST come before "/:id" so "new" isn't read as an id
typeRouter.get("/new", typeController.typeCreateGet);
typeRouter.post("/new", typeController.typeCreatePost);

// Update
typeRouter.get("/:id/edit", typeController.typeUpdateGet);
typeRouter.post("/:id/edit", typeController.typeUpdatePost);

// Delete
typeRouter.post("/:id/delete", typeController.typeDeletePost);

// Detail (the catch-all "/:id" goes LAST)
typeRouter.get("/:id", typeController.typeDetail);

module.exports = typeRouter;
