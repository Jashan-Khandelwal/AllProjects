// GOTCHA: JSON.stringify strips methods off objects, so factory-created todos/projects
// lose their functions on the round-trip — strategy: store only plain data, then
// re-hydrate each saved object back through its factory when you load from localStorage.

import { createProject } from "./project.js";
import { createTodo } from "./todo.js";
// Module that saves and loads the full project list to/from localStorage
function saveProjects(projects) {
  // Convert the array of project objects to a JSON string and save it in localStorage
  localStorage.setItem("projects", JSON.stringify(projects));
}


function loadProjects() {
  // Retrieve the JSON string from localStorage and parse it back into an array of project objects
  const projectsJSON = localStorage.getItem("projects");
  if (projectsJSON) {
    const projectsData = JSON.parse(projectsJSON);
    // Re-hydrate each project object back through its factory to restore methods
    return projectsData.map((projectData) => {
      const project = createProject(projectData.name);
      project.todos = projectData.todos.map((todoData) => createTodo(todoData.title, todoData.description, todoData.dueDate, todoData.priority));
      return project;
    });
  }
  return [];
}

export { saveProjects, loadProjects };