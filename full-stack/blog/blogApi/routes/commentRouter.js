const { Router } = require("express");
const commentController = require("../controllers/commentController");
const { requireAuth } = require("../middleware/auth");

const commentRouter = Router();

commentRouter.put(
  "/:commentId",
  requireAuth,
  commentController.loadComment,
  ...commentController.updateComment,
);
commentRouter.delete(
  "/:commentId",
  requireAuth,
  commentController.loadComment,
  commentController.deleteComment,
);

module.exports = commentRouter;
