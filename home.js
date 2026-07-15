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
    cart.push({ name, price });
    saveCart(cart);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = `(${getCart().length})`;
}


function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = "<p>Please Add your cart.</p>";
        const totalEl = document.getElementById("cart-total");
        if (totalEl) totalEl.textContent = "";
        return;
    }

    container.innerHTML = cart.map((item, i) => `
        <div class="cart-row">
            <span>${item.name}</span>
            <span>K${item.price}</span>
            <button onclick="removeFromCart(${i})">Remove</button>
        </div>
    `).join("");

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const totalEl = document.getElementById("cart-total");
    if (totalEl) totalEl.textContent = `Your Total: K${total}`;
}

document.querySelectorAll(".cart-btn").forEach(button => {
    button.addEventListener("click", () => {
        const block = button.closest(".block") || button.closest(".card");
        addToCart(block.dataset.name, Number(block.dataset.price));
    });
});
updateCartCount();
renderCart();
