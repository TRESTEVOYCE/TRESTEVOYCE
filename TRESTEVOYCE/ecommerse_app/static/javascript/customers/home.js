  /* the javascript */
    const products = [
      { id: 1, name: "Summer Floral Set", price: 590.00, category: "clothing", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", flash: true, progress: 75, desc: "A vibrant, breathable floral set perfect for tropical weather and summer outings." },
      { id: 2, name: "Premium Leather Bag", price: 850.00, category: "bags", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500", flash: true, progress: 40, desc: "Elegant handcrafted leather bag with premium stitching and plenty of space." },
      { id: 3, name: "Gold Classic Watch", price: 1250.00, category: "watches", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", flash: true, progress: 90, desc: "Timeless gold-plated watch with water resistance and luxury sapphire glass." },
      { id: 4, name: "Urban Sneakers", price: 950.00, category: "shoes", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", flash: false, desc: "Lightweight urban sneakers built for daily comfort and high performance." },
      { id: 5, name: "Denim Jacket", price: 720.00, category: "clothing", img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500", flash: false, desc: "Rugged denim jacket with a classic vintage wash and comfortable fit." }
    ];

    let cart = [];
    let wishlist = [];
    let myOrders = [];
    let myAddresses = [
        { type: 'Home', fname: 'Joyce', lname: 'A.', street: '123 Main Street', brgy: 'Parag-um', muni: 'Carigara', prov: 'Leyte', phone: '0963 xxx xxxx', isDefault: true }
    ];
    let currentViewingId = null;
    let q = 1;

    function renderGrids(filter = "all") {
      const arrivalsGrid = document.getElementById('new-arrivals-grid');
      const flashGrid = document.getElementById('flash-deals-grid');
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
              ${p.flash ? `<div class="selling-fast"><div class="progress" style="width: ${p.progress}%;"></div><span>🔥 SELLING FAST</span></div>` : ''}
            </div>
          </div>`;
        if (p.flash) flashGrid.innerHTML += card;
        else arrivalsGrid.innerHTML += card;
      });
    }

    function toggleSidebar(id) {
      document.getElementById('overlay').style.display = 'block';
      document.getElementById(id).classList.add('active');
    }

    function closeAllSidebars() {
      document.getElementById('overlay').style.display = 'none';
      document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('active'));
    }

    function addToCart(id, qty) {
      const p = products.find(prod => prod.id === id);
      const existing = cart.find(item => item.id === id);
      if(existing) existing.qty += qty;
      else cart.push({...p, qty});
      updateUI();
    }

    function addToCartFromDetail() { addToCart(currentViewingId, q); }

    function checkoutCart() {
        if(cart.length === 0) return alert("Cart is empty!");
        cart.forEach(item => {
            myOrders.unshift({
                orderNo: Math.floor(Math.random() * 900 + 100).toString(),
                name: item.name,
                price: item.price * item.qty,
                img: item.img,
                status: "processing"
            });
        });
        cart = [];
        updateUI();
        alert("Order placed successfully!");
        openOrdersPage();
    }

    function checkoutSingle() {
        const p = products.find(prod => prod.id === currentViewingId);
        myOrders.unshift({ orderNo: "001", name: p.name, price: p.price * q, img: p.img, status: "processing" });
        alert("Order placed successfully!");
        openOrdersPage();
    }

    function openOrdersPage() {
        closeAllSidebars();
        hideAllPages();
        document.getElementById('orders-page').style.display = "block";
        renderOrdersUI();
    }

    function openAddressPage() {
        closeAllSidebars();
        hideAllPages();
        document.getElementById('addresses-page').style.display = "block";
        renderAddressesUI();
    }

    function openSettingsPage() {
        closeAllSidebars();
        hideAllPages();
        document.getElementById('settings-page').style.display = "block";
    }

    function openHelpCenterPage() {
        closeAllSidebars();
        hideAllPages();
        document.getElementById('help-center-page').style.display = "block";
    }

    function hideAllPages() {
        document.getElementById('home-wrapper').style.display = "none";
        document.getElementById('product-display-section').style.display = "none";
        document.getElementById('orders-page').style.display = "none";
        document.getElementById('addresses-page').style.display = "none";
        document.getElementById('settings-page').style.display = "none";
        document.getElementById('help-center-page').style.display = "none";
    }

    function closeDisplay() {
        hideAllPages();
        document.getElementById('home-wrapper').style.display = "block";
    }

// Function to display orders with their status
function renderOrdersUI() {
    const list = document.getElementById('orders-list-content');
    if (myOrders.length === 0) {
        list.innerHTML = "<p style='text-align:center; padding: 20px;'>No orders yet.</p>";
        return;
    }

    list.innerHTML = myOrders.map(order => {
        // Determine the style class and icon based on status
        let statusClass = `status-${order.status.toLowerCase()}`;
        let icon = order.status === 'processing' ? 'fa-spinner fa-spin' : 
                   order.status === 'shipped' ? 'fa-truck-fast' : 'fa-circle-check';

        return `
            <div class="order-item" style="flex-direction: column; align-items: flex-start; gap: 10px;">
                <div style="display: flex; width: 100%; align-items: center;">
                    <img src="${order.img}">
                    <div style="flex: 1;">
                        <h4 style="margin:0; font-size: 15px;">Order No. ${order.orderNo}</h4>
                        <p style="margin:5px 0; font-weight:900;">₱${order.price.toFixed(2)}</p>
                    </div>
                    <span class="status-tag ${statusClass}">
                        <i class="fa-solid ${icon}"></i> ${order.status}
                    </span>
                </div>
                ${order.status === 'processing' ? 
                    `<button class="order-cancel-btn" onclick="cancelOrder('${order.orderNo}')">Cancel Order</button>` : ''}
            </div>
        `;
    }).join('');
}

// Update Checkout to include status
function checkoutCart() {
    const itemsToBuy = cart.filter(item => selectedItems.has(item.id));
    if (itemsToBuy.length === 0) {
        alert("Please select items to checkout.");
        return;
    }
    
    itemsToBuy.forEach(item => {
        myOrders.unshift({
            orderNo: Math.floor(Math.random() * 9000 + 1000).toString(),
            name: item.name,
            price: item.price * item.qty,
            img: item.img,
            status: "processing" // New orders start here
        });
    });

    cart = cart.filter(item => !selectedItems.has(item.id));
    selectedItems.clear();
    updateUI();
    openOrdersPage(); // Automatically show the status page
}

function checkoutSingle() {
    const qty = parseInt(document.getElementById('view-qty').innerText);
    myOrders.unshift({
        orderNo: Math.floor(Math.random() * 9000 + 1000).toString(),
        name: currentViewProduct.name,
        price: currentViewProduct.price * qty,
        img: currentViewProduct.img,
        status: "processing"
    });
    updateUI();
    openOrdersPage();
}

    function cancelOrder(no) {
        if(confirm("Are you sure you want to cancel this order?")) {
            myOrders = myOrders.filter(o => o.orderNo !== no);
            renderOrdersUI();
        }
    }

    function toggleAddressModal(show) {
        document.getElementById('address-modal-ui').style.display = show ? 'flex' : 'none';
    }

    function saveNewAddress(e) {
        e.preventDefault();
        const newAddr = {
            type: document.getElementById('in-type').value,
            fname: document.getElementById('in-fname').value,
            lname: document.getElementById('in-lname').value,
            street: document.getElementById('in-street').value,
            brgy: document.getElementById('in-brgy').value,
            muni: document.getElementById('in-muni').value,
            prov: document.getElementById('in-prov').value,
            phone: document.getElementById('in-phone').value,
            isDefault: false
        };
        myAddresses.push(newAddr);
        toggleAddressModal(false);
        renderAddressesUI();
        document.getElementById('address-form-element').reset();
    }

function renderAddressesUI() {
    const grid = document.getElementById('address-grid-list');
    grid.innerHTML = myAddresses.map((addr, index) => `
        <div class="address-card" style="${addr.isDefault ? 'border: 2px solid var(--gold);' : ''}">
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <h3><i class="fa-solid ${addr.type.toLowerCase() === 'home' ? 'fa-house' : 'fa-briefcase'}"></i> ${addr.type}</h3>
                
                <div style="display: flex; gap: 12px; align-items: center;">
                    <button onclick="confirmDeleteAddress(${index})" style="background:none; border:none; color:#ff3b3b; cursor:pointer; font-size:18px;">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            </div>

            <div class="address-text">
                <strong style="font-size:18px;">${addr.fname} ${addr.lname}</strong><br>
                ${addr.street}<br>${addr.brgy}, ${addr.muni}<br>${addr.prov}, Philippines
            </div>
            
            <div class="contact-line" style="margin-bottom: 15px;">${addr.phone}</div>

            <div style="margin-top: auto;">
                ${addr.isDefault ? 
                    '<span class="tag-default" style="background:var(--gold); padding:5px 12px; border-radius:5px; font-weight:900; font-size:12px;"><i class="fa-solid fa-star"></i> DEFAULT ADDRESS</span>' : 
                    `<button class="btn-wish-cart" onclick="setDefaultAddress(${index})" style="width:100%; font-size:12px; padding:8px;">SET AS DEFAULT</button>`
                }
            </div>
        </div>
    `).join('');
}


    function toggleWish(id) {
      const p = products.find(prod => prod.id === id);
      const idx = wishlist.findIndex(item => item.id === id);
      if(idx > -1) wishlist.splice(idx, 1);
      else wishlist.push(p);
      updateUI();
      renderGrids();
    }

// NEW: Track selected items for checkout
let selectedItems = new Set();

function updateUI() {
    document.getElementById('wish-badge').innerText = wishlist.length;
    document.getElementById('wish-count-header').innerText = wishlist.length;
    document.getElementById('cart-badge').innerText = cart.reduce((acc, curr) => acc + curr.qty, 0);

    // Render Wishlist
    const wishListEl = document.getElementById('wishlist-list');
    wishListEl.innerHTML = wishlist.map(p => `
        <div class="wish-card">
          <img src="${p.img}">
          <div class="wish-info">
            <span>${p.category}</span>
            <h4>${p.name}</h4>
            <div class="price">₱${p.price.toFixed(2)}</div>
            <div class="wish-actions">
                <button class="btn-wish-cart" onclick="addToCart(${p.id}, 1)"><i class="fa-solid fa-cart-shopping"></i> Add to Cart</button>
                <button class="btn-delete" onclick="toggleWish(${p.id})"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </div>
        </div>`).join('');

    // RENDER CART WITH SELECTORS & DELETE
    const cartListEl = document.getElementById('cart-list');
    let checkoutTotal = 0;

    cartListEl.innerHTML = cart.map(p => {
        const isSelected = selectedItems.has(p.id);
        if (isSelected) checkoutTotal += p.price * p.qty;

        return `
          <div class="wish-card" style="align-items: center; gap: 10px;">
            <input type="checkbox" ${isSelected ? 'checked' : ''} 
                   onchange="toggleSelect(${p.id})" 
                   style="width: 18px; height: 18px; cursor: pointer;">
            
            <img src="${p.img}" style="width: 60px; height: 60px;">
            
            <div class="wish-info">
              <h4 style="font-size: 14px; margin: 0;">${p.name}</h4>
              <div class="price" style="font-size: 14px;">₱${(p.price * p.qty).toFixed(2)}</div>
              
              <div class="wish-actions" style="justify-content: space-between; margin-top: 5px;">
                <div class="qty-control" style="transform: scale(0.7); margin-left: -20px;">
                  <button class="qty-btn" onclick="changeCartQty(${p.id}, -1)">-</button>
                  <div class="qty-val">${p.qty}</div>
                  <button class="qty-btn" onclick="changeCartQty(${p.id}, 1)">+</button>
                </div>
                
                <button class="btn-delete" onclick="removeFromCart(${p.id})" style="color: #ff3b3b;">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>`;
    }).join('');

    document.getElementById('cart-total').innerText = `₱${checkoutTotal.toFixed(2)}`;
}

// NEW: Selection and Quantity Handlers
function toggleSelect(id) {
    if (selectedItems.has(id)) selectedItems.delete(id);
    else selectedItems.add(id);
    updateUI();
}

function changeCartQty(id, delta) {
    const item = cart.find(p => p.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) removeFromCart(id);
        else updateUI();
    }
}

function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);
    selectedItems.delete(id);
    updateUI();
}

// UPDATE: Checkout only selected items
function checkoutCart() {
    const itemsToBuy = cart.filter(item => selectedItems.has(item.id));
    if (itemsToBuy.length === 0) return alert("Please select items to checkout!");
    
    itemsToBuy.forEach(item => {
        myOrders.unshift({
            orderNo: Math.floor(Math.random() * 900 + 100).toString(),
            name: item.name,
            price: item.price * item.qty,
            img: item.img,
            status: "processing"
        });
    });

    // Remove only the items that were bought
    cart = cart.filter(item => !selectedItems.has(item.id));
    selectedItems.clear();
    
    updateUI();
    alert("Order placed for selected items!");
    openOrdersPage();
}

    function openDisplay(id) {
      const p = products.find(item => item.id === id);
      currentViewingId = id;
      hideAllPages();
      document.getElementById('product-display-section').style.display = "block";
      document.getElementById('view-img').src = p.img;
      document.getElementById('view-title').innerText = p.name;
      document.getElementById('view-price').innerText = p.price.toFixed(2);
      document.getElementById('view-desc').innerText = p.desc;
      q = 1;
      document.getElementById('view-qty').innerText = q;
      window.scrollTo(0, 0);
    }

    function setQty(n) {
      q = Math.max(1, q + n);
      document.getElementById('view-qty').innerText = q;
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderGrids(btn.getAttribute('data-category'));
      });
    });

    /* --- MISSING SCROLL LOGIC --- */
    window.onscroll = function() {
      const btn = document.getElementById("backToTop");
      if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        btn.style.display = "flex";
      } else {
        btn.style.display = "none";
      }
    };

    // --- SEARCH FUNCTIONALITY ---
document.getElementById('search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    // Filter the original products array
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
    );

    // Call a modified render function or update the grids manually
    renderFilteredResults(filteredProducts);
});

function renderFilteredResults(filteredList) {
    const arrivalsGrid = document.getElementById('new-arrivals-grid');
    const flashGrid = document.getElementById('flash-deals-grid');
    
    // Clear existing items
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

// Add this inside your <script> tag
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        // Remove 'active' class from all links
        document.querySelectorAll('.nav-links a').forEach(nav => nav.classList.remove('active'));
        
        // Add 'active' class to the clicked link
        this.classList.add('active');
    });
});

// Function to trigger search when the icon is clicked
function triggerSearch() {
    const input = document.getElementById('search-input');
    executeSearch(input.value);
}

// Optional: Allow the "Enter" key to also trigger the search
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        executeSearch(this.value);
    }
});

// The core logic to filter and display products
function executeSearch(query) {
    const searchTerm = query.toLowerCase().trim();
    
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.category.toLowerCase().includes(searchTerm)
    );

    const arrivalsGrid = document.getElementById('new-arrivals-grid');
    const flashGrid = document.getElementById('flash-deals-grid');
    
    arrivalsGrid.innerHTML = ""; 
    flashGrid.innerHTML = "";

    if (filteredProducts.length === 0) {
        arrivalsGrid.innerHTML = "<p style='grid-column: 1/-1; text-align: center; padding: 40px;'>No products found.</p>";
        return;
    }

    filteredProducts.forEach(p => {
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
              ${p.flash ? `<div class="selling-fast"><div class="progress" style="width: ${p.progress}%;"></div><span>🔥 SELLING FAST</span></div>` : ''}
            </div>
          </div>`;
        
        if (p.flash) flashGrid.innerHTML += card;
        else arrivalsGrid.innerHTML += card;
    });

    // Automatically scroll down to the results
    document.getElementById('shop-all').scrollIntoView({ behavior: 'smooth' });
}

// sending message

function submitHelpRequest() {
    const subject = document.getElementById('help-subject').value;
    const message = document.getElementById('help-message').value;
    const btn = document.getElementById('help-submit-btn');

    // 1. Validation
    if (!subject.trim() || !message.trim()) {
        alert("Please provide both a subject and a message.");
        return;
    }

    // 2. Visual "Sending" State
    const originalText = btn.innerText;
    btn.innerText = "SENDING...";
    btn.disabled = true;

    // 3. Simulate Network Delay (1.5 seconds)
    setTimeout(() => {
        // 4. Success Feedback
        alert("Ticket sent! We will reply to your registered email shortly.");
        
        // 5. Reset Form and Button
        btn.innerText = originalText;
        btn.disabled = false;
        document.getElementById('help-subject').value = "";
        document.getElementById('help-message').value = "";
        
        // 6. Return to Shop (Optional)
        closeDisplay();
    }, 1500);
}


// Function for the main product grid
function addToCart(id, qty) {
    const product = products.find(p => p.id === id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }

    updateUI();
    showToast(`${product.name} added to cart!`); // Trigger the notification
}

/* --- FIXED BUTTON FUNCTIONS --- */

/* --- FIXED PRODUCT DETAIL BUTTONS --- */
function addToCartFromDetail() {
    // Finds the product matching the ID currently being viewed
    if (currentViewingId) {
        const qty = parseInt(document.getElementById('view-qty').innerText);
        addToCart(currentViewingId, qty); // Triggers the existing cart logic
    }
}

function checkoutSingle() {
    const p = products.find(prod => prod.id === currentViewingId);
    if (!p) return;

    const qty = parseInt(document.getElementById('view-qty').innerText);
    
    // Creates a new order object and adds it to the start of the list
    const newOrder = {
        orderNo: Math.floor(100000 + Math.random() * 900000).toString(),
        name: p.name,
        price: p.price * qty,
        img: p.img,
        status: "processing"
    };

    myOrders.unshift(newOrder); 
    showToast("Order placed successfully!");
    openOrdersPage(); // Redirects user to see their new order
}

/* --- FIXED ADDRESS FUNCTIONS --- */

function setDefaultAddress(index) {
    // 1. Set all addresses to not default
    myAddresses.forEach(addr => addr.isDefault = false);
    
    // 2. Set the selected one as default
    myAddresses[index].isDefault = true;
    
    // 3. Refresh the UI and show confirmation
    renderAddressesUI();
    showToast("Default address updated!");
}

function confirmDeleteAddress(index) {
    if (myAddresses[index].isDefault) {
        alert("You cannot delete your default address. Please set another one as default first.");
        return;
    }
    if (confirm("Are you sure you want to delete this address?")) {
        myAddresses.splice(index, 1);
        renderAddressesUI();
    }
}


// --- FUNCTIONAL ADDRESS LOGIC ---

function setDefaultAddress(index) {
    // 1. Loop through all addresses and remove 'isDefault'
    myAddresses.forEach(addr => addr.isDefault = false);
    
    // 2. Set the clicked address as the new default
    myAddresses[index].isDefault = true;
    
    // 3. Re-render the UI and notify user
    renderAddressesUI();
    showToast("Default address updated!");
}

function confirmDeleteAddress(index) {
    // Prevent deleting the default address for safety
    if (myAddresses[index].isDefault) {
        alert("You cannot delete your default address. Set another one as default first.");
        return;
    }
    
    if (confirm("Are you sure you want to delete this address?")) {
        myAddresses.splice(index, 1);
        renderAddressesUI();
        showToast("Address deleted.");
    }
}

// Updated renderer to ensure buttons call the functions above
function renderAddressesUI() {
    const grid = document.getElementById('address-grid-list');
    if (!grid) return;

    grid.innerHTML = myAddresses.map((addr, index) => `
        <div class="address-card" style="${addr.isDefault ? 'border: 2px solid var(--gold);' : 'border: 1.5px solid #eee;'}">
            <div style="display:flex; justify-content:space-between; align-items:start;">
                <span class="tag-category" style="background:#f0f0f0; padding:2px 8px; border-radius:4px; font-size:11px;">${addr.type}</span>
                ${addr.isDefault ? '<span class="tag-default" style="background:var(--gold); padding:2px 8px; border-radius:4px; font-size:10px; font-weight:900;">DEFAULT</span>' : ''}
            </div>
            <h3 style="margin:10px 0 5px 0;">${addr.fname} ${addr.lname}</h3>
            <p style="font-size:13px; color:#666; margin:0;">${addr.phone}</p>
            <p style="font-size:13px; color:#333; margin:5px 0;">${addr.street}, Brgy. ${addr.brgy}, ${addr.muni}, ${addr.prov}</p>
            
            <div style="margin-top:15px; display:flex; gap:10px;">
                ${!addr.isDefault ? `<button onclick="setDefaultAddress(${index})" style="flex:1; padding:8px; cursor:pointer; background:white; border:1.5px solid black; font-weight:bold;">Set Default</button>` : ''}
                <button onclick="confirmDeleteAddress(${index})" style="padding:8px; cursor:pointer; background:none; border:none; color:#ff4444;"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}


// Ensure you have the showToast utility function
function showToast(message) {
    const toast = document.getElementById('message-toast');
    toast.querySelector('span').innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
    renderGrids();