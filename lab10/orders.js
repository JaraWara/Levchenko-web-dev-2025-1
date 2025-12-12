const categories = ["soup", "maincourse", "salad", "drink", "dessert",];

let orders = [],
dishes = []

async function loadOrders() {
    try {
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=80e1b0d6-18aa-4d65-bce7-9c992bb2dcf3`, {
            cache: "no-store"
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        orders = await response.json();
        orders = orders.reverse();
        await loadDishes();
    }
    catch (err){
        console.error("Ошибка загрузки блюд:", err);
        alert(err)
    }
}

async function loadDishes() {
    try {
        const response = await fetch("https://edu.std-900.ist.mospolytech.ru/labs/api/dishes", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        dishes = await response.json();
        await additionOrders();
    } catch (err) {
        console.error("Ошибка загрузки блюд:", err);
        alert("Ошибка загрузки блюд:", err);
    }
}

async function additionOrders() {
    orders.forEach((order) => {
        let dish = {};

        order.price = 0;
        order.text = "";

        if(order.soup_id){
            dish = dishes.find(d => d.id === order.soup_id);
            order.soup = dish;

            order.price += dish.price
            order.text = `${order.text}${order.text.length==0?"":","} ${dish.name}`
        }
        if(order.main_course_id){
            dish = dishes.find(d => d.id === order.main_course_id);
            order.main_course = dish;

            order.price += dish.price
            order.text = `${order.text}${order.text.length==0?"":","} ${dish.name}`
        }
        if(order.salad_id){
            dish = dishes.find(d => d.id === order.salad_id);
            order.salad = dish;

            order.price += dish.price
            order.text = `${order.text}${order.text.length==0?"":","} ${dish.name}`
        }
        if(order.drink_id){
            dish = dishes.find(d => d.id === order.drink_id);
            order.drink = dish;

            order.price += dish.price
            order.text = `${order.text}${order.text.length==0?"":","} ${dish.name}`
        }
        if(order.desser_id){
            dish = dishes.find(d => d.id === order.desser_id);
            order.desser = dish;

            order.price += dish.price
            order.text = `${order.text}${order.text.length==0?"":","} ${dish.name}`
        }
    });
}

async function renderOrders() { 
    const orders_tbody = document.querySelector("#orders_tbody"),
    template = document.querySelector("#order_info_template");

    orders_tbody.innerHTML = ''

    orders.forEach((order) => {
        let item = template.content.cloneNode(true),
        date = new Date(order.created_at)

        item.querySelector(`[data-appointment="number"]`).textContent = (orders.indexOf(order) + 1)
        item.querySelector(`[data-appointment="date"]`).textContent = `${date.toLocaleDateString("ru-RU")} ${date.toTimeString().slice(0, 5)}`
        item.querySelector(`[data-appointment="compound"]`).textContent = order.text
        item.querySelector(`[data-appointment="price"]`).textContent = order.price
        item.querySelector(`[data-appointment="time"]`).textContent = order.delivery_type == "by_time" ? order.delivery_time.slice(0,5) : "Как можно скорее (с 7:00 до 23:00)"
        
        item.querySelector('.order_actions').setAttribute('data-order-id', order.id);
        
        orders_tbody.append(item)
    });
}

async function deleteOrder(orderId) {
    try {
        const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderId}?api_key=80e1b0d6-18aa-4d65-bce7-9c992bb2dcf3`, {
            method: "DELETE"
        });

        if (!response.ok) {
            console.error("Ошибка сервера при удалении");
            return;
        }
    } catch (err) {
        console.error("Ошибка удаления:", err);
        alert("Ошибка удаления:", err);
    }
}

async function saveEditedOrder(orderId, wrapper) {
    const body = {
        full_name: wrapper.querySelector("[data-name]").value.trim(),
        delivery_address: wrapper.querySelector("[data-address]").value.trim(),
        phone: wrapper.querySelector("[data-phone]").value.trim(),
        email: wrapper.querySelector("[data-email]").value.trim(),
        comment: wrapper.querySelector("[data-comment]").value.trim(),

        delivery_type: wrapper.querySelector(`[name="delivery_type"]:checked`).value,
        delivery_time: wrapper.querySelector("[data-time]").value || null
    };

    try {
        const response = await fetch(
            `https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderId}?api_key=80e1b0d6-18aa-4d65-bce7-9c992bb2dcf3`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("Ошибка сервера:", result);
            alert("Ошибка сервера:", result);
            return;
        }

    } catch (err) {
        console.error("Ошибка сети:", err);
        alert("Ошибка сети:", err);
    }
}

document.body.addEventListener("click", e => {
    const btn = e.target.closest(".view, .edit, .delete");
    if (!btn) return;

    const type = btn.className.match(/view|edit|delete/)[0],
    orderId = btn.closest('[data-order-id]').dataset.orderId;

    createModal(type,Number(orderId));
});

