/* --- address.js --- */

// Initialize addresses from localStorage or use a default one
let myAddresses = JSON.parse(localStorage.getItem('myAddresses')) || [
    { 
        type: 'Home', 
        fname: 'Sample', 
        lname: 'User', 
        street: '123 Main Street', 
        brgy: 'Parag-um', 
        muni: 'Carigara', 
        prov: 'Leyte', 
        phone: '0963 xxx xxxx', 
        isDefault: true 
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Render the list if we are on the main address page
    if (document.getElementById('address-grid-list')) {
        renderAddressesUI();
    }
});

/* --- Fix for address.js --- */

// 1. Always pull the LATEST data from localStorage inside the render function
function renderAddressesUI() {
    const grid = document.getElementById('address-grid-list');
    if (!grid) return;

    // RE-FETCH the data from storage every time this runs
    const myAddresses = JSON.parse(localStorage.getItem('myAddresses')) || [];

    if (myAddresses.length === 0) {
        grid.innerHTML = "<p>No addresses found.</p>";
        return;
    }

    grid.innerHTML = myAddresses.map((addr, index) => `
        <div class="address-card" style="border: 2px solid ${addr.isDefault ? '#000' : '#ccc'}; padding: 25px; border-radius: 20px; background: #fff; position: relative;">
            <div style="margin-bottom: 10px;">
                <h3 style="margin: 0; font-weight: 900;">${addr.fname} ${addr.lname}</h3>
                <p style="margin: 5px 0; color: #888;">${addr.phone}</p>
                <p style="margin: 10px 0; font-size: 14px;">
                    ${addr.street}, Brgy. ${addr.brgy}, ${addr.muni}, ${addr.prov}
                </p>
            </div>
            
            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px; display: flex; align-items: center; gap: 20px;">
                <button onclick="window.location.href='editaddress.html?index=${index}'" style="background:none; border:none; cursor:pointer; font-weight: 900; display: flex; align-items: center; gap: 5px;">
                    <i class="fa-solid fa-pen-to-square"></i> EDIT
                </button>
                
                <button onclick="deleteAddress(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size: 18px;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteAddress(index) {
    if (confirm("Delete this address?")) {
        myAddresses.splice(index, 1);
        localStorage.setItem('myAddresses', JSON.stringify(myAddresses));
        renderAddressesUI();
    }
}



/**
 * SEARCH FUNCTIONALITY
 * (Optional but recommended for your task)
 */
function triggerSearch() {
    const term = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.address-card');
    
    cards.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(term) ? "block" : "none";
    });
}


/* --- Inside address.js --- */

function renderAddressesUI() {
    const grid = document.getElementById('address-grid-list');
    if (!grid) return;

    // Check if there are addresses to display
    if (myAddresses.length === 0) {
        grid.innerHTML = "<p>No addresses found.</p>";
        return;
    }

    grid.innerHTML = myAddresses.map((addr, index) => `
        <div class="address-card" style="border: 2px solid ${addr.isDefault ? '#000' : '#ccc'}; padding: 25px; border-radius: 20px; background: #fff; position: relative;">
            <div style="margin-bottom: 10px;">
                <h3 style="margin: 0; font-weight: 900;">${addr.fname} ${addr.lname}</h3>
                <p style="margin: 5px 0; color: #888;">${addr.phone}</p>
                <p style="margin: 10px 0; font-size: 14px;">
                    ${addr.street}, Brgy. ${addr.brgy}, ${addr.muni}, ${addr.prov}
                </p>
            </div>
            
            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px; display: flex; align-items: center; gap: 20px;">
                <button onclick="window.location.href='editaddress.html?index=${index}'" style="background:none; border:none; cursor:pointer; font-weight: 900; display: flex; align-items: center; gap: 5px;">
                    <i class="fa-solid fa-pen-to-square"></i> EDIT
                </button>
                
                <button onclick="deleteAddress(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size: 18px;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}