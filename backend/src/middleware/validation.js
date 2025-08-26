const { validateTaskInput } = require('../utils/validators');

function taskInputValidator(req, res, next) {
  if (!validateTaskInput(req.body)) {
    return res.status(400).send('Invalid input');
  }
  next();
}

module.exports = { taskInputValidator };
