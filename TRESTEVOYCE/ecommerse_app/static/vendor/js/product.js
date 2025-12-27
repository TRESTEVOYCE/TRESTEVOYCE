// ---------- Sidebar Menu Active Highlight ----------
const menuItems = document.querySelectorAll('.sidebar ul.menu li');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// ---------- Product Search ----------
const searchInput = document.querySelector('#product-search');
const searchBtn = document.querySelector('#search-btn');

function filterProducts() {
    if (!searchInput) return;

    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('.products-table tbody tr');

    rows.forEach(row => {
        const productName = row.cells[0].textContent.toLowerCase();
        row.style.display = productName.includes(filter) ? '' : 'none';
    });
}

// Live search
if (searchInput) {
    searchInput.addEventListener('keyup', filterProducts);
}

// Search icon click
if (searchBtn) {
    searchBtn.addEventListener('click', filterProducts);
}

// ---------- Edit Product ----------
document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.dataset.id;
        window.location.href = `/vendor/products/edit/${productId}/`;
    });
});

// ---------- Delete Product ----------
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const productId = btn.dataset.id;
        if (confirm('Are you sure you want to delete this product?')) {
            window.location.href = `/vendor/products/delete/${productId}/`;
        }
    });
});

document.getElementById('add-product-btn').addEventListener('click', function() {
    window.location.href = "{% url 'add_product' %}";
});
