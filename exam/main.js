const grid = document.getElementById("grid");
const status = document.getElementById("status");

const category = document.getElementById("category");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const discountOnly = document.getElementById("discountOnly");
const sort = document.getElementById("sort");

document.getElementById("apply").addEventListener("click", apply);
document.getElementById("reset").addEventListener("click", reset);
category.addEventListener("change", apply);
sort.addEventListener("change", apply);

let goods = [];

async function loadGoods() {
  const u = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=80e1b0d6-18aa-4d65-bce7-9c992bb2dcf3";

  const r = await fetch(u);
  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    const msg = data?.error;
    throw new Error(`HTTP ${r.status}: ${msg}`);
  }

  return data;
}

function fillCategories(list) {
  const cats = [...new Set(list.map(x => x.main_category).filter(Boolean))].sort((a, b) => a.localeCompare(b, "en"));
  category.innerHTML = `<option value="">Все</option>` + cats.map(c => `<option value="${String(c)}">${String(c)}</option>`).join("");
}

function apply() {
  let arr = goods.slice();

  if (category.value) arr = arr.filter(x => x.main_category === category.value);

  const min = minPrice.value ? Number(minPrice.value) : null;
  const max = maxPrice.value ? Number(maxPrice.value) : null;

  if (discountOnly.checked) arr = arr.filter(hasDiscount);
  if (min !== null) arr = arr.filter(x => price(x) >= min);
  if (max !== null) arr = arr.filter(x => price(x) <= max);

  arr.sort((a, b) => cmp(a, b, sort.value));

  render(arr);
}

function reset() {
  category.value = "";
  minPrice.value = "";
  maxPrice.value = "";
  discountOnly.checked = false;
  sort.value = "rating_desc";
  apply();
}

function render(list) {
  if (!list.length) {
    grid.innerHTML = "<div>Ничего не найдено</div>";
    return;
  }

  grid.innerHTML = list.map(x => {
    const name = x.name || "Без названия";
    const img = x.image_url || "";
    const r = (Number(x.rating) || 0).toFixed(1);

    const ap = Number(x.actual_price) || 0;
    const dp = Number(x.discount_price) || 0;
    const disc = dp > 0 && dp < ap;

    return `
      <div class="card">
        <img src="${String(img)}" alt="${String(name)}">
        <div class="body">
          <div class="title" title="${String(name)}">${String(short(name, 80))}</div>
          <div class="meta">${String(x.main_category || "")} • Рейтинг: ${r}</div>
          <div class="price">
            ${rub(price(x))}
            ${disc ? `<span class="old">${rub(ap)}</span>` : ""}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function cmp(a, b, mode) {
  if (mode === "rating_desc") return (Number(b.rating)||0) - (Number(a.rating)||0);
  if (mode === "rating_asc")  return (Number(a.rating)||0) - (Number(b.rating)||0);
  if (mode === "price_asc")   return price(a) - price(b);
  if (mode === "price_desc")  return price(b) - price(a);
  return 0;
}

function price(x) {
  const ap = Number(x.actual_price) || 0;
  const dp = Number(x.discount_price) || 0;
  return (dp > 0 && dp < ap) ? dp : ap;
}

function hasDiscount(x) {
  const ap = Number(x.actual_price) || 0;
  const dp = Number(x.discount_price) || 0;
  return dp > 0 && dp < ap;
}

function rub(n) {
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}

function short(s, n) {
  s = String(s);
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

document.addEventListener('DOMContentLoaded', async () => {
  status.textContent = "Загрузка...";
  try {
    goods = await loadGoods();
    fillCategories(goods);
    apply();
    status.textContent = `Товаров: ${goods.length}`;
  } catch (e) {
    status.textContent = "Ошибка загрузки товаров";
    grid.innerHTML = "";
  }
});