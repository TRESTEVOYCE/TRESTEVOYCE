/* --- DATA --- */
const products = [
    { id: 1, name: "Summer Floral Set", price: 590.00, category: "clothing", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", flash: true, progress: 75, desc: "A vibrant, breathable floral set perfect for tropical weather and summer outings." },
    { id: 2, name: "Premium Leather Bag", price: 850.00, category: "bags", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500", flash: true, progress: 40, desc: "Elegant handcrafted leather bag with premium stitching and plenty of space." },
    { id: 3, name: "Gold Classic Watch", price: 1250.00, category: "watches", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", flash: true, progress: 90, desc: "Timeless gold-plated watch with water resistance and luxury sapphire glass." },
    { id: 4, name: "Urban Sneakers", price: 950.00, category: "shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", flash: false, desc: "Lightweight urban sneakers built for daily comfort and high performance." },
    { id: 5, name: "Denim Jacket", price: 720.00, category: "clothing", img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500", flash: false, desc: "Rugged denim jacket with a classic vintage wash and comfortable fit." }
];

// Persistent Storage Init address
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let myOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
let myAddresses = [
    { type: 'Home', fname: 'customer', lname: 'A.', street: '123 Main Street', brgy: 'Parag-um', muni: 'Carigara', prov: 'Leyte', phone: '0963 xxx xxxx', isDefault: true }
];
let selectedItems = new Set();
let currentViewingId = null;
let q = 1;



/* --- INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
    // Detect which page we are on
    if (document.getElementById('product-display-section')) {
        loadProductDetails();
    } else {
        renderGrids();
        setupEventListeners();
        updateUI();
    }
});

function setupEventListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGrids(btn.getAttribute('data-category'));
        });
    });

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') executeSearch(e.target.value);
        });
    }
}

/* --- NAVIGATION & PAGE LOGIC --- */

function openDisplay(id) {
    const p = products.find(item => item.id === id);
    if (!p) return;
    localStorage.setItem('selectedProduct', JSON.stringify(p));
    window.location.href = 'productclick.html';
}

function loadProductDetails() {
    const data = localStorage.getItem('selectedProduct');
    if (!data) return;

    const p = JSON.parse(data);
    currentViewingId = p.id;

    // Populate HTML
    document.getElementById('view-img').src = p.img;
    document.getElementById('view-title').innerText = p.name;
    document.getElementById('view-price').innerText = p.price.toFixed(2);
    document.getElementById('view-desc').innerText = p.desc;
    
    q = 1; 
    document.getElementById('view-qty').innerText = q;
}

function closeDisplay() {
    window.location.href = 'home.html';
}



/* --- CART & BUYING ACTIONS --- */

function addToCart(id, qty) {
    const p = products.find(prod => prod.id === id);
    const existing = cart.find(item => item.id === id);
    if(existing) existing.qty += qty;
    else cart.push({...p, qty});
    
    updateUI();
    showToast(`${p.name} added to cart!`);
}

/**
 * 1. ADD TO CART (Stay on page)
 * This only adds the item to the cart and shows a message.
 */
function addToCartFromDetail() {
    if (currentViewingId) {
        // Add to the cart array
        addToCart(currentViewingId, q); 
        
        // Show success message without redirecting
        showToast("Added to cart successfully!");
    }
}

/**
 * 2. BUY NOW (Redirect to Orders)
 * This creates an official order and takes the user to myorders.html.
 */
function checkoutSingle() {
    // Get product from current view
    const data = localStorage.getItem('selectedProduct');
    if (!data) return;
    const p = JSON.parse(data);

    const newOrder = {
        orderNo: "ORD-" + Math.floor(Math.random() * 90000 + 10000),
        name: p.name,
        price: p.price * q, 
        img: p.img,
        status: "Processing",
        date: new Date().toLocaleDateString()
    };

    // IMPORTANT: Use 'myOrders' as the key
    let currentOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    currentOrders.unshift(newOrder); 
    localStorage.setItem('myOrders', JSON.stringify(currentOrders));

    showToast("Order Placed!");
    setTimeout(() => {
        window.location.href = 'myorders.html';
    }, 1000);
}


/* --- Pag show hin items ha shopping cart ngan whishlist --- */

function updateUI() {
    // Update Badges
    if(document.getElementById('wish-badge')) document.getElementById('wish-badge').innerText = wishlist.length;
    if(document.getElementById('wish-count-header')) document.getElementById('wish-count-header').innerText = wishlist.length; // Added for sidebar header
    
    const cartCount = cart.reduce((acc, curr) => acc + curr.qty, 0);
    if(document.getElementById('cart-badge')) document.getElementById('cart-badge').innerText = cartCount;

    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Render the lists
    renderCart();
    renderWishlist(); 
}


function renderCart() {
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    if (!cartList) return;

    if (cart.length === 0) {
        cartList.innerHTML = '<p style="padding: 20px; text-align: center;">Your cart is empty.</p>';
        if (cartTotal) cartTotal.innerText = "₱0.00";
        return;
    }

    let total = 0;
    cartList.innerHTML = cart.map(item => {
        // Check if item is in the selectedItems Set
        const isSelected = selectedItems.has(item.id);
        if (isSelected) {
            total += item.price * item.qty;
        }

        return `
            <div class="menu-item" style="display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid #eee;">
                <input type="checkbox" 
                       ${isSelected ? 'checked' : ''} 
                       onchange="toggleSelectItem(${item.id})" 
                       style="cursor: pointer; width: 18px; height: 18px;">
                <img src="${item.img}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
                <div style="flex: 1;">
                    <h5 style="margin: 0; font-size: 14px;">${item.name}</h5>
                    <small>₱${item.price.toFixed(2)} x ${item.qty}</small>
                </div>
                <i class="fa-solid fa-trash" style="color: #ff3b3b; cursor: pointer;" onclick="removeFromCart(${item.id})"></i>
            </div>
        `;
    }).join('');

    if (cartTotal) cartTotal.innerText = `₱${total.toFixed(2)}`;
}


function toggleSelectItem(id) {
    if (selectedItems.has(id)) {
        selectedItems.delete(id);
    } else {
        selectedItems.add(id);
    }
    renderCart(); // Refresh only the cart UI to update the total
}

function checkoutCart() {
    if (selectedItems.size === 0) {
        alert("Please select at least one item to checkout!");
        return;
    }

    let currentOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    
    // Filter cart for only selected items
    const itemsToBuy = cart.filter(item => selectedItems.has(item.id));

    itemsToBuy.forEach(item => {
        const newOrder = {
            orderNo: "ORD-" + Math.floor(Math.random() * 90000 + 10000),
            name: item.name,
            price: item.price * item.qty, 
            img: item.img,
            status: "Processing",
            date: new Date().toLocaleDateString()
        };
        currentOrders.unshift(newOrder);
    });

    localStorage.setItem('myOrders', JSON.stringify(currentOrders));
    
    // Remove ONLY the selected items from the cart
    cart = cart.filter(item => !selectedItems.has(item.id));
    selectedItems.clear(); // Reset selection
    
    updateUI();
    
    showToast("Selected items ordered!");
    setTimeout(() => {
        window.location.href = 'myorders.html';
    }, 1000);
}


// pag remove hin item tikang ha cart

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateUI();
}



// pag show hin item ha wishlist
function toggleWish(id) {
    const index = wishlist.findIndex(item => item.id === id);
    if (index > -1) {
        wishlist.splice(index, 1);
        showToast("Removed from wishlist");
    } else {
        const p = products.find(prod => prod.id === id);
        wishlist.push(p);
        showToast("Added to wishlist!");
    }
    updateUI();
    renderGrids(); 
}

function renderWishlist() {
    const wishListEl = document.getElementById('wishlist-list');
    if (!wishListEl) return;

    if (wishlist.length === 0) {
        wishListEl.innerHTML = '<p style="padding: 20px; text-align: center; color: #888;">Your wishlist is empty.</p>';
        return;
    }

    wishListEl.innerHTML = wishlist.map(item => `
        <div class="menu-item" style="display: flex; align-items: center; gap: 12px; padding: 12px; border-bottom: 1px solid #eee;">
            <img src="${item.img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <h5 style="margin: 0; font-size: 14px; font-weight: 700;">${item.name}</h5>
                <p style="margin: 4px 0 0; color: #b58d3d; font-weight: bold;">₱${item.price.toFixed(2)}</p>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <i class="fa-solid fa-cart-plus" style="color: #000; cursor: pointer; font-size: 18px;" onclick="addToCart(${item.id}, 1)"></i>
                <i class="fa-solid fa-trash" style="color: #ff3b3b; cursor: pointer; font-size: 16px;" onclick="toggleWish(${item.id})"></i>
            </div>
        </div>
    `).join('');
}


// pag show hin products ha home page
function renderGrids(filter = "all") {
    const arrivalsGrid = document.getElementById('new-arrivals-grid');
    const flashGrid = document.getElementById('flash-deals-grid');
    if (!arrivalsGrid || !flashGrid) return;
    arrivalsGrid.innerHTML = ""; flashGrid.innerHTML = "";

    products.forEach(p => {
        if (filter !== "all" && p.category !== filter) return;
        const isFav = wishlist.some(item => item.id === p.id);
        const card = `
            <div class="product-card" onclick="openDisplay(${p.id})"> 
                <div class="img-wrapper">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="heart-btn" style="background: ${isFav ? '#ff3b3b' : '#888'}" onclick="event.stopPropagation(); toggleWish(${p.id})">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </div>
                </div>
                <div class="info">
                    <h4>${p.name}</h4>
                    <div class="price-row">
                        <span class="price">₱${p.price.toFixed(2)}</span>
                        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id}, 1)">Add to Cart</button>
                    </div>
                </div>
            </div>`;
        if (p.flash) flashGrid.innerHTML += card;
        else arrivalsGrid.innerHTML += card;
    });
}

function checkoutCart() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Convert cart items into orders
    let currentOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
    
    cart.forEach(item => {
        const newOrder = {
            orderNo: "ORD-" + Math.floor(Math.random() * 90000 + 10000),
            name: item.name,
            price: item.price * item.qty, 
            img: item.img,
            status: "Processing",
            date: new Date().toLocaleDateString()
        };
        currentOrders.unshift(newOrder);
    });

    localStorage.setItem('myOrders', JSON.stringify(currentOrders));
    
    // Clear cart after checkout
    cart = [];
    updateUI();
    
    showToast("Checkout successful!");
    setTimeout(() => {
        window.location.href = 'myorders.html';
    }, 1000);
}

/* --- UTILITIES --- */

function showToast(message) {
    const toast = document.getElementById('message-toast');
    if (!toast) return;
    toast.querySelector('span').innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function setQty(n) { 
    q = Math.max(1, q + n); 
    const qtyDisplay = document.getElementById('view-qty');
    if(qtyDisplay) qtyDisplay.innerText = q; 
}

function toggleSidebar(id) {
    const overlay = document.getElementById('overlay');
    if(overlay) overlay.style.display = 'block';
    const sidebar = document.getElementById(id);
    if(sidebar) sidebar.classList.add('active');
}

function closeAllSidebars() {
    const overlay = document.getElementById('overlay');
    if(overlay) overlay.style.display = 'none';
    document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('active'));
}

function hideAllPages() {
    const pages = ['home-wrapper', 'orders-page', 'addresses-page', 'settings-page', 'help-center-page'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

 // function para han search bar
function executeSearch(query) {
    const term = query.toLowerCase().trim();
    const arrivalsGrid = document.getElementById('new-arrivals-grid');
    const flashGrid = document.getElementById('flash-deals-grid');
    
    if (!arrivalsGrid || !flashGrid) return;

    // Filter products based on name or category
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.category.toLowerCase().includes(term)
    );

    // Re-render the grids with the filtered list
    renderFilteredGrids(filtered);
    
    // Smooth scroll to the shop section to show results
    document.getElementById('shop-all').scrollIntoView({ behavior: 'smooth' });
}

// Helper to render specific products instead of the whole list
function renderFilteredGrids(filteredList) {
    const arrivalsGrid = document.getElementById('new-arrivals-grid');
    const flashGrid = document.getElementById('flash-deals-grid');
    arrivalsGrid.innerHTML = ""; 
    flashGrid.innerHTML = "";

    if (filteredList.length === 0) {
        arrivalsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 20px;'>No products found matching your search.</p>";
        return;
    }

    filteredList.forEach(p => {
        const isFav = wishlist.some(item => item.id === p.id);
        const card = `
            <div class="product-card" onclick="openDisplay(${p.id})"> 
                <div class="img-wrapper">
                    <img src="${p.img}" alt="${p.name}">
                    <div class="heart-btn" style="background: ${isFav ? '#ff3b3b' : '#888'}" onclick="event.stopPropagation(); toggleWish(${p.id})">
                        <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </div>
                </div>
                <div class="info">
                    <h4>${p.name}</h4>
                    <div class="price-row">
                        <span class="price">₱${p.price.toFixed(2)}</span>
                        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id}, 1)">Add to Cart</button>
                    </div>
                </div>
            </div>`;
        if (p.flash) flashGrid.innerHTML += card;
        else arrivalsGrid.innerHTML += card;
    });
}


/* ---ADI NGA FUNCTION han pag log out temporarily!!! --- */
function handleLogout() {
    // 1. Confirm with the user
    const confirmLogout = confirm("Are you sure you want to log out of Trestevoyce?");
    
    if (confirmLogout) {
        // 2. Optional: Clear local storage or session data if you use it
        localStorage.clear(); 
        sessionStorage.clear();

        // 3. Show a toast message before leaving
        showToast("Logging out...");

        // 4. Redirect to your login or index page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html'; // Change 'index.html' to your login page filename
        }, 1000);
    }
}


/* ---ADI NGA FUNCTION AN PAGTAWAG HAN KADA PAGE!!! --- */

function openOrdersPage() {
    // Directly link to the myorders.html file
    window.location.href = 'myorders.html';
}


function openAddressPage() {
    // Redirect to the standalone address page
    window.location.href = 'address.html';
}

function openSettingsPage() {
    window.location.href = 'setting.html';
}

function openHelpCenterPage() {
    window.location.href = 'helpcenter.html';
}