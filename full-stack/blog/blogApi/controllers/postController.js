const { body } = require("express-validator");
const prisma = require("../db/prisma");
const { handleValidation } = require("../middleware/validate");

// Only ever expose safe author fields on a post — never the password hash.
const authorSelect = { author: { select: { id: true, username: true } } };

// Load the post named in :postId or 404. Attaches it as req.post so the
// handlers after it don't each repeat the lookup.
async function loadPost(req, res, next) {
  const id = Number(req.params.postId);
  if (!Number.isInteger(id)) {
    return res.status(404).json({ error: { message: "Post not found." } });
  }
  const post = await prisma.post.findUnique({
    where: { id },
    include: authorSelect,
  });
  if (!post) {
    return res.status(404).json({ error: { message: "Post not found." } });
  }
  req.post = post;
  next();
}

// GET /api/posts  — public sees published only; author can ask for more.
async function listPosts(req, res) {
  const status = req.query.status || "published";
  const isAuthor = req.user?.role === "AUTHOR";

  if (status !== "published" && !isAuthor) {
    return res
      .status(403)
      .json({ error: { message: "Author access required." } });
  }

  let where = {};
  if (status === "published") where = { published: true };
  else if (status === "draft") where = { published: false };
  // status === "all" → no filter (author only, already gated above)

  const posts = await prisma.post.findMany({
    where,
    include: authorSelect,
    orderBy: { createdAt: "desc" },
  });
  res.json({ posts });
}

// GET /api/posts/:postId  (req.post set by loadPost)
function getPost(req, res) {
  const isAuthor = req.user?.role === "AUTHOR";
  // A draft is invisible to everyone but the author — and we 404 (not 403)
  // so we don't even confirm the draft exists.
  if (!req.post.published && !isAuthor) {
    return res.status(404).json({ error: { message: "Post not found." } });
  }
  res.json({ post: req.post });
}

const createPost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ max: 200 })
    .withMessage("Title is too long."),
  body("content").trim().notEmpty().withMessage("Content is required."),
  handleValidation,
  async (req, res) => {
    const { title, content, published } = req.body;
    const isPublished = Boolean(published);
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: isPublished,
        publishedAt: isPublished ? new Date() : null,
        authorId: req.user.id,
      },
      include: authorSelect,
    });
    res.status(201).json({ post });
  },
];

const updatePost = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty.")
    .isLength({ max: 200 })
    .withMessage("Title is too long."),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty."),
  handleValidation,
  async (req, res) => {
    const data = {};
    if (req.body.title !== undefined) data.title = req.body.title;
    if (req.body.content !== undefined) data.content = req.body.content;

    const post = await prisma.post.update({
      where: { id: req.post.id },
      data,
      include: authorSelect,
    });
    res.json({ post });
  },
];

// PATCH /api/posts/:postId/publish  — the dashboard toggle.
async function setPublish(req, res) {
  const published = Boolean(req.body.published);
  const post = await prisma.post.update({
    where: { id: req.post.id },
    data: {
      published,
      // Stamp publishedAt the first time only; clear it when unpublishing.
      publishedAt: published ? (req.post.publishedAt ?? new Date()) : null,
    },
    include: authorSelect,
  });
  res.json({ post });
}

async function deletePost(req, res) {
  await prisma.post.delete({ where: { id: req.post.id } }); // comments cascade
  res.status(204).end();
}

module.exports = {
  loadPost,
  listPosts,
  getPost,
  createPost,
  updatePost,
  setPublish,
  deletePost,
};
