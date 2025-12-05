document.addEventListener('DOMContentLoaded', () => {
  const orderItemsContainer = document.getElementById('order-items');
  
  const selectedDishes = JSON.parse(localStorage.getItem('order')) || {};
  console.log("Selected Dishes: ", selectedDishes);

  if (Object.keys(selectedDishes).length === 0) {
    orderItemsContainer.innerHTML = '<p>Ваш заказ пуст.</p>';
  } else {
    for (const category in selectedDishes) {
      const dish = selectedDishes[category];
      const dishElement = createCardOrder(dish);
      orderItemsContainer.appendChild(dishElement);
    }
  }

  const orderForm = document.getElementById('order-form-data');

  if (!orderForm) {
    console.error('Форма с id "order-form-data" не найдена!');
    return;
  }

  console.log('Форма найдена, привязываем обработчик события.');

  orderForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    checkSelectedDishes(selectedDishes);

    console.log("Форма отправляется...");

    const formData = new FormData(orderForm);

    console.log("Данные формы:", formData);

    const orderData = {
      full_name: formData.get('name'),
      email: formData.get('email'),
      subscribe: formData.get('subscribe') === 'on',
      phone: formData.get('phone'),
      delivery_address: formData.get('address'),
      delivery_type: formData.get('time_mode'),
      time: formData.get('time'),
      comment: formData.get('comment'),

      soup_id: selectedDishes.soup ? selectedDishes.soup.id : null,
      main_id: selectedDishes.main ? selectedDishes.main.id : null,
      salad_id: selectedDishes.salad ? selectedDishes.salad.id : null,
      drink_id: selectedDishes.drink ? selectedDishes.drink.id : null,
      dessert_id: selectedDishes.dessert ? selectedDishes.dessert.id : null
    };

    console.log("Отправляемые данные:", orderData);

    try {
      const apiKey = '80e1b0d6-18aa-4d65-bce7-9c992bb2dcf3';
      const url = `https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=${apiKey}`;

      console.log("URL для отправки запроса:", url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      console.log("Ответ от сервера:", result);

      if (response.ok) {
        alert('Заказ успешно оформлен!');
        localStorage.removeItem('order');
        window.location.href = 'index.html';
      } else {
        console.error('Ошибка сервера:', result);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
    }
  });

  updateOrder(selectedDishes);
});

function createCardOrder(dish) {
  const card = document.createElement('div');
  card.className = 'dish';

  card.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}">
    <p class="dish__name">${dish.name}</p>
    <p class="dish__price">${dish.price} ₽</p>
    <button class="btn remove-btn" data-dish="${dish.keyword}">Удалить</button>
  `;

  const removeButton = card.querySelector('.remove-btn');
  
  removeButton.addEventListener('click', (e) => {
    const dishKeyword = e.target.dataset.dish;

    const storedOrder = localStorage.getItem('order');
    if (storedOrder) {
      const selectedDishes = JSON.parse(storedOrder);

      for (const category in selectedDishes) {
        if (selectedDishes[category].keyword === dishKeyword) {
          delete selectedDishes[category];
          break;
        }
      }

      localStorage.setItem('order', JSON.stringify(selectedDishes));

      window.location.reload();
    }
  });

  return card;
}

function updateOrder(selectedDishes) {
  const map = [
    { cat: 'soup',    el: '#order-soup',    empty: 'Блюдо не выбрано' },
    { cat: 'main',    el: '#order-main',    empty: 'Блюдо не выбрано' },
    { cat: 'salad',   el: '#order-salad',   empty: 'Блюдо не выбрано' },
    { cat: 'drink',   el: '#order-drink',   empty: 'Напиток не выбран' },
    { cat: 'dessert', el: '#order-dessert', empty: 'Блюдо не выбрано' }
  ];

  let total = 0;
  let chosenCount = 0;

  map.forEach(({ cat, el, empty }) => {
    const block = document.querySelector(el);
    const dish = selectedDishes[cat];

    if (dish) {
      block.innerHTML = `<strong>${dish.name}</strong> ${dish.price}₽`;
      total += dish.price;
      chosenCount++;
    } else {
      block.textContent = empty;
    }
  });

  const totalEl = document.getElementById('order-total');
  const totalWrap = document.getElementById('order-total-wrap');
  
  if (chosenCount > 0) {
    totalWrap.style.display = '';
    totalEl.textContent = `${total.toLocaleString('ru-RU')}₽`;
  } else {
    totalWrap.style.display = 'none';
  }
}

function checkSelectedDishes(selectedDishes) {
    const soup = selectedDishes.soup;
    const main = selectedDishes.main;
    const salad = selectedDishes.salad;
    const drink = selectedDishes.drink;
    const dessert = selectedDishes.dessert;

    if (!soup && !main && !salad && !drink && !dessert) {
        showAlert("Ничего не выбрано. Выберите блюда для заказа");
        return false;
    }

    if ((main && !drink) || ((soup && (main || salad)) && !drink)) {
        showAlert("Выберите напиток");
        return false;
    }

    if (soup && !main && !salad) {
        showAlert("Выберите главное блюдо/салат/стартер");
        return false;
    }

    if (salad && (!soup && !main)) {
        showAlert("Выберите суп или главное блюдо");
        return false;
    }

    if ((drink || dessert) && !main && !salad && !soup) {
        showAlert("Выберите главное блюдо");
        return false;
    }

    return true;
}