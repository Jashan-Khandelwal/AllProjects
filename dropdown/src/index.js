import "./index.css";
export default class Dropdown {
  constructor(root, opts = {}) {
    // 1. Guard clause – we need a valid element
    if (!root) throw new Error("Dropdown: root element required");

    // 2. Store things we’ll need later
    this.root = root;
    this.trigger = opts.trigger || root.dataset.trigger || "click";
    this.button = root.querySelector(".dropdown-toggle");
    this.menu = root.querySelector(".dropdown-menu");

    // 3. Hide menu at start
    this.menu.classList.remove("is-visible");

    // 4. Bind methods so 'this' is always correct when they run as callbacks
    this.show = () => this.menu.classList.add("is-visible");
    this.hide = () => this.menu.classList.remove("is-visible");
    this.toggle = () => this.menu.classList.toggle("is-visible");

    // 5. Attach listeners depending on chosen trigger
    if (this.trigger === "hover") {
      // open on mouseenter, close on mouseleave
      this.root.addEventListener("mouseenter", this.show);
      this.root.addEventListener("mouseleave", this.hide);
    } else {
      // default: click
      this.button.addEventListener("click", this.toggle);

      // an *extra* quality-of-life touch: click outside to close
      document.addEventListener("click", (e) => {
        if (!this.root.contains(e.target)) this.hide();
      });
    }
  }
}

// Instantiate for every .dropdown on the page
document.querySelectorAll(".dropdown").forEach((el) => new Dropdown(el));
