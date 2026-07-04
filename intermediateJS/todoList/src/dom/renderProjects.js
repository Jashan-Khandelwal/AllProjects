// Renders the sidebar project list and handles project selection/creation UI
function renderProjects(projects, onProjectSelect, onProjectCreate) {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = ""; // Clear existing content

  // Create a list of project buttons
  projects.forEach((project, index) => {
    const button = document.createElement("button");
    button.textContent = project.name;
    button.addEventListener("click", () => onProjectSelect(index));
    sidebar.appendChild(button);
  });

  // Create a form for adding new projects
  const form = document.createElement("form");
  form.id = "new-project-form";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "New Project Name";
  input.required = true;
  form.appendChild(input);

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Add Project";
  form.appendChild(submitButton);
  
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const projectName = input.value.trim();
    if (projectName) {
      onProjectCreate(projectName);
      input.value = ""; // Clear the input field after submission
    }
  });

  sidebar.appendChild(form);
}

export { renderProjects };