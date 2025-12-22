/* --- productscript.js --- */

let currentQty = 1;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Load the specific product details from localStorage
    const data = JSON.parse(localStorage.getItem('selectedProduct'));

    if (data) {
        document.getElementById('view-img').src = data.image || data.img;
        document.getElementById('view-title').innerText = data.title || data.name;
        document.getElementById('view-price').innerText = data.price;
        document.getElementById('view-desc').innerText = data.description || data.desc;
    }
});

// 2. Quantity Management
function setQty(change) {
    const qtyDisplay = document.getElementById('view-qty');
    currentQty = Math.max(1, currentQty + change); // Prevents qty < 1
    if (qtyDisplay) qtyDisplay.innerText = currentQty;
}

// 3. Notification Logic
function showNotification(message) {
    const toast = document.createElement('div');
    toast.className = 'cart-notification';
    toast.innerHTML = `<i class="fa fa-circle-check"></i> ${message}`;
    document.body.appendChild(toast);

    // Animation triggers
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function addToCartFromDetail() {
    const data = JSON.parse(localStorage.getItem('selectedProduct'));
    if (!data) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const item = {
        id: data.id,
        name: data.name || data.title,
        price: data.price,
        img: data.img || data.image,
        qty: currentQty
    };

    const existing = cart.find(i => i.id === item.id);
    if (existing) {
        existing.qty += item.qty;
    } else {
        cart.push(item);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Use showToast instead of showNotification for consistency
    showToast(`${item.name} added to cart!`);
}


/**
 * BUY NOW / CHECKOUT
 * Processes the product and saves it to myorders.html with matching keys
 */
function checkoutSingle() {
    const data = JSON.parse(localStorage.getItem('selectedProduct'));
    if (!data) return;

    // Calculate total price based on the current quantity
    const basePrice = parseFloat(data.price);
    const totalPrice = basePrice * currentQty;

    const newOrder = {
        orderNo: "TRV-" + Math.floor(Math.random() * 100000),
        name: data.title || data.name,
        price: totalPrice, // Save the multiplied price
        img: data.image || data.img,
        qty: currentQty,
        status: 'Processing',
        date: new Date().toLocaleDateString()
    };

    let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    myOrders.unshift(newOrder);
    localStorage.setItem('myOrders', JSON.stringify(myOrders));

    window.location.href = 'myorders.html';
}


function closeDisplay() {
    window.location.href = 'home.html';
}


function showToast(message) {
    const toast = document.getElementById('message-toast');
    if (!toast) return;
    toast.querySelector('span').innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}