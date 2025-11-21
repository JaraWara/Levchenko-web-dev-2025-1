const byCat = cat => DISHES
  .filter(d => d.category === cat)
  .sort((a, b) => a.name.localeCompare(b.name, 'ru'));

const fmt = n => `${n.toLocaleString('ru-RU')}₽`;

// Состояние выбранных
const selected = { soup: null, main: null, drink: null };

// Рендер карточки
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
  card.querySelector('.add-to-order').addEventListener('click', () => selectDish(dish, catClass));
  return card;
}

// Рендер списка по категории
function renderCategory(cat, containerId, catClass) {
  const cont = document.getElementById(containerId);
  cont.innerHTML = '';
  byCat(cat).forEach(dish => cont.appendChild(createCard(dish, catClass)));
}

// Выбор блюда
function selectDish(dish, catClass) {
  selected[dish.category] = dish;

  // Подсветка выбранной карточки в своей категории
  document.querySelectorAll(`.${catClass} .dish`).forEach(el => {
    el.classList.toggle('selected', el.dataset.dish === dish.keyword);
  });

  updateOrder();
}

// Обновление панели «Ваш заказ»
function updateOrder() {
  // Записи по категориям
  const map = [
    { cat: 'soup', title: 'Суп', el: '#order-soup', empty: 'Блюдо не выбрано', input: '#inp-soup'  },
    { cat: 'main', title: 'Главное блюдо', el: '#order-main', empty: 'Блюдо не выбрано', input: '#inp-main'  },
    { cat: 'drink', title: 'Напиток', el: '#order-drink', empty: 'Напиток не выбран',input: '#inp-drink' },
  ];

  let total = 0;
  let chosenCount = 0;

  map.forEach(({ cat, el, empty, input }) => {
    const block = document.querySelector(el);
    const dish = selected[cat];

    if (dish) {
      block.innerHTML = `<strong>${dish.name}</strong> ${dish.price}₽`;
      total += dish.price;
      chosenCount++;
      document.querySelector(input).value = dish.keyword; // для отправки формы
    } else {
      block.textContent = empty;
      document.querySelector(input).value = '';
    }
  });

  // Итог
  const totalWrap = document.getElementById('order-total-wrap');
  const totalEl   = document.getElementById('order-total');
  totalEl.textContent = fmt(total);
  totalWrap.style.display = chosenCount ? '' : 'none';
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Рендер блюд (в алфавитном порядке)
  renderCategory('soup',  'soupsList',  'dishes-soup');
  renderCategory('main',  'mainsList',  'dishes-main');
  renderCategory('drink', 'drinksList', 'dishes-drink');

  // Начальное состояние «ничего не выбрано»
  updateOrder();
});