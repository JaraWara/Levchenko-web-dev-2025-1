let DISHES = [ ];

const byCat = (cat, kind = null) => DISHES
  .filter(d => d.category === cat && (!kind || d.kind === kind))
  .sort((a, b) => a.name.localeCompare(b.name, 'ru'));

const fmt = n => `${n.toLocaleString('ru-RU')}₽`;

let selected = {};

const activeFilter = {
  soup: null,
  main: null,
  salad: null,
  drink: null,
  dessert: null
};

const CATEGORY_CONFIG = {
  soup:{ containerId: 'soupsList', catClass: 'dishes-soup' },
  main:{ containerId: 'mainsList', catClass: 'dishes-main' },
  salad:{ containerId: 'saladsList', catClass: 'dishes-salad' },
  drink:{ containerId: 'drinksList', catClass: 'dishes-drink' },
  dessert:{ containerId: 'dessertsList', catClass: 'dishes-dessert' }
};

function createCard(dish, catClass) {
  const card = document.createElement('div');
  card.className = 'dish';
  card.dataset.dish = dish.keyword;

  card.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}">
    <p class="dish__price">${dish.price} ₽</p>
    <p class="dish__name">${dish.name}</p>
    <p class="dish__count">${dish.count}</p>
    <button type="button" class="btn add-to-order" data-dish="${dish.keyword}">Добавить</button>
  `;

  card
    .querySelector('.add-to-order')
    .addEventListener('click', () => selectDish(dish, catClass));

  return card;
}

function renderCategory(cat) {
  const cfg = CATEGORY_CONFIG[cat];
  if (!cfg) return;

  const cont = document.getElementById(cfg.containerId);
  if (!cont) return;

  cont.innerHTML = '';

  const kind = activeFilter[cat];

  byCat(cat, kind).forEach(dish => {
    cont.appendChild(createCard(dish, cfg.catClass));
  });

  const chosen = selected[cat];
  if (chosen) {
    document
      .querySelectorAll(`.${cfg.catClass} .dish`)
      .forEach(el => {
        el.classList.toggle('selected', el.dataset.dish === chosen.keyword);
      });
  }
}

function selectDish(dish, catClass) {
  selected[dish.category] = dish;

  localStorage.setItem('order', JSON.stringify(selected));

  document
    .querySelectorAll(`.${catClass} .dish`)
    .forEach(el => {
      el.classList.toggle('selected', el.dataset.dish === dish.keyword);
    });

  updateOrder();
}

function updateOrder() {
  const selected = JSON.parse(localStorage.getItem('order')) || {};
  let total = 0;
  let chosenCount = 0;

  for (const category in selected) {
    const dish = selected[category];
    total += dish.price;
    chosenCount++;
  }

  const totalEl = document.getElementById('order-total');
  const totalWrap = document.getElementById('order-total-wrap');
  const orderLink = document.querySelector('.btn--order');

  if (chosenCount > 0) {
    totalWrap.style.display = '';
    totalEl.textContent = `${total.toLocaleString('ru-RU')}₽`;
    orderLink.style.display = '';
  } else {
    totalWrap.style.display = 'none';
    orderLink.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadDishes();

    DISHES.sort((a, b) => a.name.localeCompare(b.name));

    const savedOrder = JSON.parse(localStorage.getItem('order')) || {};
    Object.keys(savedOrder).forEach(cat => {
      selected[cat] = savedOrder[cat];
    });

    renderCategory('soup',   'soup-list',   'soup-block');
    renderCategory('main',   'main-list',   'main-block');
    renderCategory('salad',  'salad-list',  'salad-block');
    renderCategory('drink',  'drink-list',  'drink-block');
    renderCategory('dessert','dessert-list','dessert-block');

    initFilters();
    updateOrder();
  } catch (err) {
    console.error(err);
  }
});

function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const cat = event.target.dataset.cat;
      const kind = event.target.dataset.kind;

      if (activeFilter[cat] === kind) {
        activeFilter[cat] = null;
        event.target.classList.remove('active');
      } else {
        activeFilter[cat] = kind;
        
        document.querySelectorAll(`.filters[data-cat="${cat}"] .filter-btn`).forEach(b => {
          b.classList.remove('active');
        });
        event.target.classList.add('active');
      }

      renderCategory(cat, CATEGORY_CONFIG[cat].containerId, CATEGORY_CONFIG[cat].catClass);
    });
  });
}

function showAlert(message) {
    const overlay = document.createElement("div");
    overlay.className = "alert-overlay";

    const box = document.createElement("div");
    box.className = "alert-box";

    const msg = document.createElement("div");
    msg.className = "alert-text";
    msg.innerText = message;

    const btn = document.createElement("button");
    btn.innerText = "Окей";
    btn.className = "alert-btn";

    btn.addEventListener("click", () => {
        overlay.remove();
    });

    box.appendChild(msg);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

async function loadDishes() {
  const url = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Ошибка загрузки блюд: ' + response.status);
  }

  const data = await response.json();

  DISHES = data.map(item => ({
    keyword:  item.keyword,
    name:     item.name,
    price:    item.price,
    category: item.category === 'main-course' ? 'main' : item.category,
    count:    item.count,
    kind:     item.kind,
    image:    item.image,
    id:       item.id
  }));
}