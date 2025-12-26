const btnCustomer = document.getElementById('btn-customer');
const btnVendor = document.getElementById('btn-vendor');
const customerForm = document.getElementById('customer-form');
const vendorForm = document.getElementById('vendor-form');

/* Show/hide forms based on toggle */
function toggleForm(activeForm, inactiveForm) {
    activeForm.style.display = 'block';
    inactiveForm.style.display = 'none';
}

/* Customer toggle */
btnCustomer.addEventListener('click', () => {
    btnCustomer.classList.add('active');
    btnVendor.classList.remove('active');
    toggleForm(customerForm, vendorForm);
});

/* Vendor toggle */
btnVendor.addEventListener('click', () => {
    btnVendor.classList.add('active');
    btnCustomer.classList.remove('active');
    toggleForm(vendorForm, customerForm);
});

/* Password toggle visibility */
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;
        input.type = input.type === 'password' ? 'text' : 'password';
        toggle.textContent = input.type === 'password' ? '👁️' : '🙈';
    });
});
