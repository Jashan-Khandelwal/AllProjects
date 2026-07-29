const { Router } = require("express");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const {
  requireAuth,
  requireAuthor,
  optionalAuth,
} = require("../middleware/auth");

const postRouter = Router();

postRouter.get("/", optionalAuth, postController.listPosts);
postRouter.post("/", requireAuthor, ...postController.createPost);

postRouter.get(
  "/:postId",
  optionalAuth,
  postController.loadPost,
  postController.getPost,
);
postRouter.put(
  "/:postId",
  requireAuthor,
  postController.loadPost,
  ...postController.updatePost,
);
postRouter.patch(
  "/:postId/publish",
  requireAuthor,
  postController.loadPost,
  postController.setPublish,
);
postRouter.delete(
  "/:postId",
  requireAuthor,
  postController.loadPost,
  postController.deletePost,
);

// Comments that live under a post (the post must exist → loadPost).
postRouter.get(
  "/:postId/comments",
  postController.loadPost,
  commentController.listComments,
);
postRouter.post(
  "/:postId/comments",
  requireAuth,
  postController.loadPost,
  ...commentController.createComment,
);

module.exports = postRouter;
