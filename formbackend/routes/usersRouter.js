// routes/usersRouter.js
const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.usersListGet);

usersRouter.get("/create", usersController.usersCreateGet);
usersRouter.post("/create", usersController.usersCreatePost);

usersRouter.get("/search",usersController.usersSearchGet);
// usersRouter.post("/search",usersController.userSearchPost);

usersRouter.get("/:id/update", usersController.usersUpdateGet);
usersRouter.post("/:id/update", usersController.usersUpdatePost);
usersRouter.post("/:id/delete", usersController.usersDeletePost);

// usersRouter.get("/db",usersController.getUsernames);
// usersRouter.get("/dbnew",usersController.createUsernameGet);
// usersRouter.post("/dbnew",usersController.createUsernamePost);

// usersRouter.get("/dbsearch",usersController.dbSearchGet);
// usersRouter.post("/dbdelete",usersController.dbdeleteall);

module.exports = usersRouter;
