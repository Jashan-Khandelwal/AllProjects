let slidingElement = document.querySelector(".carousel__track");
let slides = document.querySelectorAll(".slide");
let previous = document.querySelector(".nav--prev");
let next = document.querySelector(".nav--next");
let dots = document.querySelectorAll(".dot");

let index = 0;
let slidewidth = slides[0].offsetWidth;

function goToSlide(targetIndex) {
  slidingElement.style.transform = `translateX(-${targetIndex * slidewidth}px)`;
  index = targetIndex;
  updateDots(targetIndex);
}

next.addEventListener("click", () => goToSlide((index + 1) % slides.length));
previous.addEventListener("click", () =>
  goToSlide((index - 1 + slides.length) % slides.length)
);
// next.onclick = () => goToSlide((index + 1) % slides.length);
// previous.onclick = () => goToSlide((index - 1 + slides.length) % slides.length);

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => goToSlide(i));
  //   dot.onclick = () => goToSlide(i);
});

function updateDots(i) {
  dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
}

goToSlide(0);

let timer = setInterval(() => next.click(), 5000);

[next, previous, ...dots].forEach((el) =>
  el.addEventListener("click", () => {
    clearInterval(timer);
    timer = setInterval(() => next.click(), 5000);
  })
);

window.addEventListener("resize", () => {
  slideWidth = slides[0].offsetWidth;
  goToSlide(index); // recalc translateX for new width
});
