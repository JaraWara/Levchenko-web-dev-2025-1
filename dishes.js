const DISHES = [
  { keyword: 'borsch', name: 'Борщ', price: 180, category: 'soup', count: '250 мл', image: 'images/borsch.jpg', kind: 'meat' },
  { keyword: 'gazpacho', name: 'Гаспачо', price: 195, category: 'soup', count: '350 г', image: 'images/gazpacho.jpg', kind: 'meat'},
  { keyword: 'noodle', name: 'Суп-лапша', price: 150, category: 'soup', count: '250 мл', image: 'images/noodle.jpg', kind: 'meat'},
  { keyword: 'shroom-soup', name: 'Грибной суп-пюре', price: 185, category: 'soup', count: '250 мл', image: 'images/shroom.jpg', kind: 'veg' },
  { keyword: 'tom-yam', name: 'Том ям', price: 450, category: 'soup', count: '300 мл', image: 'images/tomyam.jpg', kind: 'fish' },
  { keyword: 'shhi', name: 'Щи', price: 150, category: 'soup', count: '250 мл', image: 'images/shhi.jpg', kind: 'veg' },

  { keyword: 'meatballs', name: 'Тефтели', price: 240, category: 'main', count: '300 г', image: 'images/meatballs.jpg', kind: 'meat' },
  { keyword: 'cutlet',    name: 'Котлеты', price: 250, category: 'main', count: '320 г', image: 'images/cutlet.jpg', kind: 'meat' },
  { keyword: 'lasagna',   name: 'Лазанья', price: 385, category: 'main', count: '350 г', image: 'images/lasagna.jpg', kind: 'meat' },
  { keyword: 'pizza',   name: 'Пицца Пеперони', price: 480, category: 'main', count: '500 г', image: 'images/pizza.jpg', kind: 'meat' },
  { keyword: 'potato',   name: 'Жаренная картошка с грибами', price: 280, category: 'main', count: '300 г', image: 'images/potato.jpg', kind: 'veg' },
  { keyword: 'pasta',   name: 'Паста', price: 360, category: 'main', count: '350 г', image: 'images/pasta.jpg', kind: 'veg' },

  { keyword: 'spring',   name: 'Салат весенний', price: 180, category: 'salad', count: '200 г', image: 'images/spring.jpg', kind: 'veg' },
  { keyword: 'coleslaw',   name: 'Коул Слоу', price: 150, category: 'salad', count: '200 г', image: 'images/coleslaw.jpg', kind: 'veg' },
  { keyword: 'caesar',   name: 'Цезарь с курицей', price: 280, category: 'salad', count: '200 г', image: 'images/caesar.jpg', kind: 'meat' },
  { keyword: 'tuna',   name: 'Салат с тунцом', price: 360, category: 'salad', count: '200 г', image: 'images/tuna.jpg', kind: 'fish' },
  { keyword: 'potato-free',   name: 'Картофель фри с кетчупом', price: 260, category: 'salad', count: '200 г', image: 'images/potato-free.jpg', kind: 'veg' },
  { keyword: 'cheese',   name: 'Сырные шарики', price: 360, category: 'salad', count: '200 г', image: 'images/cheese.jpg', kind: 'veg' },

  { keyword: 'apple-juice', name: 'Яблочный сок', price: 90,  category: 'drink', count: '300 мл', image: 'images/apple.jpg', kind: 'cold' },
  { keyword: 'orange-juice', name: 'Апельсиновый сок', price: 120, category: 'drink', count: '300 мл', image: 'images/orange.jpg', kind: 'cold'},
  { keyword: 'carrot-juice', name: 'Морковный сок', price: 110, category: 'drink', count: '300 мл', image: 'images/carrot.jpg', kind: 'cold' },
  { keyword: 'black-tea', name: 'Чёрный чай', price: 85, category: 'drink', count: '250 мл', image: 'images/black-tea.jpg', kind: 'hot' },
  { keyword: 'capuccino', name: 'Капучино', price: 140, category: 'drink', count: '250 мл', image: 'images/capuccino.jpg', kind: 'hot' },
  { keyword: 'green-tea', name: 'Зелёный чай', price: 90, category: 'drink', count: '250 мл', image: 'images/green-tea.jpg', kind: 'hot' },

  { keyword: 'cheesecake', name: 'Чизкейк', price: 230,  category: 'dessert', count: '180 г', image: 'images/cheesecake.jpg', kind: 'small' },
  { keyword: 'napoleon', name: 'Наполеон', price: 180,  category: 'dessert', count: '200 г', image: 'images/napoleon.jpg', kind: 'medium' },
  { keyword: 'donuts', name: 'Пончики', price: 290,  category: 'dessert', count: '300 г', image: 'images/donuts.jpg', kind: 'big' },
  { keyword: 'baklava', name: 'Пахлава', price: 190,  category: 'dessert', count: '240 г', image: 'images/baklava.jpg', kind: 'big' },
  { keyword: 'cake', name: 'Шоколадный торт', price: 190,  category: 'dessert', count: '220 г', image: 'images/cake.jpg', kind: 'medium' },
  { keyword: 'croissant', name: 'Круасан', price: 170,  category: 'dessert', count: '180 г', image: 'images/croissant.jpg', kind: 'small' }
];