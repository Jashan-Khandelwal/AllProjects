export function loadMenu() {
  const content = document.getElementById('content');

  const heading = document.createElement('h1');
  heading.textContent = 'Our Menu';

  content.appendChild(heading);

  const items = [
    { name: 'Bruschetta al Pomodoro', desc: 'Grilled bread with fresh tomatoes, basil, and extra virgin olive oil.', price: '$9' },
    { name: 'Tagliatelle al Ragù', desc: 'Hand-rolled pasta with slow-cooked beef and pork ragù.', price: '$22' },
    { name: 'Risotto ai Funghi', desc: 'Arborio rice with wild mushrooms, white wine, and parmesan.', price: '$20' },
    { name: 'Branzino al Forno', desc: 'Oven-roasted sea bass with capers, lemon, and herbs.', price: '$28' },
    { name: 'Tiramisù', desc: 'Classic mascarpone cream with espresso-soaked ladyfingers.', price: '$10' },
  ];

  const list = document.createElement('ul');
  list.classList.add('menu-list');

  items.forEach(({ name, desc, price }) => {
    const li = document.createElement('li');
    li.classList.add('menu-item');

    const itemName = document.createElement('span');
    itemName.classList.add('item-name');
    itemName.textContent = name;

    const itemDesc = document.createElement('span');
    itemDesc.classList.add('item-desc');
    itemDesc.textContent = desc;

    const itemPrice = document.createElement('span');
    itemPrice.classList.add('item-price');
    itemPrice.textContent = price;

    li.appendChild(itemName);
    li.appendChild(itemDesc);
    li.appendChild(itemPrice);
    list.appendChild(li);
  });

  content.appendChild(list);
}
