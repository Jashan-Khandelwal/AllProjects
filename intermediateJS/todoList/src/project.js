// Factory that creates a project — holds a name and an array of todo items
function createProject(name) {
  return {
    name,
    todos: [],
    addTodo(todo) {
      this.todos.push(todo);
    },
    removeTodo(todo) {
      this.todos=this.todos.filter((t) => t !== todo);
    }
  };
}

export { createProject };