function handleTabKey(e) {
    if (e.key === "Tab") {
        e.preventDefault();
    }
}

function createModal(type, orderId) {
    const existing = document.querySelector(".order_modal_wrapper, #order_notification_overlay");
    if (existing) existing.remove();

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleTabKey);

    if (type === "view") {
        renderViewModal(orderId);
    }
    else if (type === "edit") {
        renderEditModal(orderId);
    }
    else if (type === "delete") {
        renderDeleteModal(orderId);
    }
}

function renderViewModal(orderId) {
    const order = orders.find((ord) => ord.id === orderId),
    date = new Date(order.created_at),

    template = document.getElementById("order_modal_view"),
    modal = template.content.cloneNode(true),

    wrapper = modal.querySelector(".order_modal_wrapper");

    wrapper.querySelector("[data-date]").textContent = `${date.toLocaleDateString("ru-RU")} ${date.toTimeString().slice(0, 5)}`;
    wrapper.querySelector("[data-name]").textContent = order.full_name;
    wrapper.querySelector("[data-address]").textContent = order.delivery_address;
    wrapper.querySelector("[data-time]").textContent = order.delivery_type == "by_time" ? order.delivery_time.slice(0,5) : "Как можно скорее"
    wrapper.querySelector("[data-phone]").textContent = order.phone;
    wrapper.querySelector("[data-email]").textContent = order.email;
    wrapper.querySelector("[data-comment]").textContent = order.comment??"";

    wrapper.querySelector("[data-soup]").textContent = order.soup?.name??"Не выбран";
    wrapper.querySelector("[data-main]").textContent = order.main_course?.name??"Не выбрано";
    wrapper.querySelector("[data-salad]").textContent = order.salad?.name??"Не выбран";
    wrapper.querySelector("[data-drink]").textContent = order.drink?.name??"Не выбран";
    wrapper.querySelector("[data-dessert]").textContent = order.dessert?.name??"Не выбран";

    wrapper.querySelector("[data-price]").textContent = order.price;

    wrapper.querySelector(".order_modal_close").addEventListener("click", closeModal);
    wrapper.querySelector(".order_modal_ok").addEventListener("click", closeModal);

    document.body.appendChild(modal);
}

function renderEditModal(orderId) {
    const order = orders.find(o => o.id === orderId),
    date = new Date(order.created_at),

    template = document.getElementById("order_modal_edit"),
    modal = template.content.cloneNode(true),

    wrapper = modal.querySelector(".order_modal_wrapper");

    wrapper.querySelector("[data-date]").textContent = `${date.toLocaleDateString("ru-RU")} ${date.toTimeString().slice(0,5)}`;

    wrapper.querySelector("[data-name]").value = order.full_name;
    wrapper.querySelector("[data-address]").value = order.delivery_address;
    wrapper.querySelector("[data-phone]").value = order.phone;
    wrapper.querySelector("[data-email]").value = order.email;
    wrapper.querySelector("[data-comment]").value = order.comment??"";

    wrapper.querySelector(`[name="delivery_type"][value="${order.delivery_type}"]`).checked = true;

    if (order.delivery_type === "by_time") {
        wrapper.querySelector("[data-time]").value = order.delivery_time.slice(0,5);
    }

    wrapper.querySelector(".order_modal_close").addEventListener("click", closeModal);
    wrapper.querySelector(".order_modal_cancel").addEventListener("click", closeModal);

    wrapper.querySelector(".order_modal_save").addEventListener("click", async () => {
        await saveEditedOrder(orderId, wrapper);
        closeModal();
        await loadOrders();
        renderOrders();
        alert(`Заказ ${orderId} обновлён`);
    });

    document.body.appendChild(modal);
}

async function renderDeleteModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    const date = new Date(order.created_at);

    const template = document.getElementById("order_modal_delete");
    const modal = template.content.cloneNode(true);

    const wrapper = modal.querySelector(".order_modal_wrapper");

    wrapper.querySelector("[data-order-id]").textContent = orderId;
    wrapper.querySelector("[data-date]").textContent = `${date.toLocaleDateString("ru-RU")} ${date.toTimeString().slice(0,5)}`;


    wrapper.querySelector(".order_modal_close").addEventListener("click", closeModal);
    wrapper.querySelector(".order_modal_cancel").addEventListener("click", closeModal);

    wrapper.querySelector(".order_modal_delete_btn").addEventListener("click", async () => {
        await deleteOrder(orderId);
        closeModal();
        await loadOrders();
        renderOrders();
        alert(`Удалён заказ #${orderId}`);
    });

    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector(".order_modal_wrapper");
    if (modal) modal.remove();

    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleTabKey);
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadOrders();
    renderOrders();
});