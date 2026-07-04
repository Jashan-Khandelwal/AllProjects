import './styles.css';
import { loadHome } from './home.js';
import { loadMenu } from './menu.js';
import { loadContact } from './contact.js';

const content = document.getElementById('content');
const buttons = document.querySelectorAll('nav button');

function clearContent() {
  content.innerHTML = '';
}

function setActiveButton(active) {
  buttons.forEach((btn) => btn.classList.remove('active'));
  active.classList.add('active');
}

function switchTab(loader, btn) {
  clearContent();
  setActiveButton(btn);
  loader();
}

const [homeBtn, menuBtn, contactBtn] = buttons;

homeBtn.addEventListener('click', () => switchTab(loadHome, homeBtn));
menuBtn.addEventListener('click', () => switchTab(loadMenu, menuBtn));
contactBtn.addEventListener('click', () => switchTab(loadContact, contactBtn));

// Default view
setActiveButton(homeBtn);
loadHome();
