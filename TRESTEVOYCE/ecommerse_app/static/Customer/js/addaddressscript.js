/* --- addaddressscript.js --- */

// 1. Initialize addresses from localStorage or use a default one
let myAddresses = JSON.parse(localStorage.getItem('myAddresses')) || [
    { 
        type: 'Home', 
        fname: 'sample', 
        lname: 'A.', 
        street: '123 Main Street', 
        brgy: 'Parag-um', 
        muni: 'Carigara', 
        prov: 'Leyte', 
        phone: '0963 xxx xxxx', 
        isDefault: true 
    }
];

// 2. Main Page Controller
document.addEventListener('DOMContentLoaded', () => {
    // If we are on address.html, render the list
    if (document.getElementById('address-grid-list')) {
        renderAddressesUI();
    }

    // If we are on addaddress.html, force the modal overlay to be visible
    const modal = document.getElementById('address-modal-ui');
    if (modal) {
        modal.style.display = 'flex';
    }
});

/**
 * SAVES A NEW ADDRESS
 * Triggered by the form on addaddress.html
 */
function saveNewAddress(event) {
    event.preventDefault();
    
    const newAddr = {
        type: document.getElementById('in-type').value,
        fname: document.getElementById('in-fname').value,
        lname: document.getElementById('in-lname').value,
        street: document.getElementById('in-street').value,
        brgy: document.getElementById('in-brgy').value,
        muni: document.getElementById('in-muni').value,
        prov: document.getElementById('in-prov').value,
        phone: document.getElementById('in-phone').value,
        isDefault: myAddresses.length === 0 // Default if it's the first one
    };

    myAddresses.push(newAddr);
    localStorage.setItem('myAddresses', JSON.stringify(myAddresses));
    
    alert("Address Added Successfully!");
    window.location.href = 'address.html'; // Redirect back to list
}

/**
 * RENDERS THE UI FOR address.html
 */
function renderAddressesUI() {
    const grid = document.getElementById('address-grid-list');
    if (!grid) return;

    grid.innerHTML = myAddresses.map((addr, index) => `
        <div class="address-card" style="border: 2px solid ${addr.isDefault ? '#f1c40f' : '#eee'}; padding: 25px; border-radius: 20px; background: #fff;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <span style="background: #f1f1f1; padding: 4px 12px; border-radius: 8px; font-size: 12px; color: #666; font-weight:700;">${addr.type}</span>
                ${addr.isDefault ? '<span style="background: #f1c40f; color: #fff; padding: 4px 12px; border-radius: 8px; font-size: 10px; font-weight: 900;">DEFAULT</span>' : ''}
            </div>
            <h3 style="margin: 0; font-weight: 900; font-size: 22px;">${addr.fname} ${addr.lname}</h3>
            <p style="margin: 5px 0; color: #888; font-weight: 700;">${addr.phone}</p>
            <p style="margin: 10px 0; color: #333; font-size: 14px; line-height: 1.5;">
                ${addr.street}, Brgy. ${addr.brgy}, ${addr.muni}, ${addr.prov}
            </p>
            <div style="margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                <button onclick="deleteAddress(${index})" style="background:none; border:none; color:#ff4d4d; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `).join('');
} // Added missing closing bracket here

/**
 * DELETES AN ADDRESS
 */
function deleteAddress(index) {
    if (confirm("Delete this address?")) {
        myAddresses.splice(index, 1);
        localStorage.setItem('myAddresses', JSON.stringify(myAddresses));
        renderAddressesUI();
    }
}

