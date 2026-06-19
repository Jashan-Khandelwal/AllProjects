export function loadContact() {
  const content = document.getElementById('content');

  const heading = document.createElement('h1');
  heading.textContent = 'Find Us';

  const details = [
    { label: 'Address', value: '14 Via Roma, Florence, Italy' },
    { label: 'Phone', value: '+39 055 123 4567' },
    { label: 'Hours', value: 'Tuesday – Sunday: 12:00 – 22:30' },
  ];

  const section = document.createElement('div');
  section.classList.add('contact-details');

  details.forEach(({ label, value }) => {
    const row = document.createElement('div');
    row.classList.add('contact-row');

    const dt = document.createElement('strong');
    dt.textContent = label;

    const dd = document.createElement('span');
    dd.textContent = value;

    row.appendChild(dt);
    row.appendChild(dd);
    section.appendChild(row);
  });

  content.appendChild(heading);
  content.appendChild(section);
}
