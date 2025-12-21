// LOGIN PAGE starts here --------------------

// Toggle between Customer and Vendor
const btnCustomer = document.getElementById('btn-customer');
const btnVendor = document.getElementById('btn-vendor');

btnCustomer.addEventListener('click', () => {
    btnCustomer.classList.add('active');
    btnVendor.classList.remove('active');
});

btnVendor.addEventListener('click', () => {
    btnVendor.classList.add('active');
    btnCustomer.classList.remove('active');
});

// Show/Hide password
const passwordInput = document.getElementById('password-input');
const toggleEye = document.getElementById('toggle-eye');

toggleEye.addEventListener('click', () => {
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleEye.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleEye.textContent = '👁️';
    }
});


