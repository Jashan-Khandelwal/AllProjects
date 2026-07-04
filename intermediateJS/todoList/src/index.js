import "./index.css";
import { createTodo } from "./todo.js";
import { createProject } from "./project.js";
import { saveProjects, loadProjects } from "./storage.js";
import { renderTodos } from "./dom/renderTodos.js";
import { renderProjects } from "./dom/renderProjects.js";
import { createTodoModal } from "./dom/modal.js";

const todoModal = createTodoModal(onSaveTodo);

// Entry point — initialize the app and kick off the first render
const loadedProjects = loadProjects();
if (loadedProjects.length === 0) {
  // If no projects are loaded, create a default one
  const defaultProject = createProject("Default Project");
  loadedProjects.push(defaultProject);
  saveProjects(loadedProjects);
}
let currentProject = loadedProjects.length > 0 ? loadedProjects[0] : null;

if (currentProject) {
  renderTodos(currentProject, onAddTodoClick, onDeleteTodo, onEditTodo);
}

function onProjectSelect(index) {
  currentProject = loadedProjects[index];
  renderTodos(currentProject, onAddTodoClick, onDeleteTodo, onEditTodo);
}

function onProjectCreate(projectName) {
  const newProject = createProject(projectName);
  loadedProjects.push(newProject);
  saveProjects(loadedProjects);
  renderProjects(loadedProjects, onProjectSelect, onProjectCreate);
}
function onSaveTodo(todoData,editingTodo) {
  if (editingTodo) {
    // Update the existing todo with new data
    editingTodo.title=todoData.title;
    editingTodo.description=todoData.description;
    editingTodo.dueDate=todoData.dueDate;
    editingTodo.priority=todoData.priority;    
  }
    else {
    // Create a new todo and add it to the current project
    const newTodo = createTodo(todoData.title, todoData.description, todoData.dueDate, todoData.priority);
    currentProject.addTodo(newTodo);
  }
  saveProjects(loadedProjects);
  renderTodos(currentProject,onAddTodoClick, onDeleteTodo, onEditTodo);
}

function onAddTodoClick() {
  todoModal.openModal(null);
}

function onDeleteTodo(todo) {
    currentProject.removeTodo(todo);
    saveProjects(loadedProjects);
    renderTodos(currentProject, onAddTodoClick, onDeleteTodo, onEditTodo);
}

function onEditTodo(todo) {
  todoModal.openModal(todo);
}

// Initial render of the project list with event handlers
renderProjects(loadedProjects, onProjectSelect, onProjectCreate);
