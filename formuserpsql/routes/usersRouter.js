// routes/usersRouter.js
const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();


usersRouter.get("/", usersController.getUsernames);
usersRouter.get("/dbnew", usersController.createUsernameGet);
usersRouter.post("/dbnew", usersController.createUsernamePost);

usersRouter.get("/dbsearch", usersController.dbSearchGet);
usersRouter.post("/dbdelete", usersController.dbdeleteall);

module.exports = usersRouter;
