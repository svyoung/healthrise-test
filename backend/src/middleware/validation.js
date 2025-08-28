import { validateTaskInput } from '../utils/validators.js';

function taskInputValidator(req, res, next) {
  if (!validateTaskInput(req.body)) {
    return res.status(400).send('Invalid input');
  }
  next();
}

export { taskInputValidator };
