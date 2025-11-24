const byCat = (cat, kind = null) => DISHES
  .filter(d => d.category === cat && (!kind || d.kind === kind))
  .sort((a, b) => a.name.localeCompare(b.name, 'ru'));

const fmt = n => `${n.toLocaleString('ru-RU')}₽`;

const selected = {
  soup: null,
  main: null,
  salad: null,
  drink: null,
  dessert: null
};

const activeFilter = {
  soup: null,
  main: null,
  salad: null,
  drink: null,
  dessert: null
};

const CATEGORY_CONFIG = {
  soup:    { containerId: 'soupsList',    catClass: 'dishes-soup' },
  main:    { containerId: 'mainsList',    catClass: 'dishes-main' },
  salad:   { containerId: 'saladsList',   catClass: 'dishes-salad' },
  drink:   { containerId: 'drinksList',   catClass: 'dishes-drink' },
  dessert: { containerId: 'dessertsList', catClass: 'dishes-dessert' }
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

  document
    .querySelectorAll(`.${catClass} .dish`)
    .forEach(el => {
      el.classList.toggle('selected', el.dataset.dish === dish.keyword);
    });

  updateOrder();
}

function updateOrder() {
  const map = [
    { cat: 'soup',    el: '#order-soup',    empty: 'Блюдо не выбрано',          input: '#inp-soup'    },
    { cat: 'main',    el: '#order-main',    empty: 'Блюдо не выбрано',          input: '#inp-main'    },
    { cat: 'salad',   el: '#order-salad',   empty: 'Блюдо не выбрано',          input: '#inp-salad'   },
    { cat: 'drink',   el: '#order-drink',   empty: 'Напиток не выбран',         input: '#inp-drink'   },
    { cat: 'dessert', el: '#order-dessert', empty: 'Блюдо не выбрано',          input: '#inp-dessert' }
  ];

  let total = 0;
  let chosenCount = 0;

  map.forEach(({ cat, el, empty, input }) => {
    const block = document.querySelector(el);
    const dish  = selected[cat];

    if (dish) {
      block.innerHTML = `<strong>${dish.name}</strong> ${dish.price}₽`;
      total += dish.price;
      chosenCount++;
      const inp = document.querySelector(input);
      if (inp) inp.value = dish.keyword;
    } else {
      block.textContent = empty;
      const inp = document.querySelector(input);
      if (inp) inp.value = '';
    }
  });

  const totalWrap = document.getElementById('order-total-wrap');
  const totalEl   = document.getElementById('order-total');

  totalEl.textContent = fmt(total);
  totalWrap.style.display = chosenCount ? '' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  Object.keys(CATEGORY_CONFIG).forEach(renderCategory);
  updateOrder();

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat  = btn.dataset.cat;
      const kind = btn.dataset.kind;
      const current = activeFilter[cat];

      if (current === kind) {
        activeFilter[cat] = null;
      } else {
        activeFilter[cat] = kind;
      }

      document
        .querySelectorAll(`.filters[data-cat="${cat}"] .filter-btn`)
        .forEach(b => {
          b.classList.toggle('active', activeFilter[cat] === b.dataset.kind);
        });

      renderCategory(cat);
    });
  });
});