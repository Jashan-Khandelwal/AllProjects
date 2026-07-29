const { validationResult } = require("express-validator");

// Run after a chain of express-validator checks. If any failed, respond 400
// with our standard error shape instead of continuing to the controller.
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    error: {
      message: "Validation failed.",
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    },
  });
}

module.exports = { handleValidation };
