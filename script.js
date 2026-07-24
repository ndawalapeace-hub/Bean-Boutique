//slideshow

let current = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(n) {
    slides.forEach((slide) => slide.classList.remove('active'));
    slides[n].classList.add('active');
}

function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
}

function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
}

if (slides.length > 0) {
    slides[0].classList.add('active');
    setInterval(nextSlide, 5000);
}

//search

function filterCoffee() {
    const input = document.getElementById('search').value.toLowerCase();
    const cards = document.querySelectorAll('.block');
    cards.forEach(block => {
        block.style.display = block.textContent.toLowerCase().includes(input) ? '' : 'none';
    });
}

function filterEquipment() {
    const input = document.getElementById('search').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(input) ? '' : 'none';
    });
}

//cart

const PROMO_CODES = {
    "BOUTIQUE67": 10
};

function getPromo() {
    return localStorage.getItem("promo") || "";
}

function applyPromo() {
    const input = document.getElementById("promo-input");
    const messageEl = document.getElementById("promo-message");
    if (!input || !messageEl) return;

    const code = input.value.trim().toUpperCase();

    if (PROMO_CODES[code]) {
        localStorage.setItem("promo", code);
        messageEl.textContent = `Code applied! ${PROMO_CODES[code]}% off your order.`;
        messageEl.style.color = "green";
    } else {
        localStorage.removeItem("promo");
        messageEl.textContent = "That code isn't valid.";
        messageEl.style.color = "#c0392b";
    }
    renderCart();
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    showToast("Order placed! Thank you for shopping with us.");

    localStorage.removeItem("cart");
    localStorage.removeItem("promo");

    const input = document.getElementById("promo-input");
    if (input) input.value = "";
    const messageEl = document.getElementById("promo-message");
    if (messageEl) messageEl.textContent = "";

    updateCartCount();
    renderCart();
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function addToCart(name, price) {
    const cart = getCart();
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }
    saveCart(cart);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function changeQty(index, delta) {
    const cart = getCart();
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    saveCart(cart);
}

function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (countEl) {
        const totalItems = getCart().reduce((sum, item) => sum + item.qty, 0);
        countEl.textContent = `(${totalItems})`;
    }
}


function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        const totalEl = document.getElementById("cart-total");
        if (totalEl) totalEl.textContent = "";
        return;
    }

    container.innerHTML = cart.map((item, i) => `
        <div class="cart-row">
            <span>${item.name}</span>
            <span class="qty-controls">
                <button onclick="changeQty(${i}, -1)">-</button>
                ${item.qty}
                <button onclick="changeQty(${i}, 1)">+</button>
            </span>
            <span>K${item.price * item.qty}</span>
            <button onclick="removeFromCart(${i})">Remove</button>
        </div>
    `).join("");

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const promo = getPromo();
    const discountPercent = PROMO_CODES[promo] || 0;
    const discount = Math.round(subtotal * discountPercent / 100);
    const total = subtotal - discount;

    const totalEl = document.getElementById("cart-total");
    if (totalEl) {
        totalEl.textContent = discountPercent > 0
            ? `Subtotal: K${subtotal}  |  Discount: -K${discount}  |  Total: K${total}`
            : `Your Total: K${subtotal}`;
    }
}

function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

document.querySelectorAll(".cart-btn").forEach(button => {
    button.addEventListener("click", () => {
        const block = button.closest(".block") || button.closest(".card") || button.closest(".sub");
        if (!block) return;
        addToCart(block.dataset.name, Number(block.dataset.price));
        showToast(`${block.dataset.name} added!`);
    });
});
updateCartCount();
renderCart();


const modal = document.getElementById("product-modal");
 
if (modal) {
    const modalImg = document.getElementById("modal-img");
    const modalName = document.getElementById("modal-name");
    const modalNotes = document.getElementById("modal-notes");
    const modalBrewing = document.getElementById("modal-brewing");
    const modalPrice = document.getElementById("modal-price");
    const modalAdd = document.getElementById("modal-add");
    const modalClose = document.getElementById("modal-close");
 
    document.querySelectorAll(".block, .card").forEach(card => {
        card.addEventListener("click", () => {
            modalImg.src = card.querySelector("img")?.src || "";
            modalName.textContent = card.dataset.name;
            modalNotes.textContent = card.dataset.notes || "";
            modalBrewing.textContent = card.dataset.brewing || "";
            modalPrice.textContent = `K${card.dataset.price}`;
            modalAdd.dataset.name = card.dataset.name;
            modalAdd.dataset.price = card.dataset.price;
            modal.classList.remove("hidden");
        });
    });
 
    modalAdd.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(modalAdd.dataset.name, Number(modalAdd.dataset.price));
        showToast(`${modalAdd.dataset.name} added!`);
    });
 
    modalClose.addEventListener("click", () => modal.classList.add("hidden"));
 
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}
