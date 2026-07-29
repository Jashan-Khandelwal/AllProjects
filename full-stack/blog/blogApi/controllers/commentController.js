const { body } = require("express-validator");
const prisma = require("../db/prisma");
const { handleValidation } = require("../middleware/validate");

const authorSelect = { author: { select: { id: true, username: true } } };

// Load the comment named in :commentId or 404 → req.comment.
async function loadComment(req, res, next) {
  const id = Number(req.params.commentId);
  if (!Number.isInteger(id)) {
    return res.status(404).json({ error: { message: "Comment not found." } });
  }
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) {
    return res.status(404).json({ error: { message: "Comment not found." } });
  }
  req.comment = comment;
  next();
}

// GET /api/posts/:postId/comments  (req.post set by loadPost)
async function listComments(req, res) {
  const comments = await prisma.comment.findMany({
    where: { postId: req.post.id },
    include: authorSelect,
    orderBy: { createdAt: "asc" },
  });
  res.json({ comments });
}

const createComment = [
  body("content").trim().notEmpty().withMessage("Comment cannot be empty."),
  handleValidation,
  async (req, res) => {
    const comment = await prisma.comment.create({
      data: {
        content: req.body.content,
        postId: req.post.id,
        authorId: req.user.id,
      },
      include: authorSelect,
    });
    res.status(201).json({ comment });
  },
];

const updateComment = [
  body("content").trim().notEmpty().withMessage("Comment cannot be empty."),
  handleValidation,
  async (req, res) => {
    // Editing is owner-only — nobody puts words in someone else's mouth.
    if (req.comment.authorId !== req.user.id) {
      return res
        .status(403)
        .json({ error: { message: "You can only edit your own comment." } });
    }
    const comment = await prisma.comment.update({
      where: { id: req.comment.id },
      data: { content: req.body.content },
      include: authorSelect,
    });
    res.json({ comment });
  },
];

async function deleteComment(req, res) {
  // Deleting is allowed for the comment's owner OR any author (moderation).
  const isOwner = req.comment.authorId === req.user.id;
  const isAuthor = req.user.role === "AUTHOR";
  if (!isOwner && !isAuthor) {
    return res
      .status(403)
      .json({ error: { message: "Not allowed to delete this comment." } });
  }
  await prisma.comment.delete({ where: { id: req.comment.id } });
  res.status(204).end();
}

module.exports = {
  loadComment,
  listComments,
  createComment,
  updateComment,
  deleteComment,
};
