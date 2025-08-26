function validateTaskInput(input) {
  if (!input.title || !input.assigneeId) return false;
  if (!Date.parse(input.dueDate)) return false;
  return true;
}

module.exports = { validateTaskInput };
