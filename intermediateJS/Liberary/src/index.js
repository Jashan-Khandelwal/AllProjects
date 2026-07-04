import "./index.css";

class Book {
  constructor(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }

  toggleRead() {
    this.read = !this.read;
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook({ title, author, pages, read }) {
    const book = new Book(title, author, pages, read);
    this.books.push(book);
    return book;
  }

  removeBook(id) {
    this.books = this.books.filter((book) => book.id !== id);
  }

  findBook(id) {
    return this.books.find((book) => book.id === id);
  }
}

class LibraryUI {
  constructor(library) {
    this.library = library;
    this.shelf = document.querySelector("#shelf");
    this.dialog = document.querySelector("#new-book");
    this.form = document.querySelector("form");

    this.titleInput = this.form.elements.title;
    this.authorInput = this.form.elements.author;
    this.pagesInput = this.form.elements.pages;

    this.bindEvents();
  }

  bindEvents() {
    document
      .querySelector("#newBtn")
      .addEventListener("click", () => this.dialog.showModal());

    // Clear custom messages as user types
    [this.titleInput, this.authorInput, this.pagesInput].forEach((el) => {
      el.addEventListener("input", () => el.setCustomValidity(""));
    });

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    this.shelf.addEventListener("click", (e) => this.handleShelfClick(e));
  }

  validateForm() {
    // Title
    if (!this.titleInput.value.trim()) {
      this.titleInput.setCustomValidity("Please enter a book title.");
      return this.titleInput;
    }
    if (this.titleInput.value.trim().length < 2) {
      this.titleInput.setCustomValidity("Title must be at least 2 characters.");
      return this.titleInput;
    }

    // Author
    if (!this.authorInput.value.trim()) {
      this.authorInput.setCustomValidity("Please enter the author name.");
      return this.authorInput;
    }
    if (this.authorInput.value.trim().length < 2) {
      this.authorInput.setCustomValidity(
        "Author must be at least 2 characters.",
      );
      return this.authorInput;
    }

    // Pages: required, positive integer
    const pagesVal = Number(this.pagesInput.value);
    if (!this.pagesInput.value.trim()) {
      this.pagesInput.setCustomValidity("Please enter the number of pages.");
      return this.pagesInput;
    }
    if (
      !Number.isFinite(pagesVal) ||
      pagesVal <= 0 ||
      !Number.isInteger(pagesVal)
    ) {
      this.pagesInput.setCustomValidity(
        "Pages must be a positive whole number.",
      );
      return this.pagesInput;
    }

    return null; // all good
  }

  handleSubmit(e) {
    e.preventDefault();

    const validation = this.validateForm();
    if (validation) {
      validation.reportValidity();
      validation.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(this.form));
    this.library.addBook({
      title: data.title,
      author: data.author,
      pages: +data.pages || 0,
      read: data.read === "on",
    });

    this.form.reset();
    this.dialog.close();
    this.render();
  }

  handleShelfClick(e) {
    const card = e.target.closest(".card");
    if (!card) return; // clicked empty space

    const book = this.library.findBook(card.dataset.id);
    if (!book) return;

    if (e.target.classList.contains("remove")) {
      this.library.removeBook(book.id);
      this.render();
    }

    if (e.target.classList.contains("toggle")) {
      book.toggleRead();
      this.render();
    }
  }

  render() {
    this.shelf.innerHTML = "";

    this.library.books.forEach((element) => {
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
      this.shelf.appendChild(card);
    });
  }
}

const library = new Library();
const ui = new LibraryUI(library);
ui.render();
