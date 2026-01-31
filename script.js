
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const header = document.querySelector("header");
let ticking = false;

// SAVE CART
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ADD TO CART
function addToCart(name, price) {
    const item = cart.find(p => p.name === name);

    if (item) {
        item.qty++;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    saveCart();
    renderCart();
    toast("Added to cart");
}

// REMOVE ITEM
function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    saveCart();
    renderCart();
}

// CHANGE QTY
function changeQty(name, delta) {
    const item = cart.find(p => p.name === name);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) removeItem(name);

    saveCart();
    renderCart();
}

// RENDER CART
function renderCart() {
    const list = document.getElementById("cartItems");
    const totalEl = document.getElementById("total");
    const countEl = document.getElementById("cartCount");

    list.innerHTML = "";
    let total = 0;
    let count = 0;

    const frag = document.createDocumentFragment();

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="cart-row">
                <div class="cart-info">
                    <strong>${item.name}</strong>
                    <span class="price">₹${item.price} × ${item.qty}</span>
                </div>

                <div class="cart-actions">
                    <button class="qty-btn" onclick="changeQty('${item.name}', -1)">−</button>
                    <span class="qty">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.name}', 1)">+</button>
                    <button class="remove-btn" onclick="removeItem('${item.name}')">Remove</button>
                </div>
            </div>
        `;

        frag.appendChild(li);
    });

    list.appendChild(frag);
    totalEl.innerText = total;
    countEl.innerText = count;
}

// WHATSAPP ORDER
function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty");
        return;
    }

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const address = document.getElementById("custAddress").value.trim();

    if (!name || !phone || !address) {
        alert("Please fill all details");
        return;
    }

    localStorage.setItem("customer", JSON.stringify({ name, phone, address }));

    let message = `🙏 Welcome to *Vijayalakshmi Foods* 🌿%0A%0A`;
    message += `Thank you for choosing us.%0A`;
    message += `Here are the details of your order:%0A%0A`;

    message += `--------------------------------%0A`;
    message += `🛒 *Order Details*%0A`;

    cart.forEach(i => {
        message += `• ${i.name} × ${i.qty} — ₹${i.price * i.qty}%0A`;
    });

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    message += `%0A--------------------------------%0A`;
    message += `💰 *Total Amount:* ₹${total}%0A`;
    message += `%0A--------------------------------%0A`;
    message += `👤 *Customer Name:* ${name}%0A`;
    message += `📞 *Phone:* ${phone}%0A`;
    message += `🏠 *Delivery Address:*%0A${address}%0A`;
    message += `--------------------------------%0A`;
    message += `%0AKindly confirm the order and delivery details.%0A`;
    message += `We appreciate your support.`;


    document.getElementById("orderSuccess").style.display = "flex";

    setTimeout(() => {
        document.getElementById("orderSuccess").style.display = "none";
        window.open(`https://wa.me/919618082853?text=${message}`, "_blank");
    }, 1200);

}

// LOAD SAVED DATA
function loadCustomer() {
    const data = JSON.parse(localStorage.getItem("customer"));
    if (!data) return;

    document.getElementById("custName").value = data.name;
    document.getElementById("custPhone").value = data.phone;
    document.getElementById("custAddress").value = data.address;
}



function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// TOAST
function toast(text) {
    const t = document.createElement("div");
    t.innerText = text;
    t.style.cssText = `
    position:fixed;
    bottom:20px;
    right:20px;
    background:#2f6b2f;
    color:white;
    padding:12px 22px;
    border-radius:8px;
    font-weight:600;
    font-size:14px;
    box-shadow:0 4px 10px rgba(0,0,0,0.2);
    z-index:9999;
`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
}

// INIT
renderCart();
loadCustomer();

window.addEventListener("scroll", () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            header.classList.toggle("scrolled", window.scrollY > 20);
            ticking = false;
        });
        ticking = true;
    }
});


function goToCart() {
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
}

// ===============================
// SCROLL TO PRODUCTS (Shop Now)
// ===============================
function scrollToProducts() {
    const section = document.getElementById("products");
    if (!section) return;

    const yOffset = -90; // sticky header height
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
}




// ===============================
// FILTER PRODUCTS
// ===============================
function filterProducts(category) {
    const cards = document.querySelectorAll(".products .card");
    const buttons = document.querySelectorAll(".filters button");

    // Set active button
    buttons.forEach(btn => btn.classList.remove("active"));


    // Show/hide products
    cards.forEach(card => {
        if (category === "all" || card.dataset.category === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    filterProducts("all");
});
