// Factory that creates a single todo item (title, description, dueDate, priority, done)
function createTodo(title, description, dueDate, priority) {
  return {
    title,
    description,
    dueDate,
    priority,
    done: false,
  };
}

export { createTodo };
