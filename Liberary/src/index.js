import "./index.css";
const myLibrary = [];

function Book(title, author, pages, read) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

function addBookToLibrary({ title, author, pages, read }) {
  myLibrary.push(new Book(title, author, pages, read));
}

function renderLib() {
  const shelf = document.querySelector("#shelf");

  shelf.innerHTML = "";

  myLibrary.forEach((element) => {
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = element.id;

    card.innerHTML = `
              <h3>${element.title}</h3>
              <p>by ${element.author}</p>
              <p> ${element.pages} pages </p>
              <p class="read">${element.read ? "✓ Read" : "✗ Not read"}</p>
              <button class="toggle">Toggle read</button>
              <button class="remove">Remove</button>`;
    shelf.appendChild(card);
  });
}

const dialog = document.querySelector("#new-book");
const form = document.querySelector("form");

document
  .querySelector("#newBtn")
  .addEventListener("click", () => dialog.showModal());

const titleInput = form.elements.title; // <input name="title">
const authorInput = form.elements.author; // <input name="author">
const pagesInput = form.elements.pages; // <input name="pages">

// Clear custom messages as user types
[titleInput, authorInput, pagesInput].forEach((el) => {
  el.addEventListener("input", () => el.setCustomValidity(""));
});

function validateForm() {
  // Title
  if (!titleInput.value.trim()) {
    titleInput.setCustomValidity("Please enter a book title.");
    return titleInput;
  }
  if (titleInput.value.trim().length < 2) {
    titleInput.setCustomValidity("Title must be at least 2 characters.");
    return titleInput;
  }

  // Author
  if (!authorInput.value.trim()) {
    authorInput.setCustomValidity("Please enter the author name.");
    return authorInput;
  }
  if (authorInput.value.trim().length < 2) {
    authorInput.setCustomValidity("Author must be at least 2 characters.");
    return authorInput;
  }

  // Pages: required, positive integer
  const pagesVal = Number(pagesInput.value);
  if (!pagesInput.value.trim()) {
    pagesInput.setCustomValidity("Please enter the number of pages.");
    return pagesInput;
  }
  if (
    !Number.isFinite(pagesVal) ||
    pagesVal <= 0 ||
    !Number.isInteger(pagesVal)
  ) {
    pagesInput.setCustomValidity("Pages must be a positive whole number.");
    return pagesInput;
  }

  return null; // all good
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const validation = validate();
  if (validation) {
    validation.reportValidity();
    validation.focus();
    return;
  }

  // const data=Object.fromEntries
  const data = Object.fromEntries(new FormData(form));
  addBookToLibrary({
    title: data.title,
    author: data.author,
    pages: +data.pages || 0,
    read: data.read === "on",
  });

  form.reset();
  dialog.close();
  renderLib();
});

document.querySelector("#shelf").addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return; // clicked empty space

  const book = myLibrary.find((b) => b.id === card.dataset.id);

  console.log(book);
  if (e.target.classList.contains("remove")) {
    // splice out and re-render
    myLibrary.splice(myLibrary.indexOf(book), 1);
    renderLibrary();
  }

  if (e.target.classList.contains("toggle")) {
    book.toggleRead();
    renderLib();
  }
});
