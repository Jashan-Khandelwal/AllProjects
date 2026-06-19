import heroImg from './restaurant.svg';

export function loadHome() {
  const content = document.getElementById('content');

  const headline = document.createElement('h1');
  headline.textContent = 'Bella Tavola';

  const tagline = document.createElement('p');
  tagline.textContent =
    'Authentic Italian cuisine crafted from family recipes passed down through four generations. Every dish is made fresh, every evening.';

  const about = document.createElement('p');
  about.textContent =
    'Located in the heart of the city, we have been serving our community since 1987. Whether you are joining us for a quiet dinner or a celebration, our kitchen is always open.';

  const img = document.createElement('img');
  img.src = heroImg;
  img.alt = 'Bella Tavola restaurant exterior';

  content.appendChild(headline);
  content.appendChild(img);
  content.appendChild(tagline);
  content.appendChild(about);
}
