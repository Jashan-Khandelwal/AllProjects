// Renders the todo cards for the currently selected project into the main content area
function renderTodos(project, onAddTodoClick,onDeleteTodo,onEditTodo) {
    
  const content = document.getElementById("content");
  content.innerHTML = ""; // Clear existing content

  const addButton = document.createElement("button");
  addButton.textContent = "Add Todo";
  addButton.addEventListener("click", () => onAddTodoClick());
  content.appendChild(addButton);

  project.todos.forEach((todo) => {
    const card = document.createElement("div");
    card.classList.add("todo-card");

    const title = document.createElement("h3");
    title.textContent = todo.title;
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = todo.description;
    card.appendChild(description);

    const dueDate = document.createElement("p");
    dueDate.textContent = `Due: ${todo.dueDate}`;
    card.appendChild(dueDate);

    const priority = document.createElement("p");
    priority.textContent = `Priority: ${todo.priority}`;
    card.appendChild(priority);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => onDeleteTodo(todo));
    card.appendChild(deleteButton);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => onEditTodo(todo));
    card.appendChild(editButton);

    content.appendChild(card);
  });
}

export { renderTodos }; 