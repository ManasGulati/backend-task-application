const sanitize = require('../utils/sanitize');

module.exports = (req, res, next) => {
  try {
    if (req.body) sanitize.rejectUnsafe(req.body);
    if (req.query) sanitize.rejectUnsafe(req.query);
    if (req.params) sanitize.rejectUnsafe(req.params);
    return next();
  } catch (err) {
    return next(err);
  }
};
