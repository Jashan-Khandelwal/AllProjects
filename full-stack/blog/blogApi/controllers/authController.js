const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const prisma = require("../db/prisma");
const { handleValidation } = require("../middleware/validate");

// Strip the password hash before any user object goes out over the wire.
function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

// One place that builds the token, so login and any future refresh agree.
function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
}

const register = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3–30 characters.")
    .custom(async (username) => {
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing) throw new Error("That username is taken.");
    }),
  body("email")
    .trim()
    .isEmail()
    .withMessage("A valid email is required.")
    .normalizeEmail()
    .custom(async (email) => {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new Error("That email is already registered.");
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters."),
  handleValidation,
  async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    // role is hard-coded — never read from req.body, or anyone could self-promote.
    const user = await prisma.user.create({
      data: { username, email, password: hashed, role: "USER" },
    });

    res.status(201).json({ user: publicUser(user) });
  },
];

const login = [
  body("email").trim().isEmail().normalizeEmail(),
  body("password").notEmpty(),
  handleValidation,
  async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    // Same response whether the email is unknown or the password is wrong —
    // don't let an attacker probe which emails are registered.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ error: { message: "Incorrect email or password." } });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  },
];

function me(req, res) {
  res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, me };
