// Builds and controls the add/edit todo form modal (open, close, populate fields)
function createTodoModal(onSave) {
  let editingTodo = null; // Track the todo being edited, if any
  const modal = document.createElement("div");
  modal.classList.add("modal");

  const form = document.createElement("form");
  form.classList.add("todo-form");

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "Title";
  form.appendChild(titleInput);

  const descriptionInput = document.createElement("textarea");
  descriptionInput.placeholder = "Description";
  form.appendChild(descriptionInput);

  const dueDateInput = document.createElement("input");
  dueDateInput.type = "date";
  form.appendChild(dueDateInput);

  const prioritySelect = document.createElement("select");
  ["low", "medium", "high"].forEach((level) => {
    const option = document.createElement("option");
    option.value = level;
    option.textContent = level.charAt(0).toUpperCase() + level.slice(1);
    prioritySelect.appendChild(option);
  });
  form.appendChild(prioritySelect);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Save";
  form.appendChild(submitButton);

  modal.appendChild(form);
  document.body.appendChild(modal);

  function openModal(todo) {
    modal.style.display = "block";
    editingTodo = todo;
    if (todo) {
      titleInput.value = todo.title;
      descriptionInput.value = todo.description;
      dueDateInput.value = todo.dueDate;
      prioritySelect.value = todo.priority;
    } else {
      titleInput.value = "";
      descriptionInput.value = "";
      dueDateInput.value = "";
      prioritySelect.value = "low";
    }
  }

  function closeModal() {
    modal.style.display = "none";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const todoData = {
      title: titleInput.value,
      description: descriptionInput.value,
      dueDate: dueDateInput.value,
      priority: prioritySelect.value,
    };
    // Here you would typically call a function to save the todoData
    onSave(todoData, editingTodo);
    closeModal();
  });

  return { openModal, closeModal };
}

export { createTodoModal };
