/* --- editscript.js --- */

document.addEventListener('DOMContentLoaded', () => {
    const editForm = document.getElementById('edit-address-form');
    const urlParams = new URLSearchParams(window.location.search);
    const addressIndex = urlParams.get('index'); // Get index from URL

    let myAddresses = JSON.parse(localStorage.getItem('myAddresses')) || [];

    if (addressIndex !== null && myAddresses[addressIndex]) {
        const addr = myAddresses[addressIndex];
        
        // Populate inputs
        document.getElementById('edit-name').value = `${addr.fname || ''}`.trim();
        document.getElementById('edit-phone').value = addr.phone || '';
        document.getElementById('edit-street').value = addr.street || '';
        document.getElementById('edit-brgy').value = addr.brgy || '';
        document.getElementById('edit-muni').value = addr.muni || '';
        document.getElementById('edit-prov').value = addr.prov || '';
    }

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullName = document.getElementById('edit-name').value.trim();
        const nameParts = fullName.split(' ');
        const fname = nameParts[0] || '';
        const lname = nameParts.slice(1).join(' ') || '';

        // Update the item at the specific index
        myAddresses[addressIndex] = {
            ...myAddresses[addressIndex], 
            fname: fname,
            lname: lname,
            phone: document.getElementById('edit-phone').value,
            street: document.getElementById('edit-street').value,
            brgy: document.getElementById('edit-brgy').value,
            muni: document.getElementById('edit-muni').value,
            prov: document.getElementById('edit-prov').value
        };

        // Save back to localStorage
        localStorage.setItem('myAddresses', JSON.stringify(myAddresses));

        alert('Changes saved successfully!');
        window.location.href = 'address.html'; // Return to list
    });
});