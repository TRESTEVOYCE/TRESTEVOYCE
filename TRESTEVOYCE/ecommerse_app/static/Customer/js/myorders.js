/* --- myorders.js --- */
let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderOrdersUI();
    setupSearch();
});

/**
 * RENDERING LOGIC
 * One single function to build the UI with the Cancel button
 */
function renderOrdersUI() {
    const list = document.getElementById('orders-list-content');
    if (!list) return;

    if (myOrders.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:40px; color:#888;">
                <i class="fa-solid fa-box-open" style="font-size:40px;"></i>
                <p>No orders found yet.</p>
            </div>`;
        return;
    }

    list.innerHTML = myOrders.map((order, index) => `
        <div class="order-card" style="border:1px solid #ddd; padding:15px; border-radius:12px; margin-bottom:15px; background:#fff; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; gap:15px; align-items:center;">
                <img src="${order.img || order.image}" style="width:70px; height:70px; border-radius:10px; object-fit:cover;">
                <div>
                    <h4 style="margin:0; font-weight:900;">${order.name || order.productName}</h4>
                    <p style="margin:2px 0; color:#666; font-size:13px;">Order: ${order.orderNo || order.orderId}</p>
                    <p style="margin:2px 0; font-weight:bold;">₱${parseFloat(order.price).toFixed(2)}</p>
                    <span style="font-size:11px; background:#fff8e1; color:#f39c12; padding:2px 8px; border-radius:10px; font-weight:bold;">${order.status}</span>
                </div>
            </div>
            
            <button onclick="cancelOrder(${index})" 
                style="background:#ff4d4d; color:white; border:none; padding:8px 15px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:12px;">
                Cancel
            </button>
        </div>
    `).join('');
}

/**
 * CANCEL ORDER FUNCTION
 * Must be outside any other function to be globally accessible
 */
function cancelOrder(index) {
    if (confirm("Are you sure you want to cancel this order?")) {
        myOrders.splice(index, 1);
        localStorage.setItem('myOrders', JSON.stringify(myOrders));
        renderOrdersUI(); // Refresh the list
    }
}

/**
 * SEARCH LOGIC
 */
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
        const searchTerm = e.target.value.toLowerCase();
        const orderCards = document.querySelectorAll('.order-card');

        orderCards.forEach(card => {
            const cardText = card.innerText.toLowerCase();
            card.style.display = cardText.includes(searchTerm) ? "flex" : "none";
        });
    });
}