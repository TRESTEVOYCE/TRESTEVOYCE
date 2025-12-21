document.addEventListener('DOMContentLoaded', () => {
    const editBtn = document.getElementById('edit-btn');
    const saveBtn = document.getElementById('save-btn');
    const inputs = document.querySelectorAll('input, textarea');
    const changePhotoBtn = document.getElementById('change-photo');
    const photoUpload = document.getElementById('profile-upload');
    const preview = document.getElementById('profile-preview');

    editBtn.addEventListener('click', () => {
        inputs.forEach(el => el.disabled = false);
        editBtn.classList.add('hidden');
        saveBtn.classList.remove('hidden');
        changePhotoBtn.classList.remove('hidden');
    });

    saveBtn.addEventListener('click', () => {
        inputs.forEach(el => el.disabled = true);
        saveBtn.classList.add('hidden');
        editBtn.classList.remove('hidden');
        changePhotoBtn.classList.add('hidden');
        alert('Changes saved (UI only)');
    });

    changePhotoBtn.addEventListener('click', () => {
        photoUpload.click();
    });

    photoUpload.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) {
            preview.src = URL.createObjectURL(file);
        }
    });
});

// Payment Settings Edit/Save Buttons
const editPaymentBtn = document.getElementById('edit-payment-btn');
const savePaymentBtn = document.getElementById('save-payment-btn');
const paymentInputs = document.querySelectorAll('.vendor-card:nth-of-type(2) input');

editPaymentBtn.addEventListener('click', () => {
    paymentInputs.forEach(el => el.disabled = false);
    editPaymentBtn.classList.add('hidden');
    savePaymentBtn.classList.remove('hidden');
});

savePaymentBtn.addEventListener('click', () => {
    paymentInputs.forEach(el => el.disabled = true);
    savePaymentBtn.classList.add('hidden');
    editPaymentBtn.classList.remove('hidden');
    alert('Payment settings saved (UI only)');
});

// Shipping Settings Edit/Save Buttons
const editShippingBtn = document.getElementById('edit-shipping-btn');
const saveShippingBtn = document.getElementById('save-shipping-btn');
const shippingInputs = document.querySelectorAll('.vendor-card:nth-of-type(3) input'); // 3rd card

editShippingBtn.addEventListener('click', () => {
    shippingInputs.forEach(el => el.disabled = false);
    editShippingBtn.classList.add('hidden');
    saveShippingBtn.classList.remove('hidden');
});

saveShippingBtn.addEventListener('click', () => {
    shippingInputs.forEach(el => el.disabled = true);
    saveShippingBtn.classList.add('hidden');
    editShippingBtn.classList.remove('hidden');
    alert('Shipping settings saved (UI only)');
});


// Export and Close Store actions
document.querySelector('.btn-primary').addEventListener('click', () => {
    alert('Export started (UI only)');
});

document.querySelector('.btn-danger').addEventListener('click', () => {
    const confirmClose = confirm('Are you sure you want to close your store? This action cannot be undone.');
    if (confirmClose) {
        alert('Store closed (UI only)');
    }
});

